package ru.main.back.dto.noteDto;

import java.time.LocalDateTime;

public record NoteResponseDto(
        Long id,
        String title,
        String description,
        String url,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
