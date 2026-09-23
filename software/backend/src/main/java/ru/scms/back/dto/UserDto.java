package ru.scms.back.dto;

import ru.scms.back.enums.AppRole;

public record UserDto(Long id, String displayName, String email, AppRole role) {}
