package ru.main.back.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.stereotype.Service;
import ru.main.back.dto.embeddingDto.EmbeddingResultDto;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * Сервис для генерации эмбеддингов с использованием BGE-M3.
 * BGE-M3 поддерживает:
 * - Dense векторы (1024 размерность) - из Ollama
 * - Sparse векторы (1024 размерность) - генерируем локально на основе лексического анализа
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmbeddingService {

    private static final int SPARSE_VECTOR_SIZE = 1024;
    private static final float SPARSE_THRESHOLD = 0.1f;

    private final EmbeddingModel embeddingModel;

    /**
     * Генерирует эмбеддинги для текста заметки (dense + sparse)
     */
    public EmbeddingResultDto generateEmbeddings(String title, String description, String url) {
        String content = buildContentForEmbedding(title, description, url);

        try {
            float[] denseVector = generateDenseEmbedding(content);
            float[] sparseVector = generateSparseEmbedding(content);
            return new EmbeddingResultDto(denseVector, sparseVector);
        } catch (Exception e) {
            log.error("Failed to generate embeddings for content: {}", content, e);
            return null;
        }
    }

    /**
     * Генерирует эмбеддинги для поискового запроса (dense + sparse)
     */
    public EmbeddingResultDto generateQueryEmbeddings(String query) {
        try {
            float[] denseVector = generateDenseEmbedding(query);
            float[] sparseVector = generateSparseEmbedding(query);
            return new EmbeddingResultDto(denseVector, sparseVector);
        } catch (Exception e) {
            log.error("Failed to generate embeddings for query: {}", query, e);
            return null;
        }
    }

    /**
     * Генерирует dense вектор через Ollama (BGE-M3)
     */
    private float[] generateDenseEmbedding(String content) {
        return embeddingModel.embed(content);
    }

    /**
     * Генерирует sparse вектор на основе лексического анализа.
     * Использует хеширование слов для создания разреженного вектора.
     * Это упрощенная реализация для поддержки лексического поиска.
     */
    private float[] generateSparseEmbedding(String content) {
        float[] sparseVector = new float[SPARSE_VECTOR_SIZE];
        Arrays.fill(sparseVector, 0.0f);

        if (content == null || content.isEmpty()) {
            return sparseVector;
        }

        // Нормализуем и токенизируем текст
        String[] tokens = content.toLowerCase()
                .replaceAll("[^\\p{L}\\p{N}\\s]", " ")
                .split("\\s+");

        // Считаем частоту слов
        Map<String, Integer> wordFreq = new HashMap<>();
        for (String token : tokens) {
            if (token.length() > 2) { // Игнорируем короткие токены
                wordFreq.merge(token, 1, Integer::sum);
            }
        }

        // Преобразуем частоты в sparse вектор через хеширование
        float maxFreq = wordFreq.values().stream()
                .max(Integer::compare)
                .orElse(1)
                .floatValue();

        for (Map.Entry<String, Integer> entry : wordFreq.entrySet()) {
            int index = Math.floorMod(entry.getKey().hashCode(), SPARSE_VECTOR_SIZE);
            float normalizedFreq = entry.getValue() / maxFreq;
            // Используем максимум если слово хешируется в один индекс несколько раз
            sparseVector[index] = Math.max(sparseVector[index], normalizedFreq);
        }

        return sparseVector;
    }

    private String buildContentForEmbedding(String title, String description, String url) {
        StringBuilder content = new StringBuilder();

        if (title != null && !title.isEmpty()) {
            content.append("Title: ").append(title).append("\n");
        }

        if (description != null && !description.isEmpty()) {
            content.append("Description: ").append(description).append("\n");
        }

        if (url != null && !url.isEmpty()) {
            content.append("URL: ").append(url).append("\n");
        }

        return content.toString().trim();
    }

    /**
     * Конвертирует float[] в строку формата pgvector
     */
    public String vectorToPgVectorString(float[] vector) {
        if (vector == null || vector.length == 0) {
            return null;
        }

        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < vector.length; i++) {
            sb.append(vector[i]);
            if (i < vector.length - 1) {
                sb.append(",");
            }
        }
        sb.append("]");
        return sb.toString();
    }
}
