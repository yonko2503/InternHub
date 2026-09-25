package com.internhub.app.dto;

import com.internhub.app.model.Job;
import com.internhub.app.model.JobStatus;
import com.internhub.app.model.JobType;
import com.internhub.app.model.Skill;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponse {
    private Long id;
    private Long companyId;
    private String companyName;
    private String companyLogo;
    private String companyAddress;
    private String companyWebsite;
    private String title;
    private String description;
    private String requirements;
    private String benefits;
    private String location;
    private JobType jobType;
    private String salaryRange;
    private Integer slots;
    private LocalDate deadline;
    private JobStatus status;
    private Set<String> skills;
    private LocalDateTime createdAt;
    private Integer applicationsCount;

    public static JobResponse fromEntity(Job job, Integer applicationsCount) {
        return JobResponse.builder()
                .id(job.getId())
                .companyId(job.getCompany().getId())
                .companyName(job.getCompany().getCompanyName())
                .companyLogo(job.getCompany().getLogoUrl())
                .companyAddress(job.getCompany().getAddress())
                .companyWebsite(job.getCompany().getWebsite())
                .title(job.getTitle())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .benefits(job.getBenefits())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .salaryRange(job.getSalaryRange())
                .slots(job.getSlots())
                .deadline(job.getDeadline())
                .status(job.getStatus())
                .skills(job.getRequiredSkills().stream().map(Skill::getName).collect(Collectors.toSet()))
                .createdAt(job.getCreatedAt())
                .applicationsCount(applicationsCount)
                .build();
    }
}
