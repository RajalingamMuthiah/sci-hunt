package com.scientishunt.auth.service;

import java.time.Instant;
import java.util.Optional;

import com.scientishunt.auth.dto.LoginRequest;
import com.scientishunt.auth.model.RefreshToken;
import com.scientishunt.auth.model.Role;
import com.scientishunt.auth.model.User;
import com.scientishunt.auth.repository.UserRepository;
import com.scientishunt.security.CookieService;
import com.scientishunt.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private JwtService jwtService;
    @Mock
    private CookieService cookieService;
    @Mock
    private RefreshTokenService refreshTokenService;
    @Mock
    private TotpService totpService;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private User user;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId("u1");
        user.setEmail("admin@test.com");
        user.setRole(Role.SUPER_ADMIN);
        user.setMfaEnabled(false);

        userDetails = org.springframework.security.core.userdetails.User.builder()
                .username("admin@test.com")
                .password("{noop}password")
                .roles("SUPER_ADMIN")
                .build();
    }

    @Test
    void login_noMfa_issuesCookies() throws Exception {
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(userDetails);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(userRepository.findByEmailIgnoreCase("admin@test.com")).thenReturn(Optional.of(user));

        RefreshToken rt = new RefreshToken();
        rt.setToken("token123");
        rt.setExpiryDate(Instant.now().plusSeconds(3600));

        when(refreshTokenService.issueForUser("u1")).thenReturn(rt);
        when(jwtService.generateAccessToken(any(), any(), any())).thenReturn("access_jwt");

        jakarta.servlet.http.HttpServletResponse response = mock(jakarta.servlet.http.HttpServletResponse.class);
        LoginRequest request = new LoginRequest();
        request.setEmail("admin@test.com");
        request.setPassword("password");

        var result = authService.login(request, response);

        assertThat(result.isMfaRequired()).isFalse();
        verify(cookieService).writeAccessCookie(any(), any(), any());
        verify(cookieService).writeRefreshCookie(any(), any(), any());
    }

    @Test
    void login_mfaEnabled_doesNotIssueCookies() throws Exception {
        user.setMfaEnabled(true);
        user.setMfaSecret("JBSWY3DPEHPK3PXP");

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(userDetails);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(userRepository.findByEmailIgnoreCase("admin@test.com")).thenReturn(Optional.of(user));
        when(jwtService.generateMfaChallengeToken(any())).thenReturn("mfa_jwt");

        jakarta.servlet.http.HttpServletResponse response = mock(jakarta.servlet.http.HttpServletResponse.class);
        LoginRequest request = new LoginRequest();
        request.setEmail("admin@test.com");
        request.setPassword("password");

        var result = authService.login(request, response);

        assertThat(result.isMfaRequired()).isTrue();
        assertThat(result.getChallengeToken()).isEqualTo("mfa_jwt");
    }
}
