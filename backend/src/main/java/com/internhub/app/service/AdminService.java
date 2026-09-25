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
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));
        user.setIsActive(!user.getIsActive());
        return userRepository.save(user);
    }
}
