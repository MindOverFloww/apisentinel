
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
        String cleanUsername = request.username().trim();
        String cleanEmail = request.email().trim().toLowerCase(Locale.ROOT);

        if (cleanUsername.length() < 3 || cleanUsername.length() > 100) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Username must be between 3 and 100 characters"
            );
        }

        if (userRepository.existsByUsername(cleanUsername)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "Username '" + cleanUsername + "' already exists"
            );
        }

        if (userRepository.existsByEmail(cleanEmail)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "Email '" + cleanEmail + "' already exists"
            );
        }

        String roleName = request.role().trim().toUpperCase(Locale.ROOT);
        if (roleName.startsWith("ROLE_")) {
            roleName = roleName.substring(5);
        }

        if (!List.of("ADMIN", "ANALYST", "VIEWER").contains(roleName)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Invalid role: must be ADMIN, ANALYST, or VIEWER"
            );
        }

        final String finalRoleName = roleName;
        Role role = roleRepository.findByName(finalRoleName)
            .orElseGet(() -> roleRepository.save(new Role(finalRoleName)));

        User user = new User(
            cleanUsername,
            cleanEmail,
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

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "User not found"
            ));

        if ("admin".equalsIgnoreCase(user.getUsername())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "The primary 'admin' account cannot be deleted"
            );
        }

        userRepository.delete(user);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getPrimaryRoleName(),
            user.getCreatedAt()
        );
    }
}
