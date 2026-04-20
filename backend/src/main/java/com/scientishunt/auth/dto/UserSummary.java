package com.scientishunt.auth.dto;

import java.time.Instant;

public record UserSummary(String id, String name, String email, String role, Instant createdAt) {}
