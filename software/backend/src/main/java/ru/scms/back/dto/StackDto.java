package ru.scms.back.dto;

import ru.scms.back.enums.StackStatus;

import java.time.LocalDateTime;

public record StackDto(
        Long id,
        String code,
        Long ownerUserId,
        String ownerName,
        StackStatus status,
        String location,
        LocalDateTime lastExtractedAt
) {
}
