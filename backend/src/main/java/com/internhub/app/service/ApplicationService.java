package com.internhub.app.service;

import com.internhub.app.dto.ApplicationRequest;
import com.internhub.app.dto.ApplicationResponse;
import com.internhub.app.dto.ApplicationStatusUpdateRequest;
import com.internhub.app.model.*;
import com.internhub.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final NotificationRepository notificationRepository;
    private final AuthService authService;

    @Transactional
    public ApplicationResponse applyForJob(ApplicationRequest request) {
        User user = authService.getCurrentUser();
        StudentProfile student = studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Chỉ có tài khoản Sinh viên mới có thể nộp đơn ứng tuyển!"));

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Tin tuyển dụng không tồn tại!"));

        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new RuntimeException("Tin tuyển dụng này hiện đã đóng hoặc chưa được duyệt!");
        }

        if (applicationRepository.existsByJobAndStudent(job, student)) {
            throw new RuntimeException("Bạn đã nộp đơn ứng tuyển cho vị trí này rồi!");
        }

        String resumeUrl = request.getResumeUrl();
        if (resumeUrl == null || resumeUrl.trim().isEmpty()) {
            resumeUrl = student.getResumeUrl();
        }

        Application application = Application.builder()
                .job(job)
                .student(student)
                .resumeUrl(resumeUrl)
                .coverLetter(request.getCoverLetter())
                .status(ApplicationStatus.APPLIED)
                .build();

        Application saved = applicationRepository.save(application);

        // Notify Company
        notificationRepository.save(Notification.builder()
                .user(job.getCompany().getUser())
                .title("Ứng viên mới!")
                .message("Sinh viên " + user.getFullName() + " vừa nộp đơn ứng tuyển cho vị trí: " + job.getTitle())
                .link("/company/applications")
                .isRead(false)
                .build());

        return ApplicationResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getMyApplications() {
        User user = authService.getCurrentUser();
        StudentProfile student = studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ sinh viên!"));

        return applicationRepository.findByStudent(student).stream()
                .map(ApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getCompanyApplications() {
        User user = authService.getCurrentUser();
        CompanyProfile company = companyProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ doanh nghiệp!"));

        return applicationRepository.findByJob_Company_Id(company.getId()).stream()
                .map(ApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsByJob(Long jobId) {
        User user = authService.getCurrentUser();
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tuyển dụng!"));

        if (user.getRole() != Role.ROLE_ADMIN && !job.getCompany().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bạn không có quyền xem danh sách ứng viên của tin này!");
        }

        return applicationRepository.findByJob(job).stream()
                .map(ApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(Long applicationId, ApplicationStatusUpdateRequest request) {
        User user = authService.getCurrentUser();
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển!"));

        Job job = app.getJob();
        if (user.getRole() != Role.ROLE_ADMIN && !job.getCompany().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bạn không có quyền cập nhật trạng thái đơn ứng tuyển này!");
        }

        app.setStatus(request.getStatus());
        if (request.getEmployerFeedback() != null) {
            app.setEmployerFeedback(request.getEmployerFeedback());
        }
        if (request.getInterviewTime() != null) {
            app.setInterviewTime(request.getInterviewTime());
        }
        if (request.getInterviewLocation() != null) {
            app.setInterviewLocation(request.getInterviewLocation());
        }
        if (request.getInterviewNotes() != null) {
            app.setInterviewNotes(request.getInterviewNotes());
        }

        Application updated = applicationRepository.save(app);

        // Notify Student about status change
        String statusText = switch (request.getStatus()) {
            case REVIEWING -> "Hồ sơ của bạn đang được xem xét.";
            case INTERVIEW -> "Bạn nhận được lời mời phỏng vấn!";
            case ACCEPTED -> "Chúc mừng! Bạn đã trúng tuyển thực tập!";
            case REJECTED -> "Rất tiếc, hồ sơ ứng tuyển của bạn chưa phù hợp lần này.";
            default -> "Trạng thái đơn ứng tuyển đã được cập nhật.";
        };

        notificationRepository.save(Notification.builder()
                .user(app.getStudent().getUser())
                .title("Cập nhật đơn ứng tuyển - " + job.getTitle())
                .message("Doanh nghiệp " + job.getCompany().getCompanyName() + ": " + statusText)
                .link("/student/applications")
                .isRead(false)
                .build());

        return ApplicationResponse.fromEntity(updated);
    }
}
