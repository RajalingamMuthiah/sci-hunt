package com.scientishunt.assessment.repository;

import java.util.Collection;
import java.util.List;

import com.scientishunt.assessment.model.Question;
import com.scientishunt.assessment.model.QuestionType;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface QuestionRepository extends MongoRepository<Question, String> {
    List<Question> findBySubjectIgnoreCase(String subject);

    List<Question> findByType(QuestionType type);

    List<Question> findByDifficultyIgnoreCase(String difficulty);

    long countByIdIn(Collection<String> ids);
}
