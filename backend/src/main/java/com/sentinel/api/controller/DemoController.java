package com.sentinel.api.controller;

import com.sentinel.api.entity.ApiEvent;
import com.sentinel.api.service.ApiEventService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/demo")
public class DemoController {

    private final ApiEventService apiEventService;

    public DemoController(ApiEventService apiEventService) {
        this.apiEventService = apiEventService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials,
                                                     HttpServletRequest request) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        String ip = request.getRemoteAddr();

        boolean success = "admin".equals(username) && "sentinel2026".equals(password);
        int statusCode = success ? 200 : 401;

        ApiEvent event = new ApiEvent("POST", "/api/demo/login", statusCode, ip != null ? ip : "127.0.0.1");
        event.setRequestBody("{\"username\":\"" + username + "\",\"password\":\"" + password + "\"}");
        event.setUserAgent(request.getHeader("User-Agent"));
        apiEventService.recordEvent(event);

        if (success) {
            return ResponseEntity.ok(Map.of("message", "Login successful", "user", username));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized", "message", "Invalid username or password"));
        }
    }

    @GetMapping("/products")
    public ResponseEntity<Map<String, Object>> getProducts(@RequestParam(required = false) String search,
                                                           @RequestParam(required = false) String category,
                                                           HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        String queryString = request.getQueryString();

        ApiEvent event = new ApiEvent("GET", "/api/demo/products", 200, ip != null ? ip : "127.0.0.1");
        event.setQueryParams(queryString);
        event.setUserAgent(request.getHeader("User-Agent"));
        apiEventService.recordEvent(event);

        return ResponseEntity.ok(Map.of("status", "success", "results", 12, "query", search != null ? search : ""));
    }

    @GetMapping("/orders")
    public ResponseEntity<Map<String, Object>> getOrders(HttpServletRequest request) {
        String ip = request.getRemoteAddr();

        ApiEvent event = new ApiEvent("GET", "/api/demo/orders", 200, ip != null ? ip : "127.0.0.1");
        event.setUserAgent(request.getHeader("User-Agent"));
        apiEventService.recordEvent(event);

        return ResponseEntity.ok(Map.of("status", "success", "orders", 5));
    }
}
