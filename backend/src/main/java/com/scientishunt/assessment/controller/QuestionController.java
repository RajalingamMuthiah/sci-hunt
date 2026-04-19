package com.scientishunt.assessment.controller;

import java.util.List;

import com.scientishunt.assessment.dto.QuestionRequest;
import com.scientishunt.assessment.dto.QuestionResponse;
import com.scientishunt.assessment.model.QuestionType;
import com.scientishunt.assessment.service.QuestionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping
    public ResponseEntity<List<QuestionResponse>> list(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) QuestionType type) {
        boolean includeAnswers = isTeacherOrAbove();

        if (subject != null)
            return ResponseEntity.ok(questionService.findBySubject(subject, includeAnswers));
        if (difficulty != null)
            return ResponseEntity.ok(questionService.findByDifficulty(difficulty, includeAnswers));
        if (type != null)
            return ResponseEntity.ok(questionService.findByType(type, includeAnswers));

        return ResponseEntity.ok(questionService.findAll(includeAnswers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponse> get(@PathVariable String id) {
        return ResponseEntity.ok(questionService.findById(id, isTeacherOrAbove()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<QuestionResponse> create(@Valid @RequestBody QuestionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(questionService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<QuestionResponse> update(
            @PathVariable String id,
            @Valid @RequestBody QuestionRequest request) {
        return ResponseEntity.ok(questionService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        questionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private boolean isTeacherOrAbove() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        if (auth == null)
            return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> {
                    String r = a.getAuthority();
                    return r.equals("ROLE_SUPER_ADMIN") || r.equals("ROLE_SCHOOL_ADMIN") || r.equals("ROLE_TEACHER");
                });
    }
}
