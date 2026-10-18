package com.sentinel.api.controller;

import com.sentinel.api.dto.auth.LoginRequest;
import com.sentinel.api.dto.auth.LoginResponse;
import com.sentinel.api.entity.User;
import com.sentinel.api.security.JwtService;
import com.sentinel.api.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        User user = authService.authenticate(
                request.username(),
                request.password()
        );

        String token = jwtService.generateToken(user);

        return new LoginResponse(
                token,
                "Bearer",
                jwtService.getExpirationMs() / 1000,
                new LoginResponse.UserInfo(
                        user.getId(),
                        user.getUsername(),
                        user.getPrimaryRoleName()
                )
        );
    }
}