package ru.scms.back.dto;

import ru.scms.back.enums.CheckpointStatus;

public record CheckpointUpdateRequestDto(
        CheckpointStatus status
) {
}
