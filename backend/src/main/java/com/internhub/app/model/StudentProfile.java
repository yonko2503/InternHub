package com.internhub.app.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String studentCode;
    private String university;
    private String major;
    private Double gpa;
    private Integer graduationYear;
    
    @Column(columnDefinition = "TEXT")
    private String bio;

    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    @Column(columnDefinition = "LONGTEXT")
    private String resumeUrl; // Default CV URL

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "student_skills",
        joinColumns = @JoinColumn(name = "student_profile_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private Set<Skill> skills = new HashSet<>();
}
