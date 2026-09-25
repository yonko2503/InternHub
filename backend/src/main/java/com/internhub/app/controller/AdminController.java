package com.internhub.app.controller;

import com.internhub.app.dto.ApiResponse;
import com.internhub.app.dto.DashboardStatsResponse;
import com.internhub.app.model.User;
import com.internhub.app.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@RequiredArgsConstructor
@Tag(name = "4. Admin Moderation", description = "API Quản trị hệ thống: Thống kê số liệu, Kiểm duyệt tin và Quản lý người dùng")
public class AdminController {

    private final AdminService adminService;

    @Operation(summary = "Lấy số liệu thống kê Dashboard Admin", description = "Thống kê tổng số sinh viên, doanh nghiệp, tin tuyển dụng, lượt ứng tuyển")
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllUsers()));
    }

    @PatchMapping("/users/{userId}/toggle-status")
    public ResponseEntity<ApiResponse<User>> toggleUserStatus(@PathVariable Long userId) {
        User user = adminService.toggleUserStatus(userId);
        return ResponseEntity.ok(ApiResponse.success("Đã thay đổi trạng thái tài khoản!", user));
    }
}
