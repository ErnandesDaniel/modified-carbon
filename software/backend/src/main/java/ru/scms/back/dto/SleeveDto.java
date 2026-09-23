package ru.scms.back.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import ru.scms.back.enums.SleeveGender;
import ru.scms.back.enums.SleeveStatus;

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
        LocalDateTime createdAt) {}
