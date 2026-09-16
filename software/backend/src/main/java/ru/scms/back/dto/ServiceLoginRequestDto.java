package ru.scms.back.dto;

public record ServiceLoginRequestDto(
        String providerUserId,
        String userName,
        String provider
) {
}
