package ru.scms.back.dto;

import ru.scms.back.enums.CheckpointCategory;
import ru.scms.back.enums.CheckpointStatus;

public record CheckpointDto(
        Long id,
        Long caseId,
        String label,
        String description,
        CheckpointCategory category,
        CheckpointStatus status,
        Boolean required
) {
}
