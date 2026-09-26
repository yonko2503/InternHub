package com.internhub.app.controller;

import com.internhub.app.dto.ApiResponse;
import com.internhub.app.dto.DashboardStatsResponse;
import com.internhub.app.dto.UserManagementDTO;
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

    @Operation(summary = "Lấy danh sách người dùng", description = "Danh sách đầy đủ tài khoản, vai trò và hồ sơ")
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserManagementDTO>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllUsers()));
    }

    @Operation(summary = "Cập nhật người dùng bởi Admin", description = "Admin chỉnh sửa thông tin tài khoản, vai trò, hồ sơ hoặc logo")
    @PutMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<UserManagementDTO>> updateUser(
            @PathVariable Long userId,
            @RequestBody java.util.Map<String, Object> req) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin người dùng thành công!", adminService.updateUserByAdmin(userId, req)));
    }

    @PatchMapping("/users/{userId}/toggle-status")
    public ResponseEntity<ApiResponse<User>> toggleUserStatus(@PathVariable Long userId) {
        User user = adminService.toggleUserStatus(userId);
        return ResponseEntity.ok(ApiResponse.success("Đã thay đổi trạng thái tài khoản!", user));
    }
}
