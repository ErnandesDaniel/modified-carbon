package ru.main.back.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.main.back.dto.embeddingDto.EmbeddingResultDto;
import ru.main.back.dto.noteDto.NoteCreateRequestDto;
import ru.main.back.dto.noteDto.NoteResponseDto;
import ru.main.back.dto.noteDto.NoteUpdateRequestDto;
import ru.main.back.dto.noteDto.NotesPageResponseDto;
import ru.main.back.entities.Note;
import ru.main.back.entities.User;
import ru.main.back.mappers.NoteMapper;
import ru.main.back.repositories.NoteRepository;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final NoteMapper noteMapper;
    private final EmbeddingService embeddingService;

    @Transactional
    public NoteResponseDto create(NoteCreateRequestDto request, Long userId) {
        EmbeddingResultDto embeddings = embeddingService.generateEmbeddings(
                request.title(), request.description(), request.url()
        );

        Note note = Note.builder()
                .title(request.title())
                .description(request.description())
                .url(request.url())
                .embeddingDense(embeddings != null ? embeddings.denseVector() : null)
                .embeddingSparse(embeddings != null ? embeddings.sparseVector() : null)
                .user(User.builder().id(userId).build())
                .isDeleted(false)
                .build();

        Note savedNote = noteRepository.save(note);
        return noteMapper.toResponseDto(savedNote);
    }

    @Transactional(readOnly = true)
    public NotesPageResponseDto findAllWithFilters(
            Long userId,
            String searchQuery,
            boolean useSemanticSearch,
            int page,
            int size,
            Integer semanticLimit
    ) {
        return findAllWithFilters(userId, searchQuery, useSemanticSearch, page, size, semanticLimit, 0.4f, 0.3f, 0.3f);
    }

    @Transactional(readOnly = true)
    public NotesPageResponseDto findAllWithFilters(
            Long userId,
            String searchQuery,
            boolean useSemanticSearch,
            int page,
            int size,
            Integer semanticLimit,
            float denseWeight,
            float sparseWeight,
            float textWeight
    ) {
        if (useSemanticSearch && searchQuery != null && !searchQuery.isEmpty()) {
            return findByHybridRrfSearch(userId, searchQuery, page, size, semanticLimit, denseWeight, sparseWeight, textWeight);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Note> notesPage = noteRepository.findAllWithFilters(
                userId, searchQuery, pageable
        );

        return new NotesPageResponseDto(
                notesPage.getContent().stream().map(noteMapper::toResponseDto).toList(),
                notesPage.getNumber(),
                notesPage.getSize(),
                notesPage.getTotalElements(),
                notesPage.getTotalPages(),
                notesPage.isLast()
        );
    }

    private NotesPageResponseDto findByHybridRrfSearch(
            Long userId,
            String searchQuery,
            int page,
            int size,
            Integer semanticLimit,
            float denseWeight,
            float sparseWeight,
            float textWeight
    ) {
        EmbeddingResultDto queryEmbeddings = embeddingService.generateQueryEmbeddings(searchQuery);

        if (queryEmbeddings == null) {
            log.warn("Failed to generate embeddings for query: {}. Falling back to LIKE search", searchQuery);
            return findAllWithFilters(userId, searchQuery, false, page, size, null);
        }

        // Конвертируем векторы в строки формата pgvector
        String denseEmbeddingStr = embeddingService.vectorToPgVectorString(queryEmbeddings.denseVector());
        String sparseEmbeddingStr = embeddingService.vectorToPgVectorString(queryEmbeddings.sparseVector());

        // Определяем лимит для поиска
        int searchLimit = semanticLimit != null ? semanticLimit : (page + 1) * size;

        // Используем RRF гибридный поиск из PostgreSQL
        List<NoteRepository.RrfSearchResult> rrfResults = noteRepository.findByHybridRrfSearch(
                userId, searchQuery, denseEmbeddingStr, sparseEmbeddingStr, 
                searchLimit, denseWeight, sparseWeight, textWeight, 60
        );

        // Ручная пагинация
        int total = rrfResults.size();
        int start = page * size;
        int end = Math.min(start + size, total);

        List<NoteRepository.RrfSearchResult> pageContent = start < total
                ? rrfResults.subList(start, end)
                : List.of();

        int totalPages = (int) Math.ceil((double) total / size);

        // Конвертируем результаты в DTO
        List<NoteResponseDto> content = pageContent.stream()
                .map(this::mapRrfResultToDto)
                .toList();

        return new NotesPageResponseDto(
                content,
                page,
                size,
                total,
                totalPages,
                page >= totalPages - 1
        );
    }

    private NoteResponseDto mapRrfResultToDto(NoteRepository.RrfSearchResult result) {
        return new NoteResponseDto(
                result.getNoteId(),
                result.getTitle(),
                result.getDescription(),
                result.getUrl(),
                result.getCreatedAt(),
                result.getUpdatedAt()
        );
    }

    @Transactional
    public NoteResponseDto update(Long id, NoteUpdateRequestDto request, Long userId) {
        Note note = noteRepository.findByIdAndUserIdAndIsDeletedFalse(id, userId)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));

        if (request.title() != null) {
            note.setTitle(request.title());
        }
        if (request.description() != null) {
            note.setDescription(request.description());
        }
        if (request.url() != null) {
            note.setUrl(request.url());
        }

        // Перегенерируем эмбеддинги при изменении контента
        EmbeddingResultDto newEmbeddings = embeddingService.generateEmbeddings(
                note.getTitle(), note.getDescription(), note.getUrl()
        );
        if (newEmbeddings != null) {
            note.setEmbeddingDense(newEmbeddings.denseVector());
            note.setEmbeddingSparse(newEmbeddings.sparseVector());
        }

        Note updatedNote = noteRepository.save(note);
        return noteMapper.toResponseDto(updatedNote);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Note note = noteRepository.findByIdAndUserIdAndIsDeletedFalse(id, userId)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));
        note.setIsDeleted(true);
        noteRepository.save(note);
    }
}
