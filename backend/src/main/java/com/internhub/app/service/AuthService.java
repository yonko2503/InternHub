package com.internhub.app.service;

import com.internhub.app.dto.AuthRequest;
import com.internhub.app.dto.AuthResponse;
import com.internhub.app.dto.RegisterRequest;
import com.internhub.app.model.CompanyProfile;
import com.internhub.app.model.Role;
import com.internhub.app.model.StudentProfile;
import com.internhub.app.model.User;
import com.internhub.app.repository.CompanyProfileRepository;
import com.internhub.app.repository.StudentProfileRepository;
import com.internhub.app.repository.UserRepository;
import com.internhub.app.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsernameOrEmail(request.getUsername(), request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long profileId = null;
        if (user.getRole() == Role.ROLE_STUDENT) {
            profileId = studentProfileRepository.findByUser(user).map(StudentProfile::getId).orElse(null);
        } else if (user.getRole() == Role.ROLE_COMPANY) {
            profileId = companyProfileRepository.findByUser(user).map(CompanyProfile::getId).orElse(null);
        }

        return AuthResponse.builder()
                .accessToken(jwt)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .profileId(profileId)
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(request.getRole())
                .phone(request.getPhone())
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);
        Long profileId = null;

        if (savedUser.getRole() == Role.ROLE_STUDENT) {
            StudentProfile profile = StudentProfile.builder()
                    .user(savedUser)
                    .studentCode(request.getStudentCode())
                    .university(request.getUniversity() != null ? request.getUniversity() : "Đại học Công nghệ - ĐHQGHN (UET)")
                    .major(request.getMajor() != null ? request.getMajor() : "Công nghệ Thông tin")
                    .build();
            StudentProfile savedProfile = studentProfileRepository.save(profile);
            profileId = savedProfile.getId();
        } else if (savedUser.getRole() == Role.ROLE_COMPANY) {
            CompanyProfile profile = CompanyProfile.builder()
                    .user(savedUser)
                    .companyName(request.getCompanyName() != null ? request.getCompanyName() : savedUser.getFullName())
                    .address(request.getAddress())
                    .website(request.getWebsite())
                    .industry(request.getIndustry() != null ? request.getIndustry() : "Công nghệ thông tin")
                    .isVerified(true)
                    .build();
            CompanyProfile savedProfile = companyProfileRepository.save(profile);
            profileId = savedProfile.getId();
        }

        String jwt = tokenProvider.generateTokenFromUsername(savedUser.getUsername(), savedUser.getId(), savedUser.getRole().name());

        return AuthResponse.builder()
                .accessToken(jwt)
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .role(savedUser.getRole())
                .profileId(profileId)
                .build();
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("Chưa đăng nhập!");
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng hiện tại!"));
    }
}
