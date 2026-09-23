package ru.scms.back.dto.error;

public enum ErrorType {
    VALIDATION_ERROR("validation-error"),
    NOT_FOUND("not-found"),
    UNAUTHORIZED("unauthorized"),
    FORBIDDEN("forbidden"),
    CONFLICT("conflict"),
    INTERNAL_ERROR("internal-error");

    private final String value;

    ErrorType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
