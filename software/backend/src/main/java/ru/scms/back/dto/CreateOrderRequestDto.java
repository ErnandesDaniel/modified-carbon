package ru.scms.back.dto;

import ru.scms.back.enums.SleeveGender;

public record CreateOrderRequestDto(
        Long sleeveId, SleeveGender gender, Integer height, Integer weight, Integer age, Long geneticArchiveId) {}
