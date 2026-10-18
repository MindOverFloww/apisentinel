package com.sentinel.api.security;

import com.sentinel.api.entity.Role;
import com.sentinel.api.entity.User;
import com.sentinel.api.repository.UserRepository;
import com.sentinel.api.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("AuthService authenticate succeeds for valid credentials")
    void testAuthenticateSuccess() {
        User user = new User("admin", "admin@sentinel.local", "encodedPassword");
        Role role = new Role("ADMIN");
        user.addRole(role);

        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);

        User authenticated = authService.authenticate("admin", "password123");

        assertNotNull(authenticated);
        assertEquals("admin", authenticated.getUsername());
        assertEquals("ADMIN", authenticated.getPrimaryRoleName());
    }

    @Test
    @DisplayName("AuthService authenticate fails for incorrect password")
    void testAuthenticateWrongPassword() {
        User user = new User("admin", "admin@sentinel.local", "encodedPassword");
        user.addRole(new Role("ADMIN"));

        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () ->
                authService.authenticate("admin", "wrongPassword"));
    }
}
