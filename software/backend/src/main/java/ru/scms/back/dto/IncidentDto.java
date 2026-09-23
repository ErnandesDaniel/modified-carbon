package ru.scms.back.dto;

import java.time.LocalDateTime;
import ru.scms.back.enums.IncidentType;

public record IncidentDto(
        Long id, Long caseId, IncidentType type, String description, Boolean resolved, LocalDateTime createdAt) {}
