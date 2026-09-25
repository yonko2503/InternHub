package com.internhub.app.dto;

import com.internhub.app.model.JobStatus;
import com.internhub.app.model.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequest {

    @NotBlank(message = "Tiêu đề công việc không được để trống")
    private String title;

    @NotBlank(message = "Mô tả công việc không được để trống")
    private String description;

    @NotBlank(message = "Yêu cầu ứng viên không được để trống")
    private String requirements;

    private String benefits;
    private String location;

    @NotNull(message = "Hình thức làm việc không được để trống")
    private JobType jobType;

    private String salaryRange;
    private Integer slots;
    private LocalDate deadline;
    private JobStatus status;
    private Set<String> skills;
}
