package SwiftFix.backend.controller;

import SwiftFix.backend.dto.UpdateUserRequest;
import SwiftFix.backend.dto.UserDTO;
import SwiftFix.backend.service.UserService;
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

    /**
     * POST /api/users/register - Register a new user
     * Note: This endpoint redirects to /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register() {
        return ResponseEntity.status(HttpStatus.MOVED_PERMANENTLY).body("Use /api/auth/register instead");
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
}
