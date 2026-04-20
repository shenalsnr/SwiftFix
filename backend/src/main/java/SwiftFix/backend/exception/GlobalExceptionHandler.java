package SwiftFix.backend.exception;

import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFoundException(
            ResourceNotFoundException ex,
            WebRequest request
    ) {
        logException("ResourceNotFoundException", ex);

        return buildResponse(
                HttpStatus.NOT_FOUND,
                "RESOURCE_NOT_FOUND",
                ex.getMessage(),
                request,
                null,
                null
        );
    }

    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<Map<String, Object>> handleBusinessRuleException(
            BusinessRuleException ex,
            WebRequest request
    ) {
        logException("BusinessRuleException", ex);

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "BUSINESS_RULE_ERROR",
                ex.getMessage(),
                request,
                null,
                null
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(
            IllegalArgumentException ex,
            WebRequest request
    ) {
        logException("IllegalArgumentException", ex);

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "VALIDATION_ERROR",
                ex.getMessage(),
                request,
                null,
                null
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException ex,
            WebRequest request
    ) {
        logException("MethodArgumentNotValidException", ex);

        Map<String, String> validationErrors = new LinkedHashMap<>();

        for (FieldError err : ex.getBindingResult().getFieldErrors()) {
            String field = err.getField();
            String message = err.getDefaultMessage() != null
                    ? err.getDefaultMessage()
                    : "Invalid value";
            validationErrors.put(field, message);
        }

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "VALIDATION_ERROR",
                "Validation failed",
                request,
                validationErrors,
                null
        );
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxUploadSizeExceededException(
            MaxUploadSizeExceededException ex,
            WebRequest request
    ) {
        logException("MaxUploadSizeExceededException", ex);

        return buildResponse(
                HttpStatus.PAYLOAD_TOO_LARGE,
                "FILE_TOO_LARGE",
                "File exceeds maximum size limit",
                request,
                null,
                null
        );
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<Map<String, Object>> handleIOException(
            IOException ex,
            WebRequest request
    ) {
        logException("IOException", ex);

        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "FILE_OPERATION_ERROR",
                "File operation failed: " + safeMessage(ex),
                request,
                null,
                "IOException"
        );
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<Map<String, Object>> handleNullPointerException(
            NullPointerException ex,
            WebRequest request
    ) {
        logException("NullPointerException", ex);

        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "NULL_POINTER_ERROR",
                "A required value was null",
                request,
                null,
                "NullPointerException"
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolationException(
            DataIntegrityViolationException ex,
            WebRequest request
    ) {
        logException("DataIntegrityViolationException", ex);

        String errorMessage = extractRootMessage(ex);

        if (errorMessage != null) {
            String lower = errorMessage.toLowerCase();

            if (lower.contains("duplicate entry")) {
                errorMessage = "Duplicate value found. This record already exists.";
            } else if (lower.contains("foreign key")) {
                errorMessage = "Invalid reference to another record.";
            } else if (lower.contains("cannot be null")) {
                errorMessage = "A required database field is missing.";
            }
        }

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "CONSTRAINT_VIOLATION",
                errorMessage,
                request,
                null,
                "DataIntegrityViolationException"
        );
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Map<String, Object>> handleDataAccessException(
            DataAccessException ex,
            WebRequest request
    ) {
        logException("DataAccessException", ex);

        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "DATABASE_ERROR",
                "Database error: " + extractRootMessage(ex),
                request,
                null,
                "DataAccessException"
        );
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex,
            WebRequest request
    ) {
        logException("RuntimeException", ex);

        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "RUNTIME_ERROR",
                safeMessage(ex),
                request,
                null,
                ex.getClass().getSimpleName()
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(
            Exception ex,
            WebRequest request
    ) {
        logException("Exception", ex);

        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "INTERNAL_SERVER_ERROR",
                safeMessage(ex),
                request,
                null,
                ex.getClass().getSimpleName()
        );
    }

    private ResponseEntity<Map<String, Object>> buildResponse(
            HttpStatus status,
            String error,
            String message,
            WebRequest request,
            Map<String, ?> errors,
            String exceptionType
    ) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", error);
        body.put("message", message);
        body.put("path", request.getDescription(false).replace("uri=", ""));

        if (exceptionType != null && !exceptionType.isBlank()) {
            body.put("exceptionType", exceptionType);
        }

        if (errors != null && !errors.isEmpty()) {
            body.put("errors", errors);
        }

        return new ResponseEntity<>(body, status);
    }

    private String extractRootMessage(Exception ex) {
        Throwable root = ex;
        while (root.getCause() != null) {
            root = root.getCause();
        }

        if (root.getMessage() != null && !root.getMessage().trim().isEmpty()) {
            return root.getMessage();
        }

        return safeMessage(ex);
    }

    private String safeMessage(Exception ex) {
        if (ex.getMessage() == null || ex.getMessage().trim().isEmpty()) {
            return "Unknown error: " + ex.getClass().getSimpleName();
        }
        return ex.getMessage();
    }

    private void logException(String label, Exception ex) {
        System.out.println("\n========== " + label + " ==========");
        System.out.println("Message: " + safeMessage(ex));
        ex.printStackTrace();
        System.out.println("====================================\n");
    }
}