package ru.scms.back.dto;

import java.time.LocalDateTime;
import ru.scms.back.enums.AuditAction;

public record AuditLogDto(
        Long id,
        Long userId,
        String userName,
        AuditAction action,
        String entityType,
        Long entityId,
        String details,
        LocalDateTime createdAt) {}
