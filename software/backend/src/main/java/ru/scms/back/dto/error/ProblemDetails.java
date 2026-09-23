package ru.scms.back.dto.error;

import java.util.List;

public record ProblemDetails(
        String type,
        String title,
        int status,
        String detail,
        String instance,
        ErrorType errorType,
        List<ValidationError> errors) {
    public ProblemDetails(String type, String title, int status, String detail, String instance, ErrorType errorType) {
        this(type, title, status, detail, instance, errorType, null);
    }

    public ProblemDetails(String type, String title, int status, ErrorType errorType, List<ValidationError> errors) {
        this(type, title, status, null, null, errorType, errors);
    }

    public ProblemDetails(String type, String title, int status, String detail, ErrorType errorType) {
        this(type, title, status, detail, null, errorType);
    }
}
