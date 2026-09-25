package com.internhub.app.controller;

import com.internhub.app.dto.ApiResponse;
import com.internhub.app.dto.JobRequest;
import com.internhub.app.dto.JobResponse;
import com.internhub.app.model.JobType;
import com.internhub.app.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobResponse>>> getAllJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) JobType jobType
    ) {
        List<JobResponse> jobs = jobService.getAllJobs(keyword, location, jobType);
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getAllJobsForAdmin() {
        List<JobResponse> jobs = jobService.getAllJobsForAdmin();
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable Long id) {
        JobResponse job = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.success(job));
    }

    @GetMapping("/company/my-jobs")
    @PreAuthorize("hasAuthority('ROLE_COMPANY')")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getMyCompanyJobs() {
        List<JobResponse> jobs = jobService.getMyCompanyJobs();
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getJobsByCompany(@PathVariable Long companyId) {
        List<JobResponse> jobs = jobService.getJobsByCompany(companyId);
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_COMPANY', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(@Valid @RequestBody JobRequest request) {
        JobResponse job = jobService.createJob(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng tin tuyển dụng thành công!", job));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_COMPANY', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(@PathVariable Long id, @Valid @RequestBody JobRequest request) {
        JobResponse job = jobService.updateJob(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật tin tuyển dụng thành công!", job));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_COMPANY', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa tin tuyển dụng thành công!", null));
    }
}
