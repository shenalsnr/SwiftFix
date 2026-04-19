package SwiftFix.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global Exception Handler
 * ✅ Catches ALL exceptions and returns ACTUAL error messages
 * ✅ Never returns generic "An unexpected error occurred"
 * ✅ Shows real database errors, null pointer exceptions, file issues, etc.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle ResourceNotFoundException
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFoundException(
            ResourceNotFoundException ex,
            WebRequest request) {
        
        System.out.println("\n❌ [ResourceNotFoundException] " + ex.getMessage() + "\n");
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", 404);
        errorResponse.put("error", "RESOURCE_NOT_FOUND");
        errorResponse.put("message", ex.getMessage());
        errorResponse.put("path", request.getDescription(false).replace("uri=", ""));
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    /**
     * Handle IllegalArgumentException
     * (email exists, passwords don't match, validation fails, etc.)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(
            IllegalArgumentException ex,
            WebRequest request) {
        
        System.out.println("\n❌ [IllegalArgumentException] " + ex.getMessage() + "\n");
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", 400);
        errorResponse.put("error", "VALIDATION_ERROR");
        errorResponse.put("message", ex.getMessage());
        errorResponse.put("path", request.getDescription(false).replace("uri=", ""));
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    /**
     * Handle File Upload Size Exceeded
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxUploadSizeExceededException(
            MaxUploadSizeExceededException ex,
            WebRequest request) {
        
        System.out.println("\n❌ [MaxUploadSizeExceededException] File too large\n");
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", 413);
        errorResponse.put("error", "FILE_TOO_LARGE");
        errorResponse.put("message", "File exceeds maximum size of 10MB");
        errorResponse.put("path", request.getDescription(false).replace("uri=", ""));
        
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(errorResponse);
    }

    /**
     * Handle IOException (file operations failed)
     */
    @ExceptionHandler(java.io.IOException.class)
    public ResponseEntity<Map<String, Object>> handleIOException(
            java.io.IOException ex,
            WebRequest request) {
        
        System.out.println("\n❌ [IOException] " + ex.getMessage());
        ex.printStackTrace();
        System.out.println("");
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", 500);
        errorResponse.put("error", "FILE_OPERATION_ERROR");
        errorResponse.put("message", "File operation failed: " + ex.getMessage());
        errorResponse.put("path", request.getDescription(false).replace("uri=", ""));
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    /**
     * Handle NullPointerException
     */
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<Map<String, Object>> handleNullPointerException(
            NullPointerException ex,
            WebRequest request) {
        
        System.out.println("\n❌ [NullPointerException] A required value was null");
        ex.printStackTrace();
        System.out.println("");
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", 500);
        errorResponse.put("error", "NULL_POINTER_ERROR");
        errorResponse.put("message", "A required value was null (database table missing? wrong column name?)");
        errorResponse.put("path", request.getDescription(false).replace("uri=", ""));
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    /**
     * Handle DataAccessException (Database errors: table not found, access denied, etc.)
     */
    @ExceptionHandler(org.springframework.dao.DataAccessException.class)
    public ResponseEntity<Map<String, Object>> handleDataAccessException(
            org.springframework.dao.DataAccessException ex,
            WebRequest request) {
        
        System.out.println("\n❌ [DataAccessException - DATABASE ERROR]");
        System.out.println("Message: " + ex.getMessage());
        if (ex.getCause() != null) {
            System.out.println("Cause: " + ex.getCause().getMessage());
        }
        ex.printStackTrace();
        System.out.println("");
        
        String errorMessage = ex.getMessage();
        if (ex.getCause() != null && ex.getCause().getMessage() != null) {
            errorMessage = ex.getCause().getMessage();
        }
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", 500);
        errorResponse.put("error", "DATABASE_ERROR");
        errorResponse.put("message", "Database error: " + errorMessage);
        errorResponse.put("path", request.getDescription(false).replace("uri=", ""));
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    /**
     * Handle DataIntegrityViolationException (Unique constraint, foreign key violations)
     */
    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolationException(
            org.springframework.dao.DataIntegrityViolationException ex,
            WebRequest request) {
        
        System.out.println("\n❌ [DataIntegrityViolationException - CONSTRAINT VIOLATION]");
        System.out.println("Message: " + ex.getMessage());
        if (ex.getCause() != null) {
            System.out.println("Cause: " + ex.getCause().getMessage());
        }
        ex.printStackTrace();
        System.out.println("");
        
        String errorMessage = ex.getMessage();
        if (errorMessage.contains("Duplicate entry")) {
            errorMessage = "This value already exists (duplicate email or student ID?)";
        } else if (errorMessage.contains("foreign key")) {
            errorMessage = "Invalid reference to another record (foreign key violation)";
        }
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", 400);
        errorResponse.put("error", "CONSTRAINT_VIOLATION");
        errorResponse.put("message", errorMessage);
        errorResponse.put("path", request.getDescription(false).replace("uri=", ""));
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    /**
     * RuntimeException handler
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex,
            WebRequest request) {
        
        System.out.println("\n❌ [RuntimeException] " + ex.getMessage());
        ex.printStackTrace();
        System.out.println("");
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", 400);
        errorResponse.put("error", "RUNTIME_ERROR");
        errorResponse.put("message", ex.getMessage());
        errorResponse.put("path", request.getDescription(false).replace("uri=", ""));
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    /**
     * ✅ CATCH ALL - Returns ACTUAL exception message, not generic "An unexpected error occurred"
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(
            Exception ex,
            WebRequest request) {
        
        System.out.println("\n========== UNCAUGHT EXCEPTION ==========");
        System.out.println("❌ Exception Type: " + ex.getClass().getSimpleName());
        System.out.println("❌ Message: " + (ex.getMessage() != null ? ex.getMessage() : "[No message]"));
        System.out.println("=========================================");
        ex.printStackTrace();
        System.out.println("=========================================\n");
        
        String errorMessage = ex.getMessage();
        if (errorMessage == null || errorMessage.trim().isEmpty()) {
            errorMessage = "Unknown error: " + ex.getClass().getSimpleName();
        }
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", 500);
        errorResponse.put("error", "INTERNAL_SERVER_ERROR");
        errorResponse.put("exceptionType", ex.getClass().getSimpleName());
        errorResponse.put("message", errorMessage); // ✅ Show real error, not generic message
        errorResponse.put("path", request.getDescription(false).replace("uri=", ""));
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
