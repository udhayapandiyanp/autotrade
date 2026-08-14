package com.usedvehicle.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ReportRequest {

    @NotBlank(message = "Reason is required")
    @Pattern(regexp = "^(FRAUD|SPAM|INACCURATE|SOLD)$", message = "Reason must be FRAUD, SPAM, INACCURATE, or SOLD")
    private String reason;

    private String description;

    public ReportRequest() {}

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
