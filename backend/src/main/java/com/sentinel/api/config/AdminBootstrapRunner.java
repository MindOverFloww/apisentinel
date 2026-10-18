package com.sentinel.api.config;

import com.sentinel.api.entity.Role;
import com.sentinel.api.entity.User;
import com.sentinel.api.repository.RoleRepository;
import com.sentinel.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminBootstrapRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final String username;
    private final String password;
    private final String email;

    public AdminBootstrapRunner(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            @Value("${ADMIN_BOOTSTRAP_USERNAME:}") String username,
            @Value("${ADMIN_BOOTSTRAP_PASSWORD:}") String password,
            @Value("${ADMIN_BOOTSTRAP_EMAIL:admin@apisentinel.local}") String email) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.username = username;
        this.password = password;
        this.email = (email == null || email.isBlank()) ? "admin@apisentinel.local" : email.trim();
    }

    @Override
    public void run(String... args) {
        if (username.isBlank() && password.isBlank()) {
            System.out.println(
                    "Admin bootstrap skipped: no bootstrap credentials configured.");
            return;
        }

        if (username.isBlank() || password.isBlank()) {
            throw new IllegalStateException(
                    "Set both ADMIN_BOOTSTRAP_USERNAME and ADMIN_BOOTSTRAP_PASSWORD.");
        }

        if (username.length() > 100 || password.length() < 8
                || password.length() > 100) {
            throw new IllegalStateException(
                    "Bootstrap username must be at most 100 characters; "
                    + "password must be 8-100 characters.");
        }

        if (userRepository.existsByUsername(username)) {
            System.out.println(
                    "Admin bootstrap skipped: username already exists.");
            return;
        }

        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new IllegalStateException("ADMIN role not found in database"));

        User admin = new User(
                username,
                email,
                passwordEncoder.encode(password)
        );
        admin.addRole(adminRole);

        userRepository.save(admin);
        System.out.println("Initial admin account created.");
    }
}