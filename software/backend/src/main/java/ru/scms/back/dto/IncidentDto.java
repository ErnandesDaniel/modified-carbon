package ru.scms.back.dto;

import ru.scms.back.enums.IncidentType;

import java.time.LocalDateTime;

public record IncidentDto(
        Long id,
        Long caseId,
        IncidentType type,
        String description,
        Boolean resolved,
        LocalDateTime createdAt
) {
}
