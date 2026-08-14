package com.usedvehicle.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class VehicleTestResponse {
    private UUID id;
    private String make;
    private String model;
    private Integer year;
    private BigDecimal price;
    private Integer mileage;
    private String fuelType;
    private String transmission;
    private String sellerEmail;

    public VehicleTestResponse(UUID id, String make, String model, Integer year, BigDecimal price, 
                               Integer mileage, String fuelType, String transmission, String sellerEmail) {
        this.id = id;
        this.make = make;
        this.model = model;
        this.year = year;
        this.price = price;
        this.mileage = mileage;
        this.fuelType = fuelType;
        this.transmission = transmission;
        this.sellerEmail = sellerEmail;
    }

    public UUID getId() { return id; }
    public String getMake() { return make; }
    public String getModel() { return model; }
    public Integer getYear() { return year; }
    public BigDecimal getPrice() { return price; }
    public Integer getMileage() { return mileage; }
    public String getFuelType() { return fuelType; }
    public String getTransmission() { return transmission; }
    public String getSellerEmail() { return sellerEmail; }
}
