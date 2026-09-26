package com.internhub.app.controller;

import com.internhub.app.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(name = "0. Health Check", description = "API kiểm tra trạng thái server")
public class HealthController {

    private final Instant startTime = Instant.now();

    @Operation(summary = "Kiểm tra server có hoạt động", description = "Trả về trạng thái OK nếu server đang chạy")
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        Map<String, Object> health = Map.of(
            "status", "UP",
            "timestamp", Instant.now().toString(),
            "uptime", java.time.Duration.between(startTime, Instant.now()).toSeconds() + "s"
        );
        return ResponseEntity.ok(ApiResponse.success("Server is running", health));
    }
}
