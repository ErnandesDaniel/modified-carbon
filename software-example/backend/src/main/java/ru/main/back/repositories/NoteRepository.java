package ru.main.back.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.main.back.entities.Note;

import java.util.List;
import java.util.Optional;

/**
 * Репозиторий для работы с заметками.
 * Поддерживает:
 * - Традиционный LIKE поиск
 * - Семантический поиск (Dense + Sparse векторы)
 * - Полнотекстовый поиск (tsvector/BM25)
 * - Гибридный RRF поиск (Reciprocal Rank Fusion)
 */
@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    Optional<Note> findByIdAndUserIdAndIsDeletedFalse(Long id, Long userId);

    /**
     * Традиционный LIKE поиск по подстроке
     */
    @Query(value = """
        SELECT n FROM Note n 
        WHERE n.user.id = :userId 
        AND n.isDeleted = false
        AND (CAST(:searchQuery AS string) IS NULL OR CAST(:searchQuery AS string) = '' OR 
            LOWER(n.title) LIKE LOWER(CONCAT('%', CAST(:searchQuery AS string), '%'))
            OR LOWER(n.description) LIKE LOWER(CONCAT('%', CAST(:searchQuery AS string), '%'))
            OR LOWER(n.url) LIKE LOWER(CONCAT('%', CAST(:searchQuery AS string), '%')))
        ORDER BY n.createdAt DESC
    """)
    Page<Note> findAllWithFilters(
        @Param("userId") Long userId,
        @Param("searchQuery") String searchQuery,
        Pageable pageable
    );

    /**
     * Поиск по Dense векторам (косинусное сходство)
     * Используется для семантического поиска через BGE-M3
     */
    @Query(value = """
        SELECT * FROM notes n 
        WHERE n.user_id = :userId 
        AND n.is_deleted = false
        AND n.embedding_dense IS NOT NULL
        ORDER BY n.embedding_dense <=> CAST(:embedding AS vector) 
        LIMIT :limit
        """, nativeQuery = true)
    List<Note> findByDenseVectorSimilarity(
        @Param("userId") Long userId,
        @Param("embedding") String embedding,
        @Param("limit") int limit
    );

    /**
     * Поиск по Sparse векторам (косинусное сходство)
     * Используется для лексического поиска
     */
    @Query(value = """
        SELECT * FROM notes n 
        WHERE n.user_id = :userId 
        AND n.is_deleted = false
        AND n.embedding_sparse IS NOT NULL
        ORDER BY n.embedding_sparse <=> CAST(:embedding AS vector) 
        LIMIT :limit
        """, nativeQuery = true)
    List<Note> findBySparseVectorSimilarity(
        @Param("userId") Long userId,
        @Param("embedding") String embedding,
        @Param("limit") int limit
    );

    /**
     * Fallback LIKE поиск для заметок без embedding
     */
    @Query(value = """
        SELECT * FROM notes n
        WHERE n.user_id = :userId
        AND n.is_deleted = false
        AND (n.embedding_dense IS NULL)
        AND (
            LOWER(n.title) LIKE LOWER(CONCAT('%', :searchQuery, '%'))
            OR LOWER(n.description) LIKE LOWER(CONCAT('%', :searchQuery, '%'))
            OR LOWER(n.url) LIKE LOWER(CONCAT('%', :searchQuery, '%'))
        )
        ORDER BY n.created_at DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Note> findBySearchQueryWithoutEmbedding(
        @Param("userId") Long userId,
        @Param("searchQuery") String searchQuery,
        @Param("limit") int limit
    );

    /**
     * BM25 полнотекстовый поиск через tsvector
     */
    @Query(value = """
        SELECT *, ts_rank(search_vector, plainto_tsquery('russian', :query))::float as rank
        FROM notes
        WHERE user_id = :userId 
            AND is_deleted = false
            AND search_vector @@ plainto_tsquery('russian', :query)
        ORDER BY rank DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<NoteWithRank> findByFullTextSearch(
        @Param("userId") Long userId,
        @Param("query") String query,
        @Param("limit") int limit
    );

    /**
     * Гибридный RRF поиск: Dense + Sparse + Text
     * Использует SQL функцию find_notes_hybrid_rrf
     */
    @Query(value = """
        SELECT * FROM find_notes_hybrid_rrf(
            :userId,
            :query,
            CAST(:denseEmbedding AS vector),
            CAST(:sparseEmbedding AS vector),
            :limit,
            :denseWeight,
            :sparseWeight,
            :textWeight,
            :rrfK
        )
        """, nativeQuery = true)
    List<RrfSearchResult> findByHybridRrfSearch(
        @Param("userId") Long userId,
        @Param("query") String query,
        @Param("denseEmbedding") String denseEmbedding,
        @Param("sparseEmbedding") String sparseEmbedding,
        @Param("limit") int limit,
        @Param("denseWeight") float denseWeight,
        @Param("sparseWeight") float sparseWeight,
        @Param("textWeight") float textWeight,
        @Param("rrfK") int rrfK
    );

    /**
     * Комбинированный текстовый поиск: tsvector + LIKE fallback
     */
    @Query(value = """
        SELECT * FROM find_notes_text_search(
            :userId,
            :query,
            :limit
        )
        """, nativeQuery = true)
    List<TextSearchResult> findByTextSearch(
        @Param("userId") Long userId,
        @Param("query") String query,
        @Param("limit") int limit
    );

    /**
     * Интерфейс для результатов полнотекстового поиска с рангом
     */
    interface NoteWithRank {
        Long getId();
        String getTitle();
        String getDescription();
        String getUrl();
        Float getRank();
        java.time.LocalDateTime getCreatedAt();
        java.time.LocalDateTime getUpdatedAt();
    }

    /**
     * Интерфейс для результатов RRF гибридного поиска
     */
    interface RrfSearchResult {
        Long getNoteId();
        Integer getDenseRank();
        Integer getSparseRank();
        Integer getTextRank();
        Float getRrfScore();
        String getTitle();
        String getDescription();
        String getUrl();
        java.time.LocalDateTime getCreatedAt();
        java.time.LocalDateTime getUpdatedAt();
    }

    /**
     * Интерфейс для результатов текстового поиска
     */
    interface TextSearchResult {
        Long getNoteId();
        Float getTextRank();
        String getTitle();
        String getDescription();
        String getUrl();
        java.time.LocalDateTime getCreatedAt();
        java.time.LocalDateTime getUpdatedAt();
    }
}
