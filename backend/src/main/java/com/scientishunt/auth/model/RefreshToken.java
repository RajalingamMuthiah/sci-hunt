package com.scientishunt.auth.model;

import java.time.Instant;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "refresh_tokens")
public class RefreshToken {

    @Id
    private String id;

    @NotBlank
    @Indexed(unique = true)
    @Field("token")
    private String token;

    @Indexed
    @Field("user_id")
    private String userId;

    @Indexed(expireAfterSeconds = 0)
    @Field("expiry_date")
    private Instant expiryDate;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Instant getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(Instant expiryDate) {
        this.expiryDate = expiryDate;
    }
}
