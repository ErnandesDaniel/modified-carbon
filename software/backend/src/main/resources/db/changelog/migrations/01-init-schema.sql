-- liquibase formatted sql
-- changeset scms:1 splitStatements:false

-- 1. Пользователи системы (Meth и персонал)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    display_name VARCHAR(255),
    email VARCHAR(255),
    role VARCHAR(32) NOT NULL DEFAULT 'METH',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Идентификации (OAuth2 / Local)
CREATE TABLE user_identities (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    user_name VARCHAR(255),
    provider_name VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    CONSTRAINT fk_identity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_identity_provider UNIQUE (provider_name, provider_user_id)
);
CREATE INDEX idx_user_identities_provider_id ON user_identities(provider_user_id);
CREATE INDEX idx_user_identities_user_id ON user_identities(user_id);

-- 3. Генетические архивы (внешние системы)
CREATE TABLE genetic_archives (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL
);

-- 4. Каталог тел (sleeves)
CREATE TABLE sleeves (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    gender VARCHAR(16) NOT NULL,
    height INT NOT NULL,
    weight INT NOT NULL,
    age INT NOT NULL,
    genetic_archive_id BIGINT,
    status VARCHAR(32) NOT NULL DEFAULT 'AVAILABLE',
    dna_donor VARCHAR(255),
    notes TEXT,
    cultivation_started_at TIMESTAMP,
    planned_ready_at DATE,
    cultivation_stage_percent INT NOT NULL DEFAULT 0,
    reserved_for_user_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_sleeve_archive FOREIGN KEY (genetic_archive_id) REFERENCES genetic_archives(id),
    CONSTRAINT fk_sleeve_reserved_user FOREIGN KEY (reserved_for_user_id) REFERENCES users(id)
);
CREATE INDEX idx_sleeves_status ON sleeves(status);
CREATE INDEX idx_sleeves_gender ON sleeves(gender);
CREATE INDEX idx_sleeves_reserved ON sleeves(reserved_for_user_id);

-- 5. Кортикальные стеки
CREATE TABLE stacks (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    owner_user_id BIGINT,
    status VARCHAR(32) NOT NULL DEFAULT 'STORED',
    location VARCHAR(255),
    last_extracted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_stack_owner FOREIGN KEY (owner_user_id) REFERENCES users(id)
);
CREATE INDEX idx_stacks_owner ON stacks(owner_user_id);

-- 6. Заказы клиентов на тело
CREATE TABLE sleeve_orders (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    meth_user_id BIGINT NOT NULL,
    sleeve_id BIGINT,
    gender VARCHAR(16),
    height INT,
    weight INT,
    age INT,
    genetic_archive_id BIGINT,
    status VARCHAR(32) NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_order_meth FOREIGN KEY (meth_user_id) REFERENCES users(id),
    CONSTRAINT fk_order_sleeve FOREIGN KEY (sleeve_id) REFERENCES sleeves(id),
    CONSTRAINT fk_order_archive FOREIGN KEY (genetic_archive_id) REFERENCES genetic_archives(id)
);
CREATE INDEX idx_orders_meth ON sleeve_orders(meth_user_id);
CREATE INDEX idx_orders_status ON sleeve_orders(status);

-- 7. Кейсы needlecast
CREATE TABLE needlecast_cases (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    order_id BIGINT,
    meth_user_id BIGINT NOT NULL,
    sleeve_id BIGINT NOT NULL,
    stack_id BIGINT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    needlecaster_name VARCHAR(255),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    result VARCHAR(32),
    incident_type VARCHAR(32),
    incident_note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_case_order FOREIGN KEY (order_id) REFERENCES sleeve_orders(id),
    CONSTRAINT fk_case_meth FOREIGN KEY (meth_user_id) REFERENCES users(id),
    CONSTRAINT fk_case_sleeve FOREIGN KEY (sleeve_id) REFERENCES sleeves(id),
    CONSTRAINT fk_case_stack FOREIGN KEY (stack_id) REFERENCES stacks(id)
);
CREATE INDEX idx_cases_meth ON needlecast_cases(meth_user_id);
CREATE INDEX idx_cases_status ON needlecast_cases(status);

-- 8. Контрольные точки валидации
CREATE TABLE checkpoints (
    id BIGSERIAL PRIMARY KEY,
    case_id BIGINT NOT NULL,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    required BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_checkpoint_case FOREIGN KEY (case_id) REFERENCES needlecast_cases(id) ON DELETE CASCADE
);
CREATE INDEX idx_checkpoints_case ON checkpoints(case_id);

-- 9. Инциденты
CREATE TABLE incidents (
    id BIGSERIAL PRIMARY KEY,
    case_id BIGINT NOT NULL,
    type VARCHAR(32) NOT NULL,
    description TEXT,
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_incident_case FOREIGN KEY (case_id) REFERENCES needlecast_cases(id) ON DELETE CASCADE
);
CREATE INDEX idx_incidents_case ON incidents(case_id);

-- 10. Сертификаты совместимости
CREATE TABLE certificates (
    id BIGSERIAL PRIMARY KEY,
    case_id BIGINT NOT NULL,
    meth_user_id BIGINT NOT NULL,
    code VARCHAR(64) NOT NULL UNIQUE,
    status VARCHAR(32) NOT NULL DEFAULT 'READY',
    verification_code VARCHAR(64) NOT NULL,
    issued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_certificate_case FOREIGN KEY (case_id) REFERENCES needlecast_cases(id) ON DELETE CASCADE,
    CONSTRAINT fk_certificate_meth FOREIGN KEY (meth_user_id) REFERENCES users(id)
);
CREATE INDEX idx_certificates_meth ON certificates(meth_user_id);

-- 11. Неизменяемый аудит-журнал
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(48) NOT NULL,
    entity_type VARCHAR(64),
    entity_id BIGINT,
    details TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- 12. Выдача прав пользователю приложения
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = '${db.app.user}') THEN
        GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${db.app.user};
        GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${db.app.user};
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${db.app.user};
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${db.app.user};
    END IF;
END $$;
