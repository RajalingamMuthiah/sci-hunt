package com.scientishunt.auth.service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;

import com.scientishunt.auth.model.RefreshToken;
import com.scientishunt.auth.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final SecureRandom secureRandom = new SecureRandom();
    private final long refreshDays;

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            @Value("${app.security.refresh-token-days:7}") long refreshDays) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshDays = refreshDays;
    }

    public RefreshToken issueForUser(String userId) {
        refreshTokenRepository.deleteByUserId(userId);

        RefreshToken token = new RefreshToken();
        token.setUserId(userId);
        token.setToken(generateOpaqueToken());
        token.setExpiryDate(Instant.now().plus(refreshDays, ChronoUnit.DAYS));
        return refreshTokenRepository.save(token);
    }

    public RefreshToken rotate(String oldTokenValue) {
        RefreshToken existing = refreshTokenRepository.findByToken(oldTokenValue)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (existing.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.deleteByToken(oldTokenValue);
            throw new IllegalArgumentException("Refresh token expired");
        }

        refreshTokenRepository.deleteByToken(oldTokenValue);
        return issueForUser(existing.getUserId());
    }

    public String getUserIdIfValid(String tokenValue) {
        RefreshToken token = refreshTokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.deleteByToken(tokenValue);
            throw new IllegalArgumentException("Refresh token expired");
        }
        return token.getUserId();
    }

    public void revokeByToken(String tokenValue) {
        refreshTokenRepository.deleteByToken(tokenValue);
    }

    public void revokeByUserId(String userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    private String generateOpaqueToken() {
        byte[] bytes = new byte[48];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public long getRefreshDays() {
        return refreshDays;
    }
}
