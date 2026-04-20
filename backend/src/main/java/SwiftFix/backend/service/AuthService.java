package SwiftFix.backend.service;

import SwiftFix.backend.dto.LoginRequest;
import SwiftFix.backend.dto.AuthResponse;
import SwiftFix.backend.dto.RegisterRequest;
import SwiftFix.backend.exception.ResourceNotFoundException;
import SwiftFix.backend.model.User;
import SwiftFix.backend.repository.UserRepository;
import SwiftFix.backend.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import SwiftFix.backend.repository.AdminRepository;
import SwiftFix.backend.model.Admin;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final JwtProvider jwtProvider;
    private final BCryptPasswordEncoder passwordEncoder;
    private static final String UPLOAD_DIR = "uploads/profiles/";

    public AuthResponse register(RegisterRequest request, MultipartFile profilePhoto) {
        System.out.println("→ Starting registration for: " + request.getEmail());
        
        // Validate unique email and student ID
        if (userRepository.existsByEmail(request.getEmail())) {
            System.out.println("  ❌ Email already registered");
            throw new IllegalArgumentException("Email already registered");
        }
        if (userRepository.existsByStudentId(request.getStudentId())) {
            System.out.println("  ❌ Student ID already registered");
            throw new IllegalArgumentException("Student ID already registered");
        }

        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            System.out.println("  ❌ Password mismatch");
            throw new IllegalArgumentException("Passwords do not match");
        }

        // Save profile photo if provided - GRACEFULLY HANDLE FAILURES
        String profilePhotoPath = null;
        if (profilePhoto != null && !profilePhoto.isEmpty()) {
            try {
                System.out.println("  → Attempting to save profile photo: " + profilePhoto.getOriginalFilename());
                profilePhotoPath = saveProfilePhoto(profilePhoto);
                System.out.println("  ✅ Profile photo saved successfully");
            } catch (Exception e) {
                // Don't throw exception - just log the error and continue
                System.out.println("  ⚠️  Profile photo upload failed (but registration will continue): " + e.getMessage());
                System.out.println("  → User will register without profile photo");
                profilePhotoPath = null; // Set to null and proceed
            }
        } else {
            System.out.println("  → No profile photo provided");
        }

        // Create and save user (with or without photo)
        System.out.println("  → Creating user account...");
        User user = User.builder()
                .fullName(request.getFullName())
                .studentId(request.getStudentId())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .faculty(request.getFaculty())
                .password(passwordEncoder.encode(request.getPassword()))
                .profilePhotoPath(profilePhotoPath)
                .role("USER")
                .build();

        User savedUser = userRepository.save(user);
        System.out.println("  ✅ User saved successfully with ID: " + savedUser.getId());

        // Generate JWT token
        String token = jwtProvider.generateToken(savedUser.getId(), savedUser.getEmail(), 
                                                 savedUser.getRole(), savedUser.getFullName());

        System.out.println("  ✅ JWT token generated");
        System.out.println("✅ Registration completed successfully for: " + request.getEmail());
        
        return new AuthResponse(token, savedUser.getRole(), 
                               savedUser.getId(), savedUser.getEmail(), savedUser.getFullName());
    }

    public AuthResponse login(LoginRequest request) {
        // Find user by email or student ID
        User user = userRepository.findByEmail(request.getEmailOrId())
                .orElseGet(() -> userRepository.findByStudentId(request.getEmailOrId())
                        .orElseThrow(() -> new ResourceNotFoundException("User not found")));

        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        // Generate JWT token
        String token = jwtProvider.generateToken(user.getId(), user.getEmail(), 
                                                 user.getRole(), user.getFullName());

        return new AuthResponse(token, user.getRole(), 
                               user.getId(), user.getEmail(), user.getFullName());
    }

    public AuthResponse adminLogin(LoginRequest request) {
        Admin admin = adminRepository.findByEmail(request.getEmailOrId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtProvider.generateToken(admin.getId(), admin.getEmail(),
                admin.getRole(), "Administrator");

        return new AuthResponse(token, admin.getRole(),
                admin.getId(), admin.getEmail(), "Administrator");
    }

    private String saveProfilePhoto(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            System.out.println("    Profile photo is empty or null");
            return null;
        }

        System.out.println("    Saving file: " + file.getOriginalFilename() + " (" + file.getSize() + " bytes, type: " + file.getContentType() + ")");

        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            boolean created = uploadDir.mkdirs();
            System.out.println("    Upload directory created: " + created + " at " + uploadDir.getAbsolutePath());
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String filePath = UPLOAD_DIR + fileName;
        
        try {
            file.transferTo(new File(filePath));
            System.out.println("    ✅ File saved to: " + filePath);
            return filePath;
        } catch (IOException e) {
            System.err.println("    ❌ Failed to save file: " + e.getMessage());
            throw new IOException("Failed to save profile photo: " + e.getMessage(), e);
        }
    }
}
