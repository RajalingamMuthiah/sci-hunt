package com.scientishunt.auth.repository;

import java.util.Optional;

import com.scientishunt.auth.model.RefreshToken;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RefreshTokenRepository extends MongoRepository<RefreshToken, String> {
    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUserId(String userId);

    void deleteByToken(String token);

    void deleteByUserId(String userId);
}
