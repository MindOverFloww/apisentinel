
package com.sentinel.api.service;

import com.sentinel.api.dto.user.CreateUserRequest;
import com.sentinel.api.dto.user.UserResponse;
import com.sentinel.api.entity.Role;
import com.sentinel.api.entity.User;
import com.sentinel.api.repository.RoleRepository;
import com.sentinel.api.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
        UserRepository userRepository,
        RoleRepository roleRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "Username already exists"
            );
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "Email already exists"
            );
        }

        String roleName = request.role().trim().toUpperCase(Locale.ROOT);

        if (!List.of("ADMIN", "ANALYST", "VIEWER").contains(roleName)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Invalid role"
            );
        }

        Role role = roleRepository.findByName(roleName)
            .orElseThrow(() -> new IllegalStateException(
                "Required role missing from database: " + roleName
            ));

        User user = new User(
            request.username(),
            request.email(),
            passwordEncoder.encode(request.password())
        );
        user.addRole(role);

        return toResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
            .stream()
            .map(this::toResponse)
            .toList();
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getPrimaryRoleName(),
            user.getCreatedAt()
        );
    }
}
