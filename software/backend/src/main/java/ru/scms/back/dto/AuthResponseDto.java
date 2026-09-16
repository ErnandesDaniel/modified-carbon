package ru.scms.back.dto;

import ru.scms.back.enums.AppRole;

public record AuthResponseDto(
        String token,
        Long userId,
        String displayName,
        String email,
        AppRole role
) {
}
