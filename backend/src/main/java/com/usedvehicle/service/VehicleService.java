package com.usedvehicle.service;

import com.usedvehicle.dto.VehicleCreateRequest;
import com.usedvehicle.dto.VehicleResponse;
import com.usedvehicle.dto.VehicleUpdateRequest;
import com.usedvehicle.entity.*;
import com.usedvehicle.repository.UserRepository;
import com.usedvehicle.repository.VehicleRepository;
import com.usedvehicle.repository.VehicleSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import com.usedvehicle.dto.VehicleTestResponse;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public VehicleService(VehicleRepository vehicleRepository, UserRepository userRepository) {
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    public List<VehicleTestResponse> getTestPublishedVehicles() {
        List<Vehicle> vehicles = vehicleRepository.findByStatus(VehicleStatus.PUBLISHED);
        return vehicles.stream()
                .map(v -> new VehicleTestResponse(
                        v.getId(),
                        v.getMake(),
                        v.getModel(),
                        v.getYear(),
                        v.getPrice(),
                        v.getMileage(),
                        v.getFuelType().name(),
                        v.getTransmission().name(),
                        v.getSeller().getEmail()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public VehicleResponse createVehicle(VehicleCreateRequest request, String sellerEmail) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Seller user not found."));

        Vehicle vehicle = new Vehicle();
        vehicle.setSeller(seller);
        vehicle.setMake(request.getMake());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        vehicle.setPrice(request.getPrice());
        vehicle.setMileage(request.getMileage());
        vehicle.setFuelType(FuelType.valueOf(request.getFuelType().toUpperCase()));
        vehicle.setTransmission(Transmission.valueOf(request.getTransmission().toUpperCase()));
        vehicle.setDescription(request.getDescription());
        vehicle.setStatus(VehicleStatus.DRAFT);

        Vehicle saved = vehicleRepository.save(vehicle);
        return convertToResponse(saved);
    }

    @Transactional
    public VehicleResponse updateVehicle(UUID id, VehicleUpdateRequest request, String sellerEmail) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle listing not found."));

        if (!vehicle.getSeller().getEmail().equals(sellerEmail)) {
            throw new IllegalArgumentException("You are not authorized to modify this listing.");
        }

        vehicle.setMake(request.getMake());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        vehicle.setPrice(request.getPrice());
        vehicle.setMileage(request.getMileage());
        vehicle.setFuelType(FuelType.valueOf(request.getFuelType().toUpperCase()));
        vehicle.setTransmission(Transmission.valueOf(request.getTransmission().toUpperCase()));
        vehicle.setDescription(request.getDescription());

        Vehicle saved = vehicleRepository.save(vehicle);
        return convertToResponse(saved);
    }

    @Transactional
    public VehicleResponse publishVehicle(UUID id, String sellerEmail) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle listing not found."));

        if (!vehicle.getSeller().getEmail().equals(sellerEmail)) {
            throw new IllegalArgumentException("You are not authorized to publish this listing.");
        }

        vehicle.setStatus(VehicleStatus.PUBLISHED);
        Vehicle saved = vehicleRepository.save(vehicle);
        return convertToResponse(saved);
    }

    @Transactional
    public VehicleResponse archiveVehicle(UUID id, String sellerEmail, String userRole) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle listing not found."));

        // Only the owner or an ADMIN can archive
        boolean isOwner = vehicle.getSeller().getEmail().equals(sellerEmail);
        boolean isAdmin = "ADMIN".equals(userRole) || "ROLE_ADMIN".equals(userRole);

        if (!isOwner && !isAdmin) {
            throw new IllegalArgumentException("You are not authorized to archive this listing.");
        }

        vehicle.setStatus(VehicleStatus.ARCHIVED);
        Vehicle saved = vehicleRepository.save(vehicle);
        return convertToResponse(saved);
    }

    @Transactional(readOnly = true)
    public VehicleResponse getVehicleById(UUID id, String currentUserEmail, String userRole) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle listing not found."));

        // Visible publicly if PUBLISHED.
        // If DRAFT or ARCHIVED, must be owner or ADMIN.
        if (vehicle.getStatus() != VehicleStatus.PUBLISHED) {
            boolean isOwner = vehicle.getSeller().getEmail().equals(currentUserEmail);
            boolean isAdmin = "ADMIN".equals(userRole) || "ROLE_ADMIN".equals(userRole);
            if (!isOwner && !isAdmin) {
                throw new IllegalArgumentException("You are not authorized to view this listing.");
            }
        }

        return convertToResponse(vehicle);
    }

    @Transactional(readOnly = true)
    public Page<VehicleResponse> getPublishedVehicles(
            String make, String model, String fuelType, String transmission,
            BigDecimal minPrice, BigDecimal maxPrice,
            Integer minYear, Integer maxYear,
            Integer minMileage, Integer maxMileage,
            int page, int size, String sortBy, String sortDir) {

        // Enforce safe sorting: allow only specific fields
        String sortField = "createdAt";
        if ("price".equalsIgnoreCase(sortBy)) {
            sortField = "price";
        } else if ("year".equalsIgnoreCase(sortBy)) {
            sortField = "year";
        } else if ("mileage".equalsIgnoreCase(sortBy)) {
            sortField = "mileage";
        }

        Sort sort = Sort.by(sortField);
        if ("desc".equalsIgnoreCase(sortDir)) {
            sort = sort.descending();
        } else {
            sort = sort.ascending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Vehicle> spec = VehicleSpecification.filterPublished(
                make, model, fuelType, transmission, minPrice, maxPrice, minYear, maxYear, minMileage, maxMileage
        );

        Page<Vehicle> vehicles = vehicleRepository.findAll(spec, pageable);
        return vehicles.map(this::convertToResponse);
    }

    @Transactional(readOnly = true)
    public List<VehicleResponse> getMyVehicles(String sellerEmail) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Seller user not found."));

        // Returns all own listings except ARCHIVED (soft deleted) ones
        List<Vehicle> myVehicles = vehicleRepository.findBySellerIdAndStatusNot(seller.getId(), VehicleStatus.ARCHIVED);
        return myVehicles.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    private VehicleResponse convertToResponse(Vehicle v) {
        return new VehicleResponse(
                v.getId(),
                v.getMake(),
                v.getModel(),
                v.getYear(),
                v.getPrice(),
                v.getMileage(),
                v.getFuelType().name(),
                v.getTransmission().name(),
                v.getDescription(),
                v.getStatus().name(),
                v.getSeller().getId(),
                v.getSeller().getFirstName() + " " + v.getSeller().getLastName(),
                v.getCreatedAt(),
                v.getUpdatedAt()
        );
    }
}
