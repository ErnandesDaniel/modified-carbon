package ru.scms.back.dto;

import ru.scms.back.enums.OrderStatus;
import ru.scms.back.enums.SleeveGender;

import java.time.LocalDateTime;

public record OrderDto(
        Long id,
        String code,
        Long methUserId,
        String methUserName,
        Long sleeveId,
        String sleeveCode,
        SleeveGender gender,
        Integer height,
        Integer weight,
        Integer age,
        Long geneticArchiveId,
        String geneticArchiveName,
        OrderStatus status,
        LocalDateTime createdAt
) {
}
