package ru.scms.back.dto;

import ru.scms.back.enums.CaseStatus;
import ru.scms.back.enums.IncidentType;
import ru.scms.back.enums.SleeveGender;

import java.time.LocalDateTime;

public record CaseDto(
        Long id,
        String code,
        Long orderId,
        Long methUserId,
        String methUserName,
        Long sleeveId,
        String sleeveCode,
        SleeveGender sleeveGender,
        Integer sleeveHeight,
        Long stackId,
        String stackCode,
        CaseStatus status,
        String needlecasterName,
        LocalDateTime startTime,
        LocalDateTime endTime,
        String result,
        IncidentType incidentType,
        String incidentNote,
        LocalDateTime createdAt
) {
}
