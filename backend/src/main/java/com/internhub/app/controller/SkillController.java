package com.internhub.app.controller;

import com.internhub.app.dto.ApiResponse;
import com.internhub.app.model.Skill;
import com.internhub.app.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillRepository skillRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Skill>>> getAllSkills() {
        return ResponseEntity.ok(ApiResponse.success(skillRepository.findAll()));
    }
}
