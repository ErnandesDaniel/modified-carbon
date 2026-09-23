package ru.scms.back.dto;

import java.time.LocalDateTime;
import ru.scms.back.enums.StackStatus;

public record StackDto(
        Long id,
        String code,
        Long ownerUserId,
        String ownerName,
        StackStatus status,
        String location,
        LocalDateTime lastExtractedAt) {}
