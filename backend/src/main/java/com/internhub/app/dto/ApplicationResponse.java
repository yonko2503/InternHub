package com.internhub.app.dto;

import com.internhub.app.model.Application;
import com.internhub.app.model.ApplicationStatus;
import com.internhub.app.model.Skill;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String companyLogo;
    private Long studentProfileId;
    private Long studentUserId;
    private String studentName;
    private String studentEmail;
    private String studentPhone;
    private String studentUniversity;
    private String studentMajor;
    private Double studentGpa;
    private Set<String> studentSkills;
    private String resumeUrl;
    private String coverLetter;
    private ApplicationStatus status;
    private String employerFeedback;
    private LocalDateTime interviewTime;
    private String interviewLocation;
    private String interviewNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ApplicationResponse fromEntity(Application app) {
        return ApplicationResponse.builder()
                .id(app.getId())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .companyName(app.getJob().getCompany().getCompanyName())
                .companyLogo(app.getJob().getCompany().getLogoUrl())
                .studentProfileId(app.getStudent().getId())
                .studentUserId(app.getStudent().getUser().getId())
                .studentName(app.getStudent().getUser().getFullName())
                .studentEmail(app.getStudent().getUser().getEmail())
                .studentPhone(app.getStudent().getUser().getPhone())
                .studentUniversity(app.getStudent().getUniversity())
                .studentMajor(app.getStudent().getMajor())
                .studentGpa(app.getStudent().getGpa())
                .studentSkills(app.getStudent().getSkills().stream().map(Skill::getName).collect(Collectors.toSet()))
                .resumeUrl(app.getResumeUrl())
                .coverLetter(app.getCoverLetter())
                .status(app.getStatus())
                .employerFeedback(app.getEmployerFeedback())
                .interviewTime(app.getInterviewTime())
                .interviewLocation(app.getInterviewLocation())
                .interviewNotes(app.getInterviewNotes())
                .createdAt(app.getCreatedAt())
                .updatedAt(app.getUpdatedAt())
                .build();
    }
}
