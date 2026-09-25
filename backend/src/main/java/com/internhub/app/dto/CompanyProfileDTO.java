package com.internhub.app.dto;

import com.internhub.app.model.CompanyProfile;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyProfileDTO {
    private Long id;
    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String companyName;
    private String logoUrl;
    private String website;
    private String address;
    private String industry;
    private String scale;
    private Integer foundedYear;
    private String description;
    private Boolean isVerified;

    public static CompanyProfileDTO fromEntity(CompanyProfile cp) {
        return CompanyProfileDTO.builder()
                .id(cp.getId())
                .userId(cp.getUser().getId())
                .username(cp.getUser().getUsername())
                .email(cp.getUser().getEmail())
                .fullName(cp.getUser().getFullName())
                .phone(cp.getUser().getPhone())
                .companyName(cp.getCompanyName())
                .logoUrl(cp.getLogoUrl())
                .website(cp.getWebsite())
                .address(cp.getAddress())
                .industry(cp.getIndustry())
                .scale(cp.getScale())
                .foundedYear(cp.getFoundedYear())
                .description(cp.getDescription())
                .isVerified(cp.getIsVerified())
                .build();
    }
}
