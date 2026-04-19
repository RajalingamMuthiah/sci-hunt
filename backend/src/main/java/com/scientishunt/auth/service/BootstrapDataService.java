package com.scientishunt.auth.service;

import com.scientishunt.auth.model.Role;
import com.scientishunt.auth.model.User;
import com.scientishunt.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class BootstrapDataService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap.super-admin-email:admin@scientishunt.local}")
    private String superAdminEmail;

    @Value("${app.bootstrap.super-admin-password:Admin@123456}")
    private String superAdminPassword;

    public BootstrapDataService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmailIgnoreCase(superAdminEmail).isPresent()) {
            return;
        }

        User admin = new User();
        admin.setName("Super Admin");
        admin.setEmail(superAdminEmail);
        admin.setPassword(passwordEncoder.encode(superAdminPassword));
        admin.setRole(Role.SUPER_ADMIN);
        admin.setMfaEnabled(false);
        userRepository.save(admin);
    }
}
