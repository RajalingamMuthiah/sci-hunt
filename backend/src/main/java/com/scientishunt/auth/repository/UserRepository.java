package com.scientishunt.auth.repository;

import java.util.List;
import java.util.Optional;

import com.scientishunt.auth.model.Role;
import com.scientishunt.auth.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmailIgnoreCase(String email);
    List<User> findByRole(Role role);
}
