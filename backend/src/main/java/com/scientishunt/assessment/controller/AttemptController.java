package com.scientishunt.assessment.controller;

import java.security.Principal;
import java.util.List;

import com.scientishunt.assessment.dto.AttemptRequest;
import com.scientishunt.assessment.dto.AttemptResponse;
import com.scientishunt.assessment.service.AttemptService;
import com.scientishunt.auth.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/attempts")
public class AttemptController {

    private final AttemptService attemptService;
    private final UserRepository userRepository;

    public AttemptController(AttemptService attemptService, UserRepository userRepository) {
        this.attemptService = attemptService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<AttemptResponse> submit(@Valid @RequestBody AttemptRequest request, Principal principal) {
        String userId = resolveUserId(principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(attemptService.submit(request, userId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<AttemptResponse>> myAttempts(Principal principal) {
        String userId = resolveUserId(principal.getName());
        return ResponseEntity.ok(attemptService.findByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttemptResponse> get(@PathVariable String id) {
        return ResponseEntity.ok(attemptService.findById(id));
    }

    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<List<AttemptResponse>> byExam(@PathVariable String examId) {
        return ResponseEntity.ok(attemptService.findByExam(examId));
    }

    @GetMapping("/exam/{examId}/my")
    public ResponseEntity<AttemptResponse> myAttemptForExam(@PathVariable String examId, Principal principal) {
        String userId = resolveUserId(principal.getName());
        return ResponseEntity.ok(attemptService.findByExamAndUser(examId, userId));
    }

    private String resolveUserId(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .map(user -> user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
