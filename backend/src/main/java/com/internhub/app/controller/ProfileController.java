package com.internhub.app.controller;

import com.internhub.app.dto.ApiResponse;
import com.internhub.app.dto.CompanyProfileDTO;
import com.internhub.app.dto.StudentProfileDTO;
import com.internhub.app.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // Student profile endpoints
    @GetMapping("/students/me")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> getMyStudentProfile() {
        return ResponseEntity.ok(ApiResponse.success(profileService.getCurrentStudentProfile()));
    }

    @PutMapping("/students/me")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> updateStudentProfile(@RequestBody StudentProfileDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật hồ sơ sinh viên thành công!", profileService.updateStudentProfile(dto)));
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> getStudentProfileById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(profileService.getStudentProfileById(id)));
    }

    // Company profile endpoints
    @GetMapping("/companies/me")
    @PreAuthorize("hasAuthority('ROLE_COMPANY')")
    public ResponseEntity<ApiResponse<CompanyProfileDTO>> getMyCompanyProfile() {
        return ResponseEntity.ok(ApiResponse.success(profileService.getCurrentCompanyProfile()));
    }

    @PutMapping("/companies/me")
    @PreAuthorize("hasAuthority('ROLE_COMPANY')")
    public ResponseEntity<ApiResponse<CompanyProfileDTO>> updateCompanyProfile(@RequestBody CompanyProfileDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin doanh nghiệp thành công!", profileService.updateCompanyProfile(dto)));
    }

    @GetMapping("/companies")
    public ResponseEntity<ApiResponse<List<CompanyProfileDTO>>> getAllCompanies() {
        return ResponseEntity.ok(ApiResponse.success(profileService.getAllCompanies()));
    }

    @GetMapping("/companies/{id}")
    public ResponseEntity<ApiResponse<CompanyProfileDTO>> getCompanyProfileById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(profileService.getCompanyProfileById(id)));
    }
}
