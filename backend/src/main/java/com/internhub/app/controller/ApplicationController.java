package com.internhub.app.controller;

import com.internhub.app.dto.ApiResponse;
import com.internhub.app.dto.ApplicationRequest;
import com.internhub.app.dto.ApplicationResponse;
import com.internhub.app.dto.ApplicationStatusUpdateRequest;
import com.internhub.app.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> apply(@Valid @RequestBody ApplicationRequest request) {
        ApplicationResponse response = applicationService.applyForJob(request);
        return ResponseEntity.ok(ApiResponse.success("Nộp đơn ứng tuyển thành công!", response));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getMyApplications() {
        List<ApplicationResponse> list = applicationService.getMyApplications();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/company")
    @PreAuthorize("hasAuthority('ROLE_COMPANY')")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getCompanyApplications() {
        List<ApplicationResponse> list = applicationService.getCompanyApplications();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAnyAuthority('ROLE_COMPANY', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getApplicationsByJob(@PathVariable Long jobId) {
        List<ApplicationResponse> list = applicationService.getApplicationsByJob(jobId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_COMPANY', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateRequest request
    ) {
        ApplicationResponse response = applicationService.updateApplicationStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái ứng tuyển thành công!", response));
    }
}
