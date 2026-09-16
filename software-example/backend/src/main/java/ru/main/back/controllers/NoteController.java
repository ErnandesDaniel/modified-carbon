package ru.main.back.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import ru.main.back.annotations.CurrentUserId;
import ru.main.back.dto.noteDto.NoteCreateRequestDto;
import ru.main.back.dto.noteDto.NoteResponseDto;
import ru.main.back.dto.noteDto.NoteUpdateRequestDto;
import ru.main.back.dto.noteDto.NotesPageResponseDto;
import ru.main.back.services.NoteService;

@RestController
@RequestMapping("/notes")
@RequiredArgsConstructor
@Tag(name = "Заметки", description = "Управление заметками пользователя")
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    @Operation(
            summary = "Создать новую заметку",
            description = "Создает новую заметку с обязательным заголовком",
            operationId = "createNote"
    )
    public NoteResponseDto create(
            @Valid @RequestBody NoteCreateRequestDto request,
            @CurrentUserId Long userId
    ) {
        return noteService.create(request, userId);
    }

    @GetMapping
    @Operation(
            summary = "Получить список заметок с пагинацией",
            description = "Возвращает список заметок с поддержкой текстового (BM25) или гибридного поиска (BM25 + семантический)",
            operationId = "getNotesList"
    )
    public NotesPageResponseDto getAll(
            @CurrentUserId Long userId,

            @Parameter(description = "Поисковый запрос (текстовый или семантический)")
            @RequestParam(required = false) String searchQuery,

            @Parameter(description = "Использовать гибридный поиск (BM25 + семантический). Если false - обычный текстовый LIKE поиск")
            @RequestParam(defaultValue = "false") boolean semantic,

            @Parameter(description = "Номер страницы (начиная с 0)")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Размер страницы")
            @RequestParam(defaultValue = "20") int size,

            @Parameter(description = "Количество результатов для внутреннего поиска (только для семантического/гибридного). По умолчанию: page * size + size")
            @RequestParam(required = false) Integer semanticLimit,

            @Parameter(description = "Вес Dense векторного поиска (0.0 - 1.0). Только для семантического/гибридного поиска. По умолчанию: 0.4")
            @RequestParam(required = false, defaultValue = "0.4") float denseWeight,

            @Parameter(description = "Вес Sparse векторного поиска (0.0 - 1.0). Только для семантического/гибридного поиска. По умолчанию: 0.3")
            @RequestParam(required = false, defaultValue = "0.3") float sparseWeight,

            @Parameter(description = "Вес текстового поиска (0.0 - 1.0). Только для семантического/гибридного поиска. По умолчанию: 0.3")
            @RequestParam(required = false, defaultValue = "0.3") float textWeight
    ) {
        return noteService.findAllWithFilters(userId, searchQuery, semantic, page, size, semanticLimit, denseWeight, sparseWeight, textWeight);
    }

    @PatchMapping("/{id}")
    @Operation(
            summary = "Обновить заметку",
            description = "Обновляет поля заметки (partial update)",
            operationId = "updateNote"
    )
    public NoteResponseDto update(
            @PathVariable Long id,
            @Valid @RequestBody NoteUpdateRequestDto request,
            @CurrentUserId Long userId
    ) {
        return noteService.update(id, request, userId);
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Удалить заметку (мягкое удаление)",
            description = "Помечает заметку как удаленную (isDeleted = true)",
            operationId = "deleteNote"
    )
    public void delete(
            @PathVariable Long id,
            @CurrentUserId Long userId
    ) {
        noteService.delete(id, userId);
    }
}
