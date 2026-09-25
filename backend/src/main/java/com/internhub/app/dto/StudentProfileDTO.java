package com.internhub.app.dto;

import com.internhub.app.model.Skill;
import com.internhub.app.model.StudentProfile;
import lombok.*;

import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfileDTO {
    private Long id;
    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String avatar;
    private String studentCode;
    private String university;
    private String major;
    private Double gpa;
    private Integer graduationYear;
    private String bio;
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    private String resumeUrl;
    private Set<String> skills;

    public static StudentProfileDTO fromEntity(StudentProfile sp) {
        return StudentProfileDTO.builder()
                .id(sp.getId())
                .userId(sp.getUser().getId())
                .username(sp.getUser().getUsername())
                .email(sp.getUser().getEmail())
                .fullName(sp.getUser().getFullName())
                .phone(sp.getUser().getPhone())
                .avatar(sp.getUser().getAvatar())
                .studentCode(sp.getStudentCode())
                .university(sp.getUniversity())
                .major(sp.getMajor())
                .gpa(sp.getGpa())
                .graduationYear(sp.getGraduationYear())
                .bio(sp.getBio())
                .githubUrl(sp.getGithubUrl())
                .linkedinUrl(sp.getLinkedinUrl())
                .portfolioUrl(sp.getPortfolioUrl())
                .resumeUrl(sp.getResumeUrl())
                .skills(sp.getSkills().stream().map(Skill::getName).collect(Collectors.toSet()))
                .build();
    }
}
