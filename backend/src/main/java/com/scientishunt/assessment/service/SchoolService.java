package com.scientishunt.assessment.service;

import java.util.List;

import com.scientishunt.assessment.dto.SchoolRequest;
import com.scientishunt.assessment.dto.SchoolResponse;
import com.scientishunt.assessment.model.School;
import com.scientishunt.assessment.repository.SchoolRepository;
import org.springframework.stereotype.Service;

@Service
public class SchoolService {

    private final SchoolRepository schoolRepository;

    public SchoolService(SchoolRepository schoolRepository) {
        this.schoolRepository = schoolRepository;
    }

    public List<SchoolResponse> findAll() {
        return schoolRepository.findAll().stream().map(this::toResponse).toList();
    }

    public SchoolResponse findById(String id) {
        return schoolRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("School not found: " + id));
    }

    public SchoolResponse create(SchoolRequest request) {
        School school = new School();
        school.setName(request.getName());
        school.setPlan(request.getPlan());
        school.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        return toResponse(schoolRepository.save(school));
    }

    public SchoolResponse update(String id, SchoolRequest request) {
        School school = schoolRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("School not found: " + id));

        if (request.getName() != null)
            school.setName(request.getName());
        if (request.getPlan() != null)
            school.setPlan(request.getPlan());
        if (request.getStatus() != null)
            school.setStatus(request.getStatus());

        return toResponse(schoolRepository.save(school));
    }

    public void delete(String id) {
        if (!schoolRepository.existsById(id)) {
            throw new IllegalArgumentException("School not found: " + id);
        }
        schoolRepository.deleteById(id);
    }

    private SchoolResponse toResponse(School school) {
        return new SchoolResponse(school.getId(), school.getName(), school.getPlan(), school.getStatus());
    }
}
