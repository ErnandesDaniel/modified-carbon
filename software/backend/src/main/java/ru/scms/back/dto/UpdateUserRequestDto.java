package ru.scms.back.dto;

import ru.scms.back.enums.AppRole;

public record UpdateUserRequestDto(
        String displayName,
        String email,
        AppRole role
) {
}
