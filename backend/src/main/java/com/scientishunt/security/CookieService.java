package com.scientishunt.security;

import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class CookieService {

    private final String accessCookieName;
    private final String refreshCookieName;
    private final boolean secureCookies;

    public CookieService(
            @Value("${app.security.access-cookie-name:SH_ACCESS}") String accessCookieName,
            @Value("${app.security.refresh-cookie-name:SH_REFRESH}") String refreshCookieName,
            @Value("${app.security.secure-cookies:false}") boolean secureCookies) {
        this.accessCookieName = accessCookieName;
        this.refreshCookieName = refreshCookieName;
        this.secureCookies = secureCookies;
    }

    public void writeAccessCookie(HttpServletResponse response, String token, Duration duration) {
        ResponseCookie cookie = ResponseCookie.from(accessCookieName, token)
                .httpOnly(true)
                .secure(secureCookies)
                .path("/")
                .sameSite("Lax")
                .maxAge(duration)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }

    public void writeRefreshCookie(HttpServletResponse response, String token, Duration duration) {
        ResponseCookie cookie = ResponseCookie.from(refreshCookieName, token)
                .httpOnly(true)
                .secure(secureCookies)
                .path("/")
                .sameSite("Lax")
                .maxAge(duration)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }

    public void clearAuthCookies(HttpServletResponse response) {
        ResponseCookie access = ResponseCookie.from(accessCookieName, "")
                .httpOnly(true)
                .secure(secureCookies)
                .path("/")
                .sameSite("Lax")
                .maxAge(0)
                .build();

        ResponseCookie refresh = ResponseCookie.from(refreshCookieName, "")
                .httpOnly(true)
                .secure(secureCookies)
                .path("/")
                .sameSite("Lax")
                .maxAge(0)
                .build();

        response.addHeader("Set-Cookie", access.toString());
        response.addHeader("Set-Cookie", refresh.toString());
    }

    public Optional<String> readAccessToken(HttpServletRequest request) {
        return readCookie(request, accessCookieName);
    }

    public Optional<String> readRefreshToken(HttpServletRequest request) {
        return readCookie(request, refreshCookieName);
    }

    private Optional<String> readCookie(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null || cookies.length == 0) {
            return Optional.empty();
        }
        return Arrays.stream(cookies)
                .filter(cookie -> cookieName.equals(cookie.getName()))
                .map(Cookie::getValue)
                .filter(value -> value != null && !value.isBlank())
                .findFirst();
    }
}
