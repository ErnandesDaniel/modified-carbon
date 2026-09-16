package ru.main.back.dto.embeddingDto;

/**
 * DTO для результата генерации эмбеддингов BGE-M3.
 * BGE-M3 поддерживает два типа векторов:
 * - dense: плотный вектор размерностью 1024 для семантического поиска
 * - sparse: разреженный вектор размерностью 1024 для лексического поиска
 */
public record EmbeddingResultDto(
    float[] denseVector,
    float[] sparseVector
) {
    public EmbeddingResultDto {
        if (denseVector == null) {
            throw new IllegalArgumentException("Dense vector cannot be null");
        }
        if (sparseVector == null) {
            throw new IllegalArgumentException("Sparse vector cannot be null");
        }
    }
}
