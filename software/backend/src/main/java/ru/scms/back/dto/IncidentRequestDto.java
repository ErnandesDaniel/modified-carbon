package ru.scms.back.dto;

import ru.scms.back.enums.IncidentType;

public record IncidentRequestDto(IncidentType type, String description) {}
