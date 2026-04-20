package com.scientishunt.auth.controller;

import java.util.List;
import java.util.Map;

import com.scientishunt.auth.dto.PasswordResetRequest;
import com.scientishunt.auth.dto.UserSummary;
import com.scientishunt.auth.model.Role;
import com.scientishunt.auth.model.User;
import com.scientishunt.auth.repository.UserRepository;
import com.scientishunt.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/users")
public class AdminAuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AdminAuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<List<UserSummary>> listUsers() {
        List<UserSummary> users = userRepository.findAll().stream()
                .map(u -> new UserSummary(u.getId(), u.getName(), u.getEmail(),
                        u.getRole() != null ? u.getRole().name() : null, u.getCreatedAt()))
                .toList();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/by-role/{role}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<List<UserSummary>> listByRole(@PathVariable String role) {
        Role r = Role.valueOf(role.toUpperCase());
        List<UserSummary> users = userRepository.findByRole(r).stream()
                .map(u -> new UserSummary(u.getId(), u.getName(), u.getEmail(),
                        u.getRole().name(), u.getCreatedAt()))
                .toList();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/{userId}/reset-password")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<Map<String, String>> resetPassword(
            @PathVariable String userId,
            @Valid @RequestBody PasswordResetRequest request) {
        authService.adminResetPassword(userId, request.getNewPassword());
        return ResponseEntity.ok(Map.of("status", "password_reset"));
    }
}
