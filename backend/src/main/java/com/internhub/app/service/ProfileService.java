package com.internhub.app.service;

import com.internhub.app.dto.CompanyProfileDTO;
import com.internhub.app.dto.StudentProfileDTO;
import com.internhub.app.model.*;
import com.internhub.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final StudentProfileRepository studentProfileRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public StudentProfileDTO getCurrentStudentProfile() {
        User user = authService.getCurrentUser();
        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElseGet(() -> studentProfileRepository.save(StudentProfile.builder().user(user).build()));
        return StudentProfileDTO.fromEntity(profile);
    }

    @Transactional(readOnly = true)
    public StudentProfileDTO getStudentProfileById(Long id) {
        StudentProfile profile = studentProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ sinh viên!"));
        return StudentProfileDTO.fromEntity(profile);
    }

    @Transactional
    public StudentProfileDTO updateStudentProfile(StudentProfileDTO request) {
        User user = authService.getCurrentUser();
        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElseGet(() -> StudentProfile.builder().user(user).build());

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAvatar() != null) user.setAvatar(request.getAvatar());
        userRepository.save(user);

        if (request.getStudentCode() != null) profile.setStudentCode(request.getStudentCode());
        if (request.getUniversity() != null) profile.setUniversity(request.getUniversity());
        if (request.getMajor() != null) profile.setMajor(request.getMajor());
        if (request.getGpa() != null) profile.setGpa(request.getGpa());
        if (request.getGraduationYear() != null) profile.setGraduationYear(request.getGraduationYear());
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getGithubUrl() != null) profile.setGithubUrl(request.getGithubUrl());
        if (request.getLinkedinUrl() != null) profile.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getPortfolioUrl() != null) profile.setPortfolioUrl(request.getPortfolioUrl());
        if (request.getResumeUrl() != null) profile.setResumeUrl(request.getResumeUrl());

        if (request.getSkills() != null) {
            Set<Skill> skills = new HashSet<>();
            for (String skillName : request.getSkills()) {
                if (skillName != null && !skillName.trim().isEmpty()) {
                    Skill skill = skillRepository.findByNameIgnoreCase(skillName.trim())
                            .orElseGet(() -> skillRepository.save(Skill.builder().name(skillName.trim()).category("Chung").build()));
                    skills.add(skill);
                }
            }
            profile.setSkills(skills);
        }

        StudentProfile saved = studentProfileRepository.save(profile);
        return StudentProfileDTO.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public CompanyProfileDTO getCurrentCompanyProfile() {
        User user = authService.getCurrentUser();
        CompanyProfile profile = companyProfileRepository.findByUser(user)
                .orElseGet(() -> companyProfileRepository.save(CompanyProfile.builder().user(user).companyName(user.getFullName()).build()));
        return CompanyProfileDTO.fromEntity(profile);
    }

    @Transactional(readOnly = true)
    public CompanyProfileDTO getCompanyProfileById(Long id) {
        CompanyProfile profile = companyProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin doanh nghiệp!"));
        return CompanyProfileDTO.fromEntity(profile);
    }

    @Transactional(readOnly = true)
    public List<CompanyProfileDTO> getAllCompanies() {
        return companyProfileRepository.findAll().stream()
                .map(CompanyProfileDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public CompanyProfileDTO updateCompanyProfile(CompanyProfileDTO request) {
        User user = authService.getCurrentUser();
        CompanyProfile profile = companyProfileRepository.findByUser(user)
                .orElseGet(() -> CompanyProfile.builder().user(user).companyName(user.getFullName()).build());

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        userRepository.save(user);

        if (request.getCompanyName() != null) profile.setCompanyName(request.getCompanyName());
        if (request.getLogoUrl() != null) profile.setLogoUrl(request.getLogoUrl());
        if (request.getWebsite() != null) profile.setWebsite(request.getWebsite());
        if (request.getAddress() != null) profile.setAddress(request.getAddress());
        if (request.getIndustry() != null) profile.setIndustry(request.getIndustry());
        if (request.getScale() != null) profile.setScale(request.getScale());
        if (request.getFoundedYear() != null) profile.setFoundedYear(request.getFoundedYear());
        if (request.getDescription() != null) profile.setDescription(request.getDescription());

        CompanyProfile saved = companyProfileRepository.save(profile);
        return CompanyProfileDTO.fromEntity(saved);
    }
}
