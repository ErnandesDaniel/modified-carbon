package ru.scms.back.dto;

import ru.scms.back.enums.SleeveGender;

public record CultivationRequestDto(
        SleeveGender gender,
        Integer height,
        Integer weight,
        Integer age,
        Long geneticArchiveId,
        String notes
) {
}
