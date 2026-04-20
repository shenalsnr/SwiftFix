package SwiftFix.backend.controller;

import SwiftFix.backend.dto.AuthResponse;
import SwiftFix.backend.dto.LoginRequest;
import SwiftFix.backend.dto.RegisterRequest;
import SwiftFix.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class AuthController {
    private final AuthService authService;

    /**
     * Register endpoint - handles multipart/form-data with profile photo upload
     * Profile photo is OPTIONAL - registration succeeds even if photo upload fails
     */
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> register(
            @RequestParam("fullName") String fullName,
            @RequestParam("studentId") String studentId,
            @RequestParam("email") String email,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("address") String address,
            @RequestParam("faculty") String faculty,
            @RequestParam("password") String password,
            @RequestParam("confirmPassword") String confirmPassword,
            @RequestParam(value = "profilePhoto", required = false) MultipartFile profilePhoto) {
        
        System.out.println("\n========== REGISTRATION REQUEST ==========");
        System.out.println("Full Name: " + fullName);
        System.out.println("Student ID: " + studentId);
        System.out.println("Email: " + email);
        System.out.println("Phone: " + phoneNumber);
        System.out.println("Address: " + address);
        System.out.println("Faculty: " + faculty);
        System.out.println("Password: " + password.substring(0, Math.min(3, password.length())) + "***");
        System.out.println("Profile Photo: " + (profilePhoto != null ? profilePhoto.getOriginalFilename() + " (" + profilePhoto.getSize() + " bytes)" : "None"));
        System.out.println("==========================================\n");
        
        try {
            // Validate password confirmation
            if (!password.equals(confirmPassword)) {
                System.out.println("❌ Password validation failed: passwords do not match");
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Passwords do not match");
                errorResponse.put("error", "VALIDATION_ERROR");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            // Create RegisterRequest object
            RegisterRequest request = new RegisterRequest();
            request.setFullName(fullName);
            request.setStudentId(studentId);
            request.setEmail(email);
            request.setPhoneNumber(phoneNumber);
            request.setAddress(address);
            request.setFaculty(faculty);
            request.setPassword(password);
            request.setConfirmPassword(confirmPassword);
            
            // Call service - will handle photo gracefully (won't throw exception)
            AuthResponse response = authService.register(request, profilePhoto);
            System.out.println("✅ Registration successful for: " + email + " (ID: " + response.getUserId() + ")\n");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            System.out.println("❌ Validation error: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("error", "VALIDATION_ERROR");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            
        } catch (Exception e) {
            System.err.println("❌ Unexpected error during registration: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Registration failed: " + e.getMessage());
            errorResponse.put("error", "INTERNAL_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Login endpoint - handles JSON request body
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("=== LOGIN REQUEST ===");
        System.out.println("Email or ID: " + request.getEmailOrId());
        System.out.println("====================");
        
        try {
            AuthResponse response = authService.login(request);
            System.out.println("Login successful for: " + request.getEmailOrId());
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            System.err.println("Validation Error during login: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("error", "INVALID_CREDENTIALS");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            
        } catch (Exception e) {
            System.err.println("Error during login: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Invalid email/ID or password");
            errorResponse.put("error", "AUTHENTICATION_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    /**
     * Admin Login endpoint - specifically checks for ADMIN role
     */
    @PostMapping("/admin-login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest request) {
        System.out.println("=== ADMIN LOGIN REQUEST ===");
        System.out.println("Email or ID: " + request.getEmailOrId());
        
        try {
            AuthResponse response = authService.adminLogin(request);
            
            System.out.println("✅ Admin Login successful for: " + request.getEmailOrId());
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            System.err.println("Validation Error during admin login: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("error", "INVALID_CREDENTIALS");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            
        } catch (Exception e) {
            System.err.println("Error during admin login: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Invalid email/ID or password");
            errorResponse.put("error", "AUTHENTICATION_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    /**
     * ✅ SIMPLIFIED TEST ENDPOINT - No file upload, just JSON
     * Used to verify database connection and basic registration without file complexity
     */
    @PostMapping("/test-register")
    public ResponseEntity<?> testRegister(@RequestBody RegisterRequest request) {
        System.out.println("\n========== TEST REGISTRATION (NO FILE) ==========");
        System.out.println("Full Name: " + request.getFullName());
        System.out.println("Student ID: " + request.getStudentId());
        System.out.println("Email: " + request.getEmail());
        System.out.println("Phone: " + request.getPhoneNumber());
        System.out.println("Address: " + request.getAddress());
        System.out.println("Faculty: " + request.getFaculty());
        System.out.println("=================================================\n");
        
        try {
            // Call service WITHOUT file upload to test DB connection
            AuthResponse response = authService.register(request, null);
            System.out.println("✅ Test registration successful! User ID: " + response.getUserId() + "\n");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            // Exception handler will catch and return real error
            System.err.println("❌ Test registration failed: " + e.getMessage());
            throw e;
        }
    }
}
