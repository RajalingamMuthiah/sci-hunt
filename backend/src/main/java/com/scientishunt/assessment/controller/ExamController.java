package com.scientishunt.assessment.controller;

import java.util.List;

import com.scientishunt.assessment.dto.ExamRequest;
import com.scientishunt.assessment.dto.ExamResponse;
import com.scientishunt.assessment.dto.ExamSummary;
import com.scientishunt.assessment.service.ExamService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/exams")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @GetMapping
    public ResponseEntity<List<ExamSummary>> list() {
        return ResponseEntity.ok(examService.findAllSummaries());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamResponse> get(@PathVariable String id) {
        return ResponseEntity.ok(examService.findById(id, isTeacherOrAbove()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<ExamSummary> create(@Valid @RequestBody ExamRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(examService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<ExamSummary> update(@PathVariable String id, @Valid @RequestBody ExamRequest request) {
        return ResponseEntity.ok(examService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        examService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private boolean isTeacherOrAbove() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null)
            return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> {
                    String r = a.getAuthority();
                    return r.equals("ROLE_SUPER_ADMIN") || r.equals("ROLE_SCHOOL_ADMIN") || r.equals("ROLE_TEACHER");
                });
    }
}
