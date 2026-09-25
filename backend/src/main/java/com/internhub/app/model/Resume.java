package com.internhub.app.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile student;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false)
    private String fileUrl;

    @Builder.Default
    private Boolean isDefault = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime uploadedAt;
}
