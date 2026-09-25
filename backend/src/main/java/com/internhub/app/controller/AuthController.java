package com.internhub.app.controller;

import com.internhub.app.dto.ApiResponse;
import com.internhub.app.dto.AuthRequest;
import com.internhub.app.dto.AuthResponse;
import com.internhub.app.dto.RegisterRequest;
import com.internhub.app.model.User;
import com.internhub.app.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "1. Authentication", description = "API Xác thực: Đăng nhập, Đăng ký và Lấy thông tin tài khoản hiện tại")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Đăng nhập hệ thống", description = "Đăng nhập với username/email và mật khẩu để nhận JWT Access Token")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công!", response));
    }

    @Operation(summary = "Đăng ký tài khoản mới", description = "Đăng ký tài khoản Sinh viên (ROLE_STUDENT) hoặc Doanh nghiệp (ROLE_COMPANY)")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng ký tài khoản thành công!", response));
    }

    @Operation(summary = "Lấy thông tin tài khoản hiện tại", description = "Trả về thông tin chi tiết của người dùng đang đăng nhập dựa trên JWT Token")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(user));
    }
}
