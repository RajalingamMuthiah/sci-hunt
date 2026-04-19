package com.scientishunt.auth.service;

import java.time.Duration;
import java.util.Optional;

import com.scientishunt.auth.dto.AuthUserDto;
import com.scientishunt.auth.dto.LoginRequest;
import com.scientishunt.auth.dto.LoginResponse;
import com.scientishunt.auth.dto.MfaCodeRequest;
import com.scientishunt.auth.dto.MfaSetupResponse;
import com.scientishunt.auth.dto.MfaVerifyRequest;
import com.scientishunt.auth.dto.RegisterRequest;
import com.scientishunt.auth.model.RefreshToken;
import com.scientishunt.auth.model.User;
import com.scientishunt.auth.repository.UserRepository;
import com.scientishunt.security.CookieService;
import com.scientishunt.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;
    private final CookieService cookieService;
    private final TotpService totpService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            RefreshTokenService refreshTokenService,
            JwtService jwtService,
            CookieService cookieService,
            TotpService totpService,
            PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.refreshTokenService = refreshTokenService;
        this.jwtService = jwtService;
        this.cookieService = cookieService;
        this.totpService = totpService;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        if (!authentication.isAuthenticated()) {
            throw new BadCredentialsException("Invalid credentials");
        }

        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (user.isMfaEnabled()) {
            String challenge = jwtService.generateMfaChallengeToken(user.getId());
            return LoginResponse.mfaRequired(challenge);
        }

        issueSessionCookies(user, response);
        return LoginResponse.success(toAuthUser(user));
    }

    public AuthUserDto verifyMfa(MfaVerifyRequest request, HttpServletResponse response) {
        String userId = jwtService.parseOfType(request.getChallengeToken(), "mfa_challenge")
                .map(claims -> claims.getSubject())
                .orElseThrow(() -> new BadCredentialsException("Invalid MFA challenge"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadCredentialsException("Invalid MFA challenge"));

        if (!user.isMfaEnabled() || user.getMfaSecret() == null
                || !totpService.verifyCode(user.getMfaSecret(), request.getCode())) {
            throw new BadCredentialsException("Invalid MFA code");
        }

        issueSessionCookies(user, response);
        return toAuthUser(user);
    }

    public void refresh(HttpServletRequest request, HttpServletResponse response) {
        String currentToken = cookieService.readRefreshToken(request)
                .orElseThrow(() -> new BadCredentialsException("Missing refresh token"));

        RefreshToken rotated = refreshTokenService.rotate(currentToken);

        User user = userRepository.findById(rotated.getUserId())
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());

        cookieService.writeAccessCookie(response, accessToken, Duration.ofMinutes(15));
        cookieService.writeRefreshCookie(response, rotated.getToken(),
                Duration.ofDays(refreshTokenService.getRefreshDays()));
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        Optional<String> refreshToken = cookieService.readRefreshToken(request);
        refreshToken.ifPresent(refreshTokenService::revokeByToken);
        cookieService.clearAuthCookies(response);
    }

    public AuthUserDto me(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toAuthUser(user);
    }

    public MfaSetupResponse generateMfaSetup(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String secret = totpService.generateSecret();
        user.setMfaSecret(secret);
        user.setMfaEnabled(false);
        userRepository.save(user);

        String otpAuthUri = totpService.buildOtpAuthUri(user.getEmail(), secret);
        return new MfaSetupResponse(secret, otpAuthUri);
    }

    public AuthUserDto enableMfa(String email, MfaCodeRequest request) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getMfaSecret() == null || !totpService.verifyCode(user.getMfaSecret(), request.getCode())) {
            throw new BadCredentialsException("Invalid MFA code");
        }

        user.setMfaEnabled(true);
        userRepository.save(user);
        return toAuthUser(user);
    }

    public void adminResetPassword(String userId, String rawPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setPassword(passwordEncoder.encode(rawPassword));
        userRepository.save(user);
        refreshTokenService.revokeByUserId(user.getId());
    }

    public AuthUserDto register(RegisterRequest request) {
        if (userRepository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }
        // Public registration: only STUDENT and SCHOOL_ADMIN allowed; everything else
        // defaults to STUDENT.
        com.scientishunt.auth.model.Role assignedRole = com.scientishunt.auth.model.Role.STUDENT;
        if (request.getRole() != null) {
            try {
                com.scientishunt.auth.model.Role requested = com.scientishunt.auth.model.Role
                        .valueOf(request.getRole().toUpperCase());
                if (requested == com.scientishunt.auth.model.Role.SCHOOL_ADMIN) {
                    assignedRole = com.scientishunt.auth.model.Role.SCHOOL_ADMIN;
                }
                // SUPER_ADMIN and TEACHER can only be granted by an existing admin.
            } catch (IllegalArgumentException ignored) {
                /* unknown value → STUDENT */ }
        }
        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(assignedRole);
        user.setMfaEnabled(false);
        userRepository.save(user);
        return toAuthUser(user);
    }

    private void issueSessionCookies(User user, HttpServletResponse response) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        RefreshToken refreshToken = refreshTokenService.issueForUser(user.getId());

        cookieService.writeAccessCookie(response, accessToken, Duration.ofMinutes(15));
        cookieService.writeRefreshCookie(response, refreshToken.getToken(),
                Duration.ofDays(refreshTokenService.getRefreshDays()));
    }

    private AuthUserDto toAuthUser(User user) {
        return new AuthUserDto(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.isMfaEnabled());
    }
}
