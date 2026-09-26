package com.internhub.app.service;

import com.internhub.app.dto.DashboardStatsResponse;
import com.internhub.app.model.*;
import com.internhub.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final StudentProfileRepository studentProfileRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long students = userRepository.countByRole(Role.ROLE_STUDENT);
        long companies = userRepository.countByRole(Role.ROLE_COMPANY);
        long jobs = jobRepository.count();
        long apps = applicationRepository.count();

        long accepted = applicationRepository.countByStatus(ApplicationStatus.ACCEPTED);
        long interviewing = applicationRepository.countByStatus(ApplicationStatus.INTERVIEW);
        long reviewing = applicationRepository.countByStatus(ApplicationStatus.REVIEWING);
        long applied = applicationRepository.countByStatus(ApplicationStatus.APPLIED);
        long rejected = applicationRepository.countByStatus(ApplicationStatus.REJECTED);

        Map<String, Long> appStatusMap = new HashMap<>();
        appStatusMap.put("APPLIED", applied);
        appStatusMap.put("REVIEWING", reviewing);
        appStatusMap.put("INTERVIEW", interviewing);
        appStatusMap.put("ACCEPTED", accepted);
        appStatusMap.put("REJECTED", rejected);

        Map<String, Long> jobTypeMap = new HashMap<>();
        for (JobType type : JobType.values()) {
            jobTypeMap.put(type.name(), 0L);
        }
        for (Job j : jobRepository.findAll()) {
            jobTypeMap.put(j.getJobType().name(), jobTypeMap.getOrDefault(j.getJobType().name(), 0L) + 1);
        }

        return DashboardStatsResponse.builder()
                .totalStudents(students)
                .totalCompanies(companies)
                .totalJobs(jobs)
                .totalApplications(apps)
                .acceptedApplications(accepted)
                .interviewingApplications(interviewing)
                .reviewingApplications(reviewing)
                .applicationsByStatus(appStatusMap)
                .jobsByType(jobTypeMap)
                .build();
    }

    @Transactional(readOnly = true)
    public List<com.internhub.app.dto.UserManagementDTO> getAllUsers() {
        return userRepository.findAll().stream().map(u -> {
            com.internhub.app.dto.CompanyProfileDTO compDto = companyProfileRepository.findByUser(u)
                    .map(com.internhub.app.dto.CompanyProfileDTO::fromEntity).orElse(null);
            com.internhub.app.dto.StudentProfileDTO studDto = studentProfileRepository.findByUser(u)
                    .map(com.internhub.app.dto.StudentProfileDTO::fromEntity).orElse(null);
            return com.internhub.app.dto.UserManagementDTO.fromEntity(u, compDto, studDto);
        }).toList();
    }

    @Transactional
    public com.internhub.app.dto.UserManagementDTO updateUserByAdmin(Long userId, Map<String, Object> req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        if (req.containsKey("fullName") && req.get("fullName") != null) user.setFullName((String) req.get("fullName"));
        if (req.containsKey("email") && req.get("email") != null) user.setEmail((String) req.get("email"));
        if (req.containsKey("phone") && req.get("phone") != null) user.setPhone((String) req.get("phone"));
        if (req.containsKey("avatar") && req.get("avatar") != null) user.setAvatar((String) req.get("avatar"));
        if (req.containsKey("isActive") && req.get("isActive") != null) user.setIsActive((Boolean) req.get("isActive"));
        if (req.containsKey("role") && req.get("role") != null) {
            try {
                user.setRole(Role.valueOf((String) req.get("role")));
            } catch (Exception ignored) {}
        }
        User savedUser = userRepository.save(user);

        if (user.getRole() == Role.ROLE_COMPANY) {
            CompanyProfile comp = companyProfileRepository.findByUser(user)
                    .orElseGet(() -> CompanyProfile.builder().user(user).companyName(user.getFullName()).build());
            if (req.containsKey("companyName") && req.get("companyName") != null) comp.setCompanyName((String) req.get("companyName"));
            if (req.containsKey("avatar") && req.get("avatar") != null) comp.setLogoUrl((String) req.get("avatar"));
            if (req.containsKey("logoUrl") && req.get("logoUrl") != null) comp.setLogoUrl((String) req.get("logoUrl"));
            if (req.containsKey("address") && req.get("address") != null) comp.setAddress((String) req.get("address"));
            if (req.containsKey("website") && req.get("website") != null) comp.setWebsite((String) req.get("website"));
            if (req.containsKey("industry") && req.get("industry") != null) comp.setIndustry((String) req.get("industry"));
            if (req.containsKey("scale") && req.get("scale") != null) comp.setScale((String) req.get("scale"));
            if (req.containsKey("description") && req.get("description") != null) comp.setDescription((String) req.get("description"));
            companyProfileRepository.save(comp);
        } else if (user.getRole() == Role.ROLE_STUDENT) {
            StudentProfile stud = studentProfileRepository.findByUser(user)
                    .orElseGet(() -> StudentProfile.builder().user(user).build());
            if (req.containsKey("studentCode") && req.get("studentCode") != null) stud.setStudentCode((String) req.get("studentCode"));
            if (req.containsKey("university") && req.get("university") != null) stud.setUniversity((String) req.get("university"));
            if (req.containsKey("major") && req.get("major") != null) stud.setMajor((String) req.get("major"));
            studentProfileRepository.save(stud);
        }

        com.internhub.app.dto.CompanyProfileDTO compDto = companyProfileRepository.findByUser(savedUser)
                .map(com.internhub.app.dto.CompanyProfileDTO::fromEntity).orElse(null);
        com.internhub.app.dto.StudentProfileDTO studDto = studentProfileRepository.findByUser(savedUser)
                .map(com.internhub.app.dto.StudentProfileDTO::fromEntity).orElse(null);
        return com.internhub.app.dto.UserManagementDTO.fromEntity(savedUser, compDto, studDto);
    }

    @Transactional
    public User toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));
        user.setIsActive(!user.getIsActive());
        return userRepository.save(user);
    }
}
