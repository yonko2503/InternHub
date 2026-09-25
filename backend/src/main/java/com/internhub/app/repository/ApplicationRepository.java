package com.internhub.app.repository;

import com.internhub.app.model.Application;
import com.internhub.app.model.ApplicationStatus;
import com.internhub.app.model.Job;
import com.internhub.app.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudent(StudentProfile student);
    List<Application> findByStudentId(Long studentId);
    List<Application> findByJob(Job job);
    List<Application> findByJobId(Long jobId);
    List<Application> findByJob_Company_Id(Long companyId);
    
    Optional<Application> findByJobAndStudent(Job job, StudentProfile student);
    Boolean existsByJobAndStudent(Job job, StudentProfile student);
    Boolean existsByJobIdAndStudentId(Long jobId, Long studentId);

    long countByStatus(ApplicationStatus status);
}
