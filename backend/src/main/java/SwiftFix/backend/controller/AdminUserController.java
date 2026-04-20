package SwiftFix.backend.controller;

import SwiftFix.backend.dto.UpdateUserRequest;
import SwiftFix.backend.dto.UserDTO;
import SwiftFix.backend.service.UserService;
import SwiftFix.backend.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class AdminUserController {
    private final UserService userService;
    private final JwtProvider jwtProvider;

    @GetMapping("/test")
    public String test() {
        return "Admin API reachable";
    }

    private boolean isAdmin(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtProvider.validateToken(token)) {
                String role = jwtProvider.getRoleFromToken(token);
                return "ADMIN".equals(role);
            }
        }
        return false;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        System.out.println("DEBUG: Admin GET users called with authHeader: " + (authHeader != null ? "PRESENT" : "MISSING"));
        if (!isAdmin(authHeader)) {
            System.out.println("DEBUG: Admin check FAILED");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        System.out.println("DEBUG: Admin check PASSED. Fetching users...");
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (!isAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            UserDTO updatedUser = userService.updateUser(id, request);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (!isAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
