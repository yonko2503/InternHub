package com.internhub.app.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationRequest {

    @NotNull(message = "Job ID không được để trống")
    private Long jobId;

    private String resumeUrl;
    private String coverLetter;
}
