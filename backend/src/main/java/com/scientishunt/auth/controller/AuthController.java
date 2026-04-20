package com.scientishunt.auth.controller;

import java.security.Principal;
import java.util.Map;

import com.scientishunt.auth.dto.AuthUserDto;
import com.scientishunt.auth.dto.LoginRequest;
import com.scientishunt.auth.dto.LoginResponse;
import com.scientishunt.auth.dto.MfaCodeRequest;
import com.scientishunt.auth.dto.MfaSetupResponse;
import com.scientishunt.auth.dto.MfaVerifyRequest;
import com.scientishunt.auth.dto.RegisterRequest;
import com.scientishunt.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/csrf")
    public Map<String, String> csrf(HttpServletRequest request) {
        CsrfToken token = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (token == null) {
            throw new IllegalStateException("CSRF token not initialized");
        }
        return Map.of("token", token.getToken());
    }

    @PostMapping("/register")
    public ResponseEntity<AuthUserDto> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(201).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        return ResponseEntity.ok(authService.login(request, response));
    }

    @PostMapping("/mfa/verify")
    public ResponseEntity<AuthUserDto> verifyMfa(@Valid @RequestBody MfaVerifyRequest request,
            HttpServletResponse response) {
        return ResponseEntity.ok(authService.verifyMfa(request, response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(HttpServletRequest request, HttpServletResponse response) {
        authService.refresh(request, response);
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(request, response);
        return ResponseEntity.ok(Map.of("status", "logged_out"));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthUserDto> me(Principal principal) {
        return ResponseEntity.ok(authService.me(principal.getName()));
    }

    @PostMapping("/mfa/setup")
    public ResponseEntity<MfaSetupResponse> mfaSetup(Principal principal) {
        return ResponseEntity.ok(authService.generateMfaSetup(principal.getName()));
    }

    @PostMapping("/mfa/enable")
    public ResponseEntity<AuthUserDto> enableMfa(Principal principal, @Valid @RequestBody MfaCodeRequest request) {
        return ResponseEntity.ok(authService.enableMfa(principal.getName(), request));
    }
}
