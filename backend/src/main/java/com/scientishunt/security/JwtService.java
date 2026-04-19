package com.scientishunt.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final SecretKey key;
    private final String issuer;
    private final long accessTokenMinutes;

    public JwtService(
            @Value("${app.security.jwt-secret}") String secret,
            @Value("${app.security.issuer}") String issuer,
            @Value("${app.security.access-token-minutes:15}") long accessTokenMinutes) {
        if (secret.length() < 32) {
            throw new IllegalArgumentException("JWT secret must be at least 32 characters");
        }
        this.key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), SignatureAlgorithm.HS256.getJcaName());
        this.issuer = issuer;
        this.accessTokenMinutes = accessTokenMinutes;
    }

    public String generateAccessToken(String userId, String email, String role) {
        Instant now = Instant.now();
        Instant expiry = now.plus(accessTokenMinutes, ChronoUnit.MINUTES);

        return Jwts.builder()
                .issuer(issuer)
                .subject(userId)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .claims(Map.of("email", email, "role", role, "type", "access"))
                .signWith(key)
                .compact();
    }

    public String generateMfaChallengeToken(String userId) {
        Instant now = Instant.now();
        Instant expiry = now.plus(5, ChronoUnit.MINUTES);

        return Jwts.builder()
                .issuer(issuer)
                .subject(userId)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .claims(Map.of("type", "mfa_challenge"))
                .signWith(key)
                .compact();
    }

    public Optional<Claims> parse(String token) {
        try {
            Jws<Claims> jws = Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return Optional.of(jws.getPayload());
        } catch (JwtException | IllegalArgumentException ex) {
            return Optional.empty();
        }
    }

    public Optional<Claims> parseOfType(String token, String expectedType) {
        return parse(token)
                .filter(claims -> expectedType.equals(claims.get("type", String.class)));
    }
}
