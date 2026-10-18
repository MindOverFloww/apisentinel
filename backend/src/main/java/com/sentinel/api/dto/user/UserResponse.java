
package com.sentinel.api.dto.user;

import java.time.Instant;

public record UserResponse(
    Long id,
    String username,
    String role,
    Instant createdAt
) {}
