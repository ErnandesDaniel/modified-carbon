package ru.main.back.services;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import ru.main.back.BaseServiceTest;
import ru.main.back.dto.embeddingDto.EmbeddingResultDto;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Тесты для EmbeddingService с поддержкой BGE-M3 (Dense + Sparse векторы)
 */
class EmbeddingServiceTest extends BaseServiceTest {

    @Autowired
    private EmbeddingService embeddingService;

    @Test
    void generateEmbeddings_ShouldReturnDenseAndSparseVectors() {
        // Given
        String title = "Spring Boot Framework";
        String description = "Java web framework for building microservices";
        String url = "https://spring.io";

        // When
        EmbeddingResultDto result = embeddingService.generateEmbeddings(title, description, url);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.denseVector()).isNotNull();
        assertThat(result.denseVector()).hasSize(1024); // BGE-M3 dense dimension
        assertThat(result.sparseVector()).isNotNull();
        assertThat(result.sparseVector()).hasSize(1024); // Sparse dimension
    }

    @Test
    void generateEmbeddings_ShouldHandleNullDescription() {
        // Given
        String title = "Test Title";
        String description = null;
        String url = null;

        // When
        EmbeddingResultDto result = embeddingService.generateEmbeddings(title, description, url);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.denseVector()).hasSize(1024);
        assertThat(result.sparseVector()).hasSize(1024);
    }

    @Test
    void generateEmbeddings_ShouldHandleEmptyContent() {
        // Given
        String title = "";
        String description = "";
        String url = "";

        // When
        EmbeddingResultDto result = embeddingService.generateEmbeddings(title, description, url);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.denseVector()).hasSize(1024);
        assertThat(result.sparseVector()).hasSize(1024);
    }

    @Test
    void generateQueryEmbeddings_ShouldReturnDenseAndSparseVectors() {
        // Given
        String query = "machine learning";

        // When
        EmbeddingResultDto result = embeddingService.generateQueryEmbeddings(query);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.denseVector()).isNotNull();
        assertThat(result.denseVector()).hasSize(1024);
        assertThat(result.sparseVector()).isNotNull();
        assertThat(result.sparseVector()).hasSize(1024);
    }

    @Test
    void generateEmbeddings_ShouldReturnConsistentDimensions_ForDifferentInputs() {
        // Given
        String shortContent = "Short";
        String longContent = "This is a very long description about machine learning and artificial intelligence that contains many words and concepts";

        // When
        EmbeddingResultDto shortEmbedding = embeddingService.generateEmbeddings(shortContent, null, null);
        EmbeddingResultDto longEmbedding = embeddingService.generateEmbeddings(longContent, null, null);

        // Then
        assertThat(shortEmbedding.denseVector()).hasSize(1024);
        assertThat(shortEmbedding.sparseVector()).hasSize(1024);
        assertThat(longEmbedding.denseVector()).hasSize(1024);
        assertThat(longEmbedding.sparseVector()).hasSize(1024);
    }

    @Test
    void vectorToPgVectorString_ShouldConvertFloatArrayToString() {
        // Given
        float[] vector = {0.1f, 0.2f, 0.3f};

        // When
        String result = embeddingService.vectorToPgVectorString(vector);

        // Then
        assertThat(result).isEqualTo("[0.1,0.2,0.3]");
    }

    @Test
    void vectorToPgVectorString_ShouldReturnNullForEmptyArray() {
        // Given
        float[] vector = new float[0];

        // When
        String result = embeddingService.vectorToPgVectorString(vector);

        // Then
        assertThat(result).isNull();
    }

    @Test
    void vectorToPgVectorString_ShouldReturnNullForNullArray() {
        // When
        String result = embeddingService.vectorToPgVectorString(null);

        // Then
        assertThat(result).isNull();
    }
}
