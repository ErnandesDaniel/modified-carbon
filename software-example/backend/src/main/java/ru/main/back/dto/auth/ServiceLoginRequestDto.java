package ru.main.back.dto.auth;

import ru.main.back.enums.UserAuthProvider;

public record ServiceLoginRequestDto(
        String providerUserId,
        String userName,
        String provider
) {}