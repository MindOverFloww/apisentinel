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
        // Ensure standard roles exist
        Role adminRole = getOrCreateRole("ADMIN");
        Role analystRole = getOrCreateRole("ANALYST");
        Role viewerRole = getOrCreateRole("VIEWER");

        // Custom bootstrap credentials if provided
        if (!username.isBlank() || !password.isBlank()) {
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

            if (!userRepository.existsByUsername(username)) {
                User admin = new User(
                        username,
                        email,
                        passwordEncoder.encode(password)
                );
                admin.addRole(adminRole);
                userRepository.save(admin);
                System.out.println("Configured admin bootstrap account '" + username + "' created.");
            }
            return;
        }

        // Out-of-the-box seeding for immediate local / testing usage
        User defaultAdmin = userRepository.findByUsername("admin").orElse(null);
        if (defaultAdmin == null) {
            User newAdmin = new User(
                    "admin",
                    "admin@apisentinel.local",
                    passwordEncoder.encode("admin123")
            );
            newAdmin.addRole(adminRole);
            userRepository.save(newAdmin);
            System.out.println("Initial admin account created: admin / admin123");
        } else {
            defaultAdmin.setPassword(passwordEncoder.encode("admin123"));
            defaultAdmin.setEnabled(true);
            boolean hasAdmin = defaultAdmin.getRoles().stream()
                    .anyMatch(r -> "ADMIN".equalsIgnoreCase(r.getName()));
            if (!hasAdmin) {
                defaultAdmin.addRole(adminRole);
            }
            userRepository.save(defaultAdmin);
            System.out.println("Admin account verified & synchronized: admin / admin123");
        }

        User defaultAnalyst = userRepository.findByUsername("analyst").orElse(null);
        if (defaultAnalyst == null) {
            User newAnalyst = new User(
                    "analyst",
                    "analyst@apisentinel.local",
                    passwordEncoder.encode("analyst123")
            );
            newAnalyst.addRole(analystRole);
            userRepository.save(newAnalyst);
            System.out.println("Initial analyst account created: analyst / analyst123");
        } else {
            defaultAnalyst.setPassword(passwordEncoder.encode("analyst123"));
            defaultAnalyst.setEnabled(true);
            boolean hasAnalyst = defaultAnalyst.getRoles().stream()
                    .anyMatch(r -> "ANALYST".equalsIgnoreCase(r.getName()));
            if (!hasAnalyst) {
                defaultAnalyst.addRole(analystRole);
            }
            userRepository.save(defaultAnalyst);
        }

        User defaultViewer = userRepository.findByUsername("viewer").orElse(null);
        if (defaultViewer == null) {
            User newViewer = new User(
                    "viewer",
                    "viewer@apisentinel.local",
                    passwordEncoder.encode("viewer123")
            );
            newViewer.addRole(viewerRole);
            userRepository.save(newViewer);
            System.out.println("Initial viewer account created: viewer / viewer123");
        } else {
            defaultViewer.setPassword(passwordEncoder.encode("viewer123"));
            defaultViewer.setEnabled(true);
            boolean hasViewer = defaultViewer.getRoles().stream()
                    .anyMatch(r -> "VIEWER".equalsIgnoreCase(r.getName()));
            if (!hasViewer) {
                defaultViewer.addRole(viewerRole);
            }
            userRepository.save(defaultViewer);
        }
    }

    private Role getOrCreateRole(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName)));
    }
}