package com.internhub.app.dto;

import com.internhub.app.model.Role;
import com.internhub.app.model.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserManagementDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private Role role;
    private String phone;
    private String avatar;
    private Boolean isActive;
    private CompanyProfileDTO companyProfile;
    private StudentProfileDTO studentProfile;

    public static UserManagementDTO fromEntity(User user, CompanyProfileDTO companyProfile, StudentProfileDTO studentProfile) {
        return UserManagementDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .phone(user.getPhone())
                .avatar(user.getAvatar())
                .isActive(user.getIsActive())
                .companyProfile(companyProfile)
                .studentProfile(studentProfile)
                .build();
    }
}
