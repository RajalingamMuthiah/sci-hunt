package com.scientishunt.controller;

import java.util.Map;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class HealthController {

    private final MongoTemplate mongoTemplate;

    public HealthController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping
    public ResponseEntity<Map<String, String>> health() {
        try {
            mongoTemplate.getDb().runCommand(
                new org.bson.Document("ping", 1)
            );
            return ResponseEntity.ok(Map.of(
                "status", "UP",
                "database", "CONNECTED",
                "db", mongoTemplate.getDb().getName()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(503).body(Map.of(
                "status", "DOWN",
                "database", "DISCONNECTED",
                "error", e.getMessage()
            ));
        }
    }
}