package com.usedvehicle.service;

import com.usedvehicle.dto.VehicleImageRequest;
import com.usedvehicle.dto.VehicleImageResponse;
import com.usedvehicle.entity.Vehicle;
import com.usedvehicle.entity.VehicleImage;
import com.usedvehicle.repository.VehicleImageRepository;
import com.usedvehicle.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class VehicleImageService {

    private final VehicleImageRepository vehicleImageRepository;
    private final VehicleRepository vehicleRepository;

    public VehicleImageService(VehicleImageRepository vehicleImageRepository, VehicleRepository vehicleRepository) {
        this.vehicleImageRepository = vehicleImageRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional
    public VehicleImageResponse addImage(UUID vehicleId, VehicleImageRequest request, String sellerEmail) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found."));

        if (!vehicle.getSeller().getEmail().equals(sellerEmail)) {
            throw new IllegalArgumentException("You are not authorized to manage images for this vehicle.");
        }

        // If setting this image as primary, demote other primary images of this vehicle
        if (Boolean.TRUE.equals(request.getIsPrimary())) {
            List<VehicleImage> existing = vehicleImageRepository.findByVehicleId(vehicleId);
            for (VehicleImage img : existing) {
                if (Boolean.TRUE.equals(img.getIsPrimary())) {
                    img.setIsPrimary(false);
                    vehicleImageRepository.save(img);
                }
            }
        }

        VehicleImage image = new VehicleImage();
        image.setVehicle(vehicle);
        image.setImageUrl(request.getImageUrl());
        image.setIsPrimary(request.getIsPrimary());

        VehicleImage saved = vehicleImageRepository.save(image);
        return convertToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<VehicleImageResponse> getImagesByVehicle(UUID vehicleId) {
        // Enforce vehicle existence check
        if (!vehicleRepository.existsById(vehicleId)) {
            throw new IllegalArgumentException("Vehicle not found.");
        }
        return vehicleImageRepository.findByVehicleId(vehicleId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteImage(UUID vehicleId, UUID imageId, String sellerEmail) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found."));

        if (!vehicle.getSeller().getEmail().equals(sellerEmail)) {
            throw new IllegalArgumentException("You are not authorized to manage images for this vehicle.");
        }

        VehicleImage image = vehicleImageRepository.findById(imageId)
                .orElseThrow(() -> new IllegalArgumentException("Image reference not found."));

        if (!image.getVehicle().getId().equals(vehicleId)) {
            throw new IllegalArgumentException("Image does not belong to specified vehicle.");
        }

        vehicleImageRepository.delete(image);
    }

    private VehicleImageResponse convertToResponse(VehicleImage img) {
        return new VehicleImageResponse(
                img.getId(),
                img.getVehicle().getId(),
                img.getImageUrl(),
                img.getIsPrimary(),
                img.getCreatedAt()
        );
    }
}
