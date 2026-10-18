
package com.sentinel.api.dto.auth;

public record LoginResponse(
    String token,
    String tokenType,
    long expiresIn,
    UserInfo user
) {
    public record UserInfo(
        Long id,
        String username,
        String role
    ) {}
}
