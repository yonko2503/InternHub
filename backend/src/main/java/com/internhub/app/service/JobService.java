package com.internhub.app.service;

import com.internhub.app.dto.JobRequest;
import com.internhub.app.dto.JobResponse;
import com.internhub.app.model.*;
import com.internhub.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final SkillRepository skillRepository;
    private final ApplicationRepository applicationRepository;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public List<JobResponse> getAllJobs(String keyword, String location, JobType jobType) {
        List<Job> jobs;
        if (keyword != null || location != null || jobType != null) {
            jobs = jobRepository.searchJobs(JobStatus.ACTIVE, keyword, location, jobType);
        } else {
            jobs = jobRepository.findByStatus(JobStatus.ACTIVE);
        }

        return jobs.stream().map(job -> {
            int appCount = applicationRepository.findByJob(job).size();
            return JobResponse.fromEntity(job, appCount);
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getAllJobsForAdmin() {
        return jobRepository.findAll().stream().map(job -> {
            int appCount = applicationRepository.findByJob(job).size();
            return JobResponse.fromEntity(job, appCount);
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tuyển dụng!"));
        int appCount = applicationRepository.findByJob(job).size();
        return JobResponse.fromEntity(job, appCount);
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getJobsByCompany(Long companyId) {
        return jobRepository.findByCompanyId(companyId).stream().map(job -> {
            int appCount = applicationRepository.findByJob(job).size();
            return JobResponse.fromEntity(job, appCount);
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getMyCompanyJobs() {
        User user = authService.getCurrentUser();
        CompanyProfile company = companyProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Tài khoản không phải là doanh nghiệp!"));

        return jobRepository.findByCompany(company).stream().map(job -> {
            int appCount = applicationRepository.findByJob(job).size();
            return JobResponse.fromEntity(job, appCount);
        }).collect(Collectors.toList());
    }

    @Transactional
    public JobResponse createJob(JobRequest request) {
        User user = authService.getCurrentUser();
        CompanyProfile company = companyProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Chỉ có doanh nghiệp mới có quyền đăng tin!"));

        Set<Skill> skills = resolveSkills(request.getSkills());

        Job job = Job.builder()
                .company(company)
                .title(request.getTitle())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .benefits(request.getBenefits())
                .location(request.getLocation() != null ? request.getLocation() : company.getAddress())
                .jobType(request.getJobType())
                .salaryRange(request.getSalaryRange() != null ? request.getSalaryRange() : "Thỏa thuận")
                .slots(request.getSlots() != null ? request.getSlots() : 2)
                .deadline(request.getDeadline())
                .status(request.getStatus() != null ? request.getStatus() : JobStatus.ACTIVE)
                .requiredSkills(skills)
                .build();

        Job savedJob = jobRepository.save(job);
        return JobResponse.fromEntity(savedJob, 0);
    }

    @Transactional
    public JobResponse updateJob(Long id, JobRequest request) {
        User user = authService.getCurrentUser();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tuyển dụng!"));

        if (user.getRole() != Role.ROLE_ADMIN && !job.getCompany().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa tin tuyển dụng này!");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setBenefits(request.getBenefits());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setSalaryRange(request.getSalaryRange());
        if (request.getSlots() != null) job.setSlots(request.getSlots());
        if (request.getDeadline() != null) job.setDeadline(request.getDeadline());
        if (request.getStatus() != null) job.setStatus(request.getStatus());

        if (request.getSkills() != null) {
            job.setRequiredSkills(resolveSkills(request.getSkills()));
        }

        Job updatedJob = jobRepository.save(job);
        int appCount = applicationRepository.findByJob(updatedJob).size();
        return JobResponse.fromEntity(updatedJob, appCount);
    }

    @Transactional
    public void deleteJob(Long id) {
        User user = authService.getCurrentUser();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tuyển dụng!"));

        if (user.getRole() != Role.ROLE_ADMIN && !job.getCompany().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bạn không có quyền xóa tin tuyển dụng này!");
        }

        // Cascade delete applications
        List<Application> applications = applicationRepository.findByJob(job);
        applicationRepository.deleteAll(applications);

        jobRepository.delete(job);
    }

    private Set<Skill> resolveSkills(Set<String> skillNames) {
        Set<Skill> skills = new HashSet<>();
        if (skillNames == null) return skills;

        for (String name : skillNames) {
            if (name != null && !name.trim().isEmpty()) {
                Skill skill = skillRepository.findByNameIgnoreCase(name.trim())
                        .orElseGet(() -> skillRepository.save(Skill.builder().name(name.trim()).category("Chung").build()));
                skills.add(skill);
            }
        }
        return skills;
    }
}
