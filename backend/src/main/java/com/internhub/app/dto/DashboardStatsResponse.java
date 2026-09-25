package com.internhub.app.dto;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {
    private long totalStudents;
    private long totalCompanies;
    private long totalJobs;
    private long totalApplications;
    private long acceptedApplications;
    private long interviewingApplications;
    private long reviewingApplications;
    private Map<String, Long> applicationsByStatus;
    private Map<String, Long> jobsByType;
}
