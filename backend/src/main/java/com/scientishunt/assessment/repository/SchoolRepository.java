package com.scientishunt.assessment.repository;

import com.scientishunt.assessment.model.School;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SchoolRepository extends MongoRepository<School, String> {
}
