package com.internhub.app.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "company_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 150)
    private String companyName;

    @Column(columnDefinition = "LONGTEXT")
    private String logoUrl;
    private String website;
    private String address;
    private String industry;
    private String scale; // e.g. "50-100 nhân viên", "500+ nhân viên"
    private Integer foundedYear;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private Boolean isVerified = true;
}
