package com.internhub.app.dto;

import com.internhub.app.model.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationStatusUpdateRequest {

    @NotNull(message = "Trạng thái ứng tuyển không được để trống")
    private ApplicationStatus status;

    private String employerFeedback;
    private LocalDateTime interviewTime;
    private String interviewLocation;
    private String interviewNotes;
}
