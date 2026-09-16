package ru.main.back.dto.noteDto;

import jakarta.validation.constraints.Size;

public record NoteUpdateRequestDto(
        @Size(max = 255, message = "Title must be less than 255 characters")
        String title,

        String description,

        String url
) {}
