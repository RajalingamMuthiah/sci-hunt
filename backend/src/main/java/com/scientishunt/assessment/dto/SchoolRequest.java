package com.scientishunt.assessment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class SchoolRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String plan;

    @Pattern(regexp = "^(ACTIVE|INACTIVE|SUSPENDED)$", message = "status must be ACTIVE, INACTIVE, or SUSPENDED")
    private String status;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPlan() {
        return plan;
    }

    public void setPlan(String plan) {
        this.plan = plan;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
