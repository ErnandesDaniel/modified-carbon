package ru.scms.back.exceptionHandlers;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import ru.scms.back.dto.error.ErrorType;
import ru.scms.back.dto.error.ProblemDetails;
import ru.scms.back.dto.error.ValidationError;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ProblemDetails> handleResponseStatusException(
            ResponseStatusException ex, HttpServletRequest request) {

        HttpStatus status = HttpStatus.resolve(ex.getStatusCode().value());
        if (status == null) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        ProblemDetails body = new ProblemDetails(
                "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                status.getReasonPhrase(),
                status.value(),
                ex.getReason(),
                request.getRequestURI(),
                mapErrorType(status));

        return ResponseEntity.status(status).body(body);
    }

    private ErrorType mapErrorType(HttpStatus status) {
        return switch (status) {
            case UNAUTHORIZED -> ErrorType.UNAUTHORIZED;
            case FORBIDDEN -> ErrorType.FORBIDDEN;
            case NOT_FOUND -> ErrorType.NOT_FOUND;
            case CONFLICT -> ErrorType.CONFLICT;
            case BAD_REQUEST -> ErrorType.VALIDATION_ERROR;
            default -> ErrorType.INTERNAL_ERROR;
        };
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetails> handleValidationException(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        List<ValidationError> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> new ValidationError(error.getField(), error.getDefaultMessage()))
                .toList();

        ProblemDetails body = new ProblemDetails(
                "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                "Validation Failed",
                HttpStatus.BAD_REQUEST.value(),
                "One or more fields have validation errors.",
                request.getRequestURI(),
                ErrorType.VALIDATION_ERROR,
                errors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ProblemDetails> handleResourceNotFoundException(
            ResourceNotFoundException ex, HttpServletRequest request) {

        ProblemDetails body = new ProblemDetails(
                "https://tools.ietf.org/html/rfc7231#section-6.5.4",
                "Resource Not Found",
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                request.getRequestURI(),
                ErrorType.NOT_FOUND);

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ProblemDetails> handleAccessDeniedException(
            AccessDeniedException ex, HttpServletRequest request) {

        ProblemDetails body = new ProblemDetails(
                "https://tools.ietf.org/html/rfc7231#section-6.5.3",
                "Access Denied",
                HttpStatus.FORBIDDEN.value(),
                ex.getMessage(),
                request.getRequestURI(),
                ErrorType.FORBIDDEN);

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ProblemDetails> handleUnauthorizedException(
            UnauthorizedException ex, HttpServletRequest request) {

        ProblemDetails body = new ProblemDetails(
                "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                "Unauthorized",
                HttpStatus.UNAUTHORIZED.value(),
                ex.getMessage(),
                request.getRequestURI(),
                ErrorType.UNAUTHORIZED);

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ProblemDetails> handleConflictException(ConflictException ex, HttpServletRequest request) {

        ProblemDetails body = new ProblemDetails(
                "https://tools.ietf.org/html/rfc7231#section-6.5.8",
                "Conflict",
                HttpStatus.CONFLICT.value(),
                ex.getMessage(),
                request.getRequestURI(),
                ErrorType.CONFLICT);

        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetails> handleGenericException(Exception ex, HttpServletRequest request) {

        ProblemDetails body = new ProblemDetails(
                "https://tools.ietf.org/html/rfc7231#section-6.6.1",
                "Internal Server Error",
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "An unexpected error occurred.",
                request.getRequestURI(),
                ErrorType.INTERNAL_ERROR);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }

    public static class AccessDeniedException extends RuntimeException {
        public AccessDeniedException(String message) {
            super(message);
        }
    }

    public static class UnauthorizedException extends RuntimeException {
        public UnauthorizedException(String message) {
            super(message);
        }
    }

    public static class ConflictException extends RuntimeException {
        public ConflictException(String message) {
            super(message);
        }
    }
}
