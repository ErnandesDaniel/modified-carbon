package ru.main.back;

import org.mockito.Mockito;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

/**
 * Тестовая конфигурация для мокирования Spring AI сервисов.
 * Мокирует только EmbeddingModel, возвращая фиксированные векторы для BGE-M3.
 */
@TestConfiguration
public class TestAiConfig {

    private static final float[] MOCK_DENSE_EMBEDDING;

    static {
        // Dense vector - 1024 dimensions (BGE-M3)
        MOCK_DENSE_EMBEDDING = new float[1024];
        for (int i = 0; i < 1024; i++) {
            MOCK_DENSE_EMBEDDING[i] = (float) (Math.random() * 2 - 1);
        }
    }

    @Bean
    @Primary
    public EmbeddingModel embeddingModel() {
        EmbeddingModel mock = Mockito.mock(EmbeddingModel.class);
        when(mock.embed(anyString())).thenReturn(MOCK_DENSE_EMBEDDING);
        return mock;
    }
}
