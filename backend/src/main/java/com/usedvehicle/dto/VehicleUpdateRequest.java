package com.usedvehicle.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

public class VehicleUpdateRequest {

    @NotBlank(message = "Make is required")
    private String make;

    @NotBlank(message = "Model is required")
    private String model;

    @NotNull(message = "Year is required")
    @Min(value = 1886, message = "Year must be valid")
    private Integer year;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private BigDecimal price;

    @NotNull(message = "Mileage is required")
    @Min(value = 0, message = "Mileage cannot be negative")
    private Integer mileage;

    @NotBlank(message = "Fuel type is required")
    @Pattern(regexp = "^(PETROL|DIESEL|ELECTRIC|HYBRID)$", message = "Fuel type must be PETROL, DIESEL, ELECTRIC, or HYBRID")
    private String fuelType;

    @NotBlank(message = "Transmission is required")
    @Pattern(regexp = "^(MANUAL|AUTOMATIC)$", message = "Transmission must be MANUAL or AUTOMATIC")
    private String transmission;

    private String description;

    public VehicleUpdateRequest() {}

    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getMileage() { return mileage; }
    public void setMileage(Integer mileage) { this.mileage = mileage; }

    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }

    public String getTransmission() { return transmission; }
    public void setTransmission(String transmission) { this.transmission = transmission; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
