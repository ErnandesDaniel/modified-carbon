-- liquibase formatted sql
-- changeset tikhon:1 splitStatements:false

-- 0. Установка расширения pgvector для векторного поиска
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Таблица пользователей
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Таблица идентификаций (OAuth2 / Auth)
CREATE TABLE user_identities (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    user_name VARCHAR(255),
    provider_name VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    CONSTRAINT fk_identity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_user_identities_provider_id ON user_identities(provider_user_id);
CREATE INDEX idx_user_identities_user_id ON user_identities(user_id);

-- 3. Таблица заметок с поддержкой BGE-M3 (Dense + Sparse + Text search)
CREATE TABLE notes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(1000),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    -- Dense вектор от BGE-M3 (1024 размерность) для семантического поиска
    embedding_dense VECTOR(1024),
    -- Sparse вектор для лексического поиска (генерируется локально)
    embedding_sparse VECTOR(1024),
    -- Text search vector для полнотекстового поиска (BM25-like)
    search_vector TSVECTOR,
    CONSTRAINT fk_note_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Индексы для таблицы заметок
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_is_deleted ON notes(is_deleted);
CREATE INDEX idx_notes_user_deleted ON notes(user_id, is_deleted);
CREATE INDEX idx_notes_created_at ON notes(created_at);
CREATE INDEX idx_notes_title ON notes(title);

-- 5. Индексы для векторного поиска (IVFFlat)
CREATE INDEX idx_notes_embedding_dense ON notes USING ivfflat (embedding_dense vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_notes_embedding_sparse ON notes USING ivfflat (embedding_sparse vector_cosine_ops) WITH (lists = 100);

-- 6. GIN индекс для полнотекстового поиска
CREATE INDEX idx_notes_search_vector ON notes USING GIN (search_vector);

-- 7. Функция для обновления search_vector при изменении данных
CREATE OR REPLACE FUNCTION update_notes_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('russian', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('russian', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('russian', COALESCE(NEW.url, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Триггер для автоматического обновления search_vector
CREATE TRIGGER trigger_update_notes_search_vector
    BEFORE INSERT OR UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_notes_search_vector();

-- 9. Функция RRF (Reciprocal Rank Fusion) для гибридного поиска
-- Объединяет результаты: Dense (семантический) + Sparse (лексический) + Text (BM25)
CREATE OR REPLACE FUNCTION find_notes_hybrid_rrf(
    p_user_id BIGINT,
    p_query TEXT,
    p_dense_embedding VECTOR(1024),
    p_sparse_embedding VECTOR(1024),
    p_limit INTEGER DEFAULT 20,
    p_dense_weight FLOAT DEFAULT 0.4,
    p_sparse_weight FLOAT DEFAULT 0.3,
    p_text_weight FLOAT DEFAULT 0.3,
    p_rrf_k INTEGER DEFAULT 60
)
RETURNS TABLE (
    note_id BIGINT,
    dense_rank INTEGER,
    sparse_rank INTEGER,
    text_rank INTEGER,
    rrf_score FLOAT,
    title VARCHAR(255),
    description TEXT,
    url VARCHAR(1000),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    WITH 
    -- Dense vector search (косинусное сходство)
    dense_results AS (
        SELECT 
            n.id as id,
            ROW_NUMBER() OVER (ORDER BY n.embedding_dense <=> p_dense_embedding) as rank
        FROM notes n
        WHERE n.user_id = p_user_id 
            AND n.is_deleted = false
            AND n.embedding_dense IS NOT NULL
        ORDER BY n.embedding_dense <=> p_dense_embedding
        LIMIT p_limit
    ),
    -- Sparse vector search (косинусное сходство)
    sparse_results AS (
        SELECT 
            n.id as id,
            ROW_NUMBER() OVER (ORDER BY n.embedding_sparse <=> p_sparse_embedding) as rank
        FROM notes n
        WHERE n.user_id = p_user_id 
            AND n.is_deleted = false
            AND n.embedding_sparse IS NOT NULL
        ORDER BY n.embedding_sparse <=> p_sparse_embedding
        LIMIT p_limit
    ),
    -- Text search (BM25 через ts_rank)
    text_results AS (
        SELECT 
            n.id as id,
            ROW_NUMBER() OVER (ORDER BY ts_rank(n.search_vector, plainto_tsquery('russian', p_query)) DESC) as rank
        FROM notes n
        WHERE n.user_id = p_user_id 
            AND n.is_deleted = false
            AND n.search_vector @@ plainto_tsquery('russian', p_query)
        ORDER BY ts_rank(n.search_vector, plainto_tsquery('russian', p_query)) DESC
        LIMIT p_limit
    ),
    -- RRF Fusion: объединяем все результаты с весами
    all_results AS (
        SELECT 
            n.id as note_id,
            COALESCE(d.rank, 0) as dr,
            COALESCE(s.rank, 0) as sr,
            COALESCE(t.rank, 0) as tr,
            (
                CASE WHEN d.rank > 0 THEN p_dense_weight / (p_rrf_k + d.rank) ELSE 0 END +
                CASE WHEN s.rank > 0 THEN p_sparse_weight / (p_rrf_k + s.rank) ELSE 0 END +
                CASE WHEN t.rank > 0 THEN p_text_weight / (p_rrf_k + t.rank) ELSE 0 END
            ) as score
        FROM notes n
        LEFT JOIN dense_results d ON n.id = d.id
        LEFT JOIN sparse_results s ON n.id = s.id
        LEFT JOIN text_results t ON n.id = t.id
        WHERE n.user_id = p_user_id 
            AND n.is_deleted = false
            AND (d.id IS NOT NULL OR s.id IS NOT NULL OR t.id IS NOT NULL)
    )
    SELECT 
        ar.note_id,
        ar.dr::INTEGER as dense_rank,
        ar.sr::INTEGER as sparse_rank,
        ar.tr::INTEGER as text_rank,
        ar.score::FLOAT as rrf_score,
        n.title,
        n.description,
        n.url,
        n.created_at,
        n.updated_at
    FROM all_results ar
    JOIN notes n ON ar.note_id = n.id
    ORDER BY ar.score DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- 10. Функция для текстового поиска (LIKE + tsvector fallback)
CREATE OR REPLACE FUNCTION find_notes_text_search(
    p_user_id BIGINT,
    p_query TEXT,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    note_id BIGINT,
    text_rank FLOAT,
    title VARCHAR(255),
    description TEXT,
    url VARCHAR(1000),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id as note_id,
        COALESCE(ts_rank(n.search_vector, plainto_tsquery('russian', p_query)), 0)::FLOAT as text_rank,
        n.title,
        n.description,
        n.url,
        n.created_at,
        n.updated_at
    FROM notes n
    WHERE n.user_id = p_user_id 
        AND n.is_deleted = false
        AND (
            n.search_vector @@ plainto_tsquery('russian', p_query)
            OR LOWER(n.title) LIKE LOWER(CONCAT('%', p_query, '%'))
            OR LOWER(n.description) LIKE LOWER(CONCAT('%', p_query, '%'))
            OR LOWER(n.url) LIKE LOWER(CONCAT('%', p_query, '%'))
        )
    ORDER BY text_rank DESC, n.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- 11. Выдача прав пользователю приложения (если пользователь существует)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = '${db.app.user}') THEN
        GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${db.app.user};
        GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${db.app.user};
        GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO ${db.app.user};
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${db.app.user};
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${db.app.user};
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO ${db.app.user};
    END IF;
END $$;
