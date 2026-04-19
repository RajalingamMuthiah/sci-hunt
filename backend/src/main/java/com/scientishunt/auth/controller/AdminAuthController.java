package com.scientishunt.auth.controller;

import java.util.Map;

import com.scientishunt.auth.dto.PasswordResetRequest;
import com.scientishunt.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/users")
public class AdminAuthController {

    private final AuthService authService;

    public AdminAuthController(AuthService authService) {
        this.authService = authService;
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
