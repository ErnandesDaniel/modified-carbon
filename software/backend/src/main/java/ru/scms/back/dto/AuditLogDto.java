package ru.scms.back.dto;

import ru.scms.back.enums.AuditAction;

import java.time.LocalDateTime;

public record AuditLogDto(
        Long id,
        Long userId,
        String userName,
        AuditAction action,
        String entityType,
        Long entityId,
        String details,
        LocalDateTime createdAt
) {
}
