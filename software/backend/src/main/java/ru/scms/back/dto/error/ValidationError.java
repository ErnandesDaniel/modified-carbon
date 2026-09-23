package ru.scms.back.dto.error;

public record ValidationError(String field, String message) {}
