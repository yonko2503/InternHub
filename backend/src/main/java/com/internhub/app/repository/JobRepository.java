package com.internhub.app.repository;

import com.internhub.app.model.CompanyProfile;
import com.internhub.app.model.Job;
import com.internhub.app.model.JobStatus;
import com.internhub.app.model.JobType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByStatus(JobStatus status);
    List<Job> findByCompany(CompanyProfile company);
    List<Job> findByCompanyId(Long companyId);
    
    @Query("SELECT j FROM Job j WHERE j.status = :status AND " +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.company.companyName) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:jobType IS NULL OR j.jobType = :jobType) " +
           "ORDER BY j.createdAt DESC")
    List<Job> searchJobs(
        @Param("status") JobStatus status,
        @Param("keyword") String keyword,
        @Param("location") String location,
        @Param("jobType") JobType jobType
    );

    long countByStatus(JobStatus status);
}
