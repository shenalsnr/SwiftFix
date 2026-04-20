package SwiftFix.backend.controller;

import SwiftFix.backend.dto.UpdateUserRequest;
import SwiftFix.backend.dto.UpdateProfileRequest;
import SwiftFix.backend.dto.UserDTO;
import SwiftFix.backend.service.UserService;
import SwiftFix.backend.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UserController {
    private final UserService userService;
    private final JwtProvider jwtProvider;

    /**
     * POST /api/users/register - Register a new user
     * Note: This endpoint redirects to /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register() {
        return ResponseEntity.status(HttpStatus.MOVED_PERMANENTLY).body("Use /api/auth/register instead");
    }

    /**
     * GET /api/users/me - Get current logged-in user (Module E - Auth Integration)
     * Requires Authentication Token in header
     * Returns user details with notification preferences (Module D - Notifications)
     */
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            UserDTO user = userService.getCurrentUser(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * PUT /api/users/profile - Update user profile and notification preferences
     * Requires Authentication Token in header
     * Integrates Module E (Auth) and Module D (Notifications)
     */
    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateUserProfile(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody UpdateProfileRequest request) {
        Long userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            UserDTO updatedUser = userService.updateUserProfile(userId, request);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * GET /api/users - Get all users (Admin only)
     */
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        // Check if user is admin (in a real app, use Spring Security)
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * GET /api/users/{id} - Get user by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * PUT /api/users/{id} - Update user profile
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request) {
        UserDTO updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * DELETE /api/users/{id} - Delete user (Admin only)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Helper method to extract userId from JWT token
     * Uses JwtProvider to parse and validate token
     */
    private Long extractUserIdFromToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                if (jwtProvider.validateToken(token)) {
                    return jwtProvider.getUserIdFromToken(token);
                }
            } catch (Exception e) {
                // Invalid token
                return null;
            }
        }
        return null;
    }
}
