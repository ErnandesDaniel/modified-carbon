package ru.main.back.dto.noteDto;

import java.util.List;

public record NotesPageResponseDto(
        List<NoteResponseDto> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean isLast
) {}
