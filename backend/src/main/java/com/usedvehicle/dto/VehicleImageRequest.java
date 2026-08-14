package com.usedvehicle.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VehicleImageRequest {

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    @NotNull(message = "isPrimary must be specified")
    private Boolean isPrimary = false;

    public VehicleImageRequest() {}

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsPrimary() { return isPrimary; }
    public void setIsPrimary(Boolean isPrimary) { this.isPrimary = isPrimary; }
}
