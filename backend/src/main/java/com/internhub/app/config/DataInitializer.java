package com.internhub.app.config;

import com.internhub.app.model.*;
import com.internhub.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final SkillRepository skillRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Seed Skills
        List<String> skillNames = List.of(
                "Java", "Spring Boot", "ReactJS", "TypeScript", "JavaScript",
                "MySQL", "PostgreSQL", "Docker", "Python", "NodeJS",
                "Git", "REST API", "TailwindCSS", "HTML/CSS", "Figma",
                "Kubernetes", "AWS", "Machine Learning", "Microservices"
        );

        for (String name : skillNames) {
            skillRepository.save(Skill.builder().name(name).category("Tech").build());
        }

        Skill javaSkill = skillRepository.findByNameIgnoreCase("Java").orElse(null);
        Skill springSkill = skillRepository.findByNameIgnoreCase("Spring Boot").orElse(null);
        Skill reactSkill = skillRepository.findByNameIgnoreCase("ReactJS").orElse(null);
        Skill mysqlSkill = skillRepository.findByNameIgnoreCase("MySQL").orElse(null);
        Skill dockerSkill = skillRepository.findByNameIgnoreCase("Docker").orElse(null);
        Skill pythonSkill = skillRepository.findByNameIgnoreCase("Python").orElse(null);
        Skill figmaSkill = skillRepository.findByNameIgnoreCase("Figma").orElse(null);

        // 2. Admin User
        userRepository.save(User.builder()
                .username("admin")
                .email("admin@internhub.edu.vn")
                .password(passwordEncoder.encode("admin123"))
                .fullName("Quản Trị Viên InternHub - UET")
                .role(Role.ROLE_ADMIN)
                .phone("0988888888")
                .avatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80")
                .isActive(true)
                .build());

        // 3. Companies
        User fptUser = userRepository.save(User.builder()
                .username("fpt_software")
                .email("recruitment@fpt-software.com")
                .password(passwordEncoder.encode("123456"))
                .fullName("FPT Software Tuyển Dụng")
                .role(Role.ROLE_COMPANY)
                .phone("02473007300")
                .avatar("/logos/fpt.svg")
                .isActive(true)
                .build());

        CompanyProfile fptProfile = companyProfileRepository.save(CompanyProfile.builder()
                .user(fptUser)
                .companyName("FPT Software")
                .logoUrl("/logos/fpt.svg")
                .website("https://fpt-software.com")
                .address("Tòa nhà FPT, Phố Duy Tân, Cầu Giấy, Hà Nội")
                .industry("Công nghệ phần mềm & Chuyển đổi số")
                .scale("10,000+ nhân viên")
                .foundedYear(1999)
                .description("FPT Software là tập đoàn công nghệ hàng đầu Việt Nam và khu vực, chuyên cung cấp giải pháp chuyển đổi số toàn diện cho khách hàng toàn cầu.")
                .isVerified(true)
                .build());

        User viettelUser = userRepository.save(User.builder()
                .username("viettel_solutions")
                .email("hr@viettelsolutions.vn")
                .password(passwordEncoder.encode("123456"))
                .fullName("Viettel Enterprise Solutions")
                .role(Role.ROLE_COMPANY)
                .phone("02462776688")
                .avatar("/logos/viettel.svg")
                .isActive(true)
                .build());

        CompanyProfile viettelProfile = companyProfileRepository.save(CompanyProfile.builder()
                .user(viettelUser)
                .companyName("Tổng Công ty Giải pháp Doanh nghiệp Viettel")
                .logoUrl("/logos/viettel.svg")
                .website("https://viettelsolutions.vn")
                .address("Số 1 Trần Hữu Dực, Nam Từ Liêm, Hà Nội")
                .industry("Viễn thông & Giải pháp CNTT")
                .scale("5,000+ nhân viên")
                .foundedYear(2018)
                .description("Viettel Solutions đi đầu trong xây dựng chính phủ số, kinh tế số và xã hội số tại Việt Nam.")
                .isVerified(true)
                .build());

        User techcorpUser = userRepository.save(User.builder()
                .username("techcorp")
                .email("contact@techcorp.vn")
                .password(passwordEncoder.encode("123456"))
                .fullName("TechCorp Innovation Lab")
                .role(Role.ROLE_COMPANY)
                .phone("0912345678")
                .avatar("/logos/techcorp.svg")
                .isActive(true)
                .build());

        CompanyProfile techcorpProfile = companyProfileRepository.save(CompanyProfile.builder()
                .user(techcorpUser)
                .companyName("TechCorp Innovation Lab")
                .logoUrl("/logos/techcorp.svg")
                .website("https://techcorp.vn")
                .address("Tầng 8, Tòa nhà HITC, Xuân Thủy, Cầu Giấy, Hà Nội")
                .industry("FinTech & AI Platforms")
                .scale("100-250 nhân viên")
                .foundedYear(2021)
                .description("TechCorp chuyên phát triển các sản phẩm tài chính thế hệ mới và nền tảng ứng dụng trí tuệ nhân tạo.")
                .isVerified(true)
                .build());

        // 4. Students
        User studentUser1 = userRepository.save(User.builder()
                .username("student_uet")
                .email("21020001@vnu.edu.vn")
                .password(passwordEncoder.encode("123456"))
                .fullName("Nguyễn Văn An")
                .role(Role.ROLE_STUDENT)
                .phone("0912345678")
                .avatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80")
                .isActive(true)
                .build());

        Set<Skill> student1Skills = new HashSet<>();
        if (javaSkill != null) student1Skills.add(javaSkill);
        if (springSkill != null) student1Skills.add(springSkill);
        if (reactSkill != null) student1Skills.add(reactSkill);
        if (mysqlSkill != null) student1Skills.add(mysqlSkill);

        StudentProfile student1Profile = studentProfileRepository.save(StudentProfile.builder()
                .user(studentUser1)
                .studentCode("21020001")
                .university("Đại học Công nghệ - ĐHQGHN (UET)")
                .major("Công nghệ Thông tin (Chất lượng cao)")
                .gpa(3.68)
                .graduationYear(2025)
                .bio("Sinh viên năm 4 đam mê lập trình Backend Java/Spring Boot và hệ thống phân tán. Đã có kinh nghiệm làm các dự án microservices và RESTful API.")
                .githubUrl("https://github.com/nguyenvanan-uet")
                .linkedinUrl("https://linkedin.com/in/nguyenvanan-uet")
                .portfolioUrl("https://annguyen.dev")
                .resumeUrl("https://internhub.uet.edu.vn/cv/sample-cv-annguyen.pdf")
                .skills(student1Skills)
                .build());

        User studentUser2 = userRepository.save(User.builder()
                .username("student2")
                .email("22020555@vnu.edu.vn")
                .password(passwordEncoder.encode("123456"))
                .fullName("Trần Thị Mai Linh")
                .role(Role.ROLE_STUDENT)
                .phone("0987654321")
                .avatar("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80")
                .isActive(true)
                .build());

        Set<Skill> student2Skills = new HashSet<>();
        if (reactSkill != null) student2Skills.add(reactSkill);
        if (figmaSkill != null) student2Skills.add(figmaSkill);

        StudentProfile student2Profile = studentProfileRepository.save(StudentProfile.builder()
                .user(studentUser2)
                .studentCode("22020555")
                .university("Đại học Công nghệ - ĐHQGHN (UET)")
                .major("Khoa học Máy tính")
                .gpa(3.82)
                .graduationYear(2026)
                .bio("Sinh viên năm 3 yêu thích phát triển giao diện người dùng hiện đại và thiết kế trải nghiệm người dùng tương tác.")
                .githubUrl("https://github.com/mailinh-tran")
                .linkedinUrl("https://linkedin.com/in/mailinh-tran")
                .resumeUrl("https://internhub.uet.edu.vn/cv/sample-cv-mailinh.pdf")
                .skills(student2Skills)
                .build());

        // 5. Jobs
        Set<Skill> job1Skills = new HashSet<>();
        if (javaSkill != null) job1Skills.add(javaSkill);
        if (springSkill != null) job1Skills.add(springSkill);
        if (mysqlSkill != null) job1Skills.add(mysqlSkill);

        Job job1 = jobRepository.save(Job.builder()
                .company(fptProfile)
                .title("Thực tập sinh Backend Java (Spring Boot) - Kèm cặp 1:1")
                .description("Tham gia phát triển hệ thống quản lý dữ liệu lớn cho đối tác Nhật Bản & Singapore. Được Mentor Senior 1:1 hướng dẫn trực tiếp quy trình chuẩn Agile/Scrum.")
                .requirements("• Sinh viên năm 3, 4 hoặc mới tốt nghiệp chuyên ngành CNTT, KHMT.\n• Nắm chắc OOP, Java Core, kiến trúc MVC.\n• Biết sử dụng Spring Boot, JPA/Hibernate, MySQL.\n• Có tinh thần học hỏi cao, cam kết thực tập tối thiểu 3 tháng.")
                .benefits("• Trợ cấp thực tập: 6.000.000 - 8.000.000 VNĐ / tháng.\n• Hỗ trợ dấu mộc và số liệu làm báo cáo Thực tập tốt nghiệp/Thực hành doanh nghiệp.\n• Cơ hội trở thành nhân viên chính thức ngay sau khi kết thúc kỳ thực tập.\n• Tham gia teambuilding, trà chiều, sự kiện thể thao công ty.")
                .location("Hà Nội (Tòa FPT Cầu Giấy)")
                .jobType(JobType.INTERNSHIP)
                .salaryRange("6.000.000 - 8.000.000 VNĐ / tháng")
                .slots(5)
                .deadline(LocalDate.now().plusMonths(2))
                .status(JobStatus.ACTIVE)
                .requiredSkills(job1Skills)
                .build());

        Set<Skill> job2Skills = new HashSet<>();
        if (reactSkill != null) job2Skills.add(reactSkill);
        if (figmaSkill != null) job2Skills.add(figmaSkill);

        Job job2 = jobRepository.save(Job.builder()
                .company(techcorpProfile)
                .title("Frontend ReactJS Developer Intern - Next-Gen FinTech")
                .description("Xây dựng dashboard và giao diện ứng dụng quản lý tài chính thông minh cho người dùng Đông Nam Á.")
                .requirements("• Sử dụng thành thạo HTML5, CSS3, JavaScript/TypeScript.\n• Đã làm quen hoặc làm đồ án với ReactJS, TailwindCSS hoặc Material UI.\n• Chú trọng trải nghiệm người dùng và giao diện mượt mà.")
                .benefits("• Trợ cấp: 5.000.000 - 7.500.000 VNĐ / tháng.\n• Trang bị MacBook Pro và màn hình 4K khi làm việc tại văn phòng.\n• Làm việc hybrid linh hoạt 2 ngày WFH / tuần.")
                .location("Hà Nội (Xuân Thủy, Cầu Giấy)")
                .jobType(JobType.INTERNSHIP)
                .salaryRange("5.000.000 - 7.500.000 VNĐ / tháng")
                .slots(3)
                .deadline(LocalDate.now().plusMonths(1))
                .status(JobStatus.ACTIVE)
                .requiredSkills(job2Skills)
                .build());

        Set<Skill> job3Skills = new HashSet<>();
        if (pythonSkill != null) job3Skills.add(pythonSkill);
        if (dockerSkill != null) job3Skills.add(dockerSkill);

        jobRepository.save(Job.builder()
                .company(viettelProfile)
                .title("AI / Data Science Engineering Intern (Viettel Solutions)")
                .description("Nghiên cứu áp dụng các mô hình LLM, NLP và xử lý ảnh cho các bài toán camera giám sát đô thị thông minh và phân tích văn bản hành chính.")
                .requirements("• Sinh viên năm cuối hoặc học viên Cao học ngành CNTT, Toán - Tin, Khoa học Dữ liệu.\n• Thành thạo Python, PyTorch/TensorFlow, OpenCV.\n• GPA từ 3.2 trở lên là lợi thế.")
                .benefits("• Trợ cấp cạnh tranh: 8.000.000 - 12.000.000 VNĐ / tháng.\n• Tiếp cận cụm máy chủ tính toán GPU hiệu năng cao của Viettel.\n• Cơ hội đồng tác giả bài báo khoa học quốc tế.")
                .location("Hà Nội (Trần Hữu Dực)")
                .jobType(JobType.FULL_TIME)
                .salaryRange("8.000.000 - 12.000.000 VNĐ / tháng")
                .slots(2)
                .deadline(LocalDate.now().plusMonths(3))
                .status(JobStatus.ACTIVE)
                .requiredSkills(job3Skills)
                .build());

        // 6. Applications
        applicationRepository.save(Application.builder()
                .job(job1)
                .student(student1Profile)
                .resumeUrl(student1Profile.getResumeUrl())
                .coverLetter("Em chào anh/chị tuyển dụng FPT Software. Em là sinh viên năm 4 khoa CNTT UET, có niềm đam mê lớn với Spring Boot và Microservices. Em rất mong có cơ hội thực tập và cống hiến tại FPT Software.")
                .status(ApplicationStatus.INTERVIEW)
                .employerFeedback("Hồ sơ rất ấn tượng, GPA tốt và kỹ năng phù hợp. Mời em tham gia phỏng vấn kỹ thuật online.")
                .interviewTime(LocalDateTime.now().plusDays(3).withHour(14).withMinute(0))
                .interviewLocation("Google Meet: https://meet.google.com/internhub-fpt-interview")
                .interviewNotes("Chuẩn bị giới thiệu đồ án tốt nghiệp và kiến thức Spring Boot / MySQL.")
                .build());

        applicationRepository.save(Application.builder()
                .job(job2)
                .student(student2Profile)
                .resumeUrl(student2Profile.getResumeUrl())
                .coverLetter("Kính gửi quý công ty TechCorp, em xin ứng tuyển vị trí Thực tập sinh Frontend ReactJS.")
                .status(ApplicationStatus.APPLIED)
                .build());

        // 7. Initial Notifications
        notificationRepository.save(Notification.builder()
                .user(studentUser1)
                .title("Lời mời phỏng vấn từ FPT Software")
                .message("Bạn nhận được lịch phỏng vấn vị trí Thực tập sinh Backend Java vào lúc 14:00 ngày " + LocalDate.now().plusDays(3))
                .link("/student/applications")
                .isRead(false)
                .build());

        notificationRepository.save(Notification.builder()
                .user(fptUser)
                .title("Ứng viên tiềm năng!")
                .message("Sinh viên Nguyễn Văn An (GPA 3.68) đã nộp hồ sơ vào vị trí Backend Java.")
                .link("/company/applications")
                .isRead(false)
                .build());
    }
}
