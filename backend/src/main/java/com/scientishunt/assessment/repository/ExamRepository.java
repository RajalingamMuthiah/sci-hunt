package com.scientishunt.assessment.repository;

import java.util.List;

import com.scientishunt.assessment.model.Exam;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ExamRepository extends MongoRepository<Exam, String> {
    List<Exam> findByTitleContainingIgnoreCase(String title);
}
