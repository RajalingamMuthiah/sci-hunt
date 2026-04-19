package com.scientishunt.assessment.repository;

import java.util.List;
import java.util.Optional;

import com.scientishunt.assessment.model.Attempt;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AttemptRepository extends MongoRepository<Attempt, String> {
    List<Attempt> findByExamId(String examId);

    List<Attempt> findByUserId(String userId);

    Optional<Attempt> findByExamIdAndUserId(String examId, String userId);

    boolean existsByExamIdAndUserId(String examId, String userId);
}
