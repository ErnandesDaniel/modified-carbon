package ru.scms.back.dto;

import ru.scms.back.enums.SleeveGender;
import ru.scms.back.enums.SleeveStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record SleeveDto(
        Long id,
        String code,
        SleeveGender gender,
        Integer height,
        Integer weight,
        Integer age,
        Long geneticArchiveId,
        String geneticArchiveName,
        SleeveStatus status,
        String dnaDonor,
        String notes,
        LocalDateTime cultivationStartedAt,
        LocalDate plannedReadyAt,
        Integer cultivationStagePercent,
        Long reservedForUserId,
        String reservedForUserName,
        LocalDateTime createdAt
) {
}
