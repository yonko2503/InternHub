package com.internhub.app.repository;

import com.internhub.app.model.Resume;
import com.internhub.app.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByStudent(StudentProfile student);
    List<Resume> findByStudentId(Long studentId);
}
