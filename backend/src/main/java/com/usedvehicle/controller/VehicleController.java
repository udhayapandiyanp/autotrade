package com.usedvehicle.controller;

import com.usedvehicle.dto.*;
import com.usedvehicle.service.VehicleImageService;
import com.usedvehicle.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;
    private final VehicleImageService vehicleImageService;

    public VehicleController(VehicleService vehicleService, VehicleImageService vehicleImageService) {
        this.vehicleService = vehicleService;
        this.vehicleImageService = vehicleImageService;
    }

    // 1. Public Verification Endpoint (from Phase 3)
    @GetMapping("/test")
    public ResponseEntity<List<VehicleTestResponse>> getTestVehicles() {
        return ResponseEntity.ok(vehicleService.getTestPublishedVehicles());
    }

    // 2. Public Catalog Search with Filter/Page/Sort
    @GetMapping
    public ResponseEntity<Page<VehicleResponse>> getVehicles(
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) String transmission,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minYear,
            @RequestParam(required = false) Integer maxYear,
            @RequestParam(required = false) Integer minMileage,
            @RequestParam(required = false) Integer maxMileage,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Page<VehicleResponse> list = vehicleService.getPublishedVehicles(
                make, model, fuelType, transmission, minPrice, maxPrice, minYear, maxYear, minMileage, maxMileage,
                page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(list);
    }

    // 3. Public Vehicle Details Endpoint
    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getVehicleById(@PathVariable UUID id, Authentication auth) {
        String email = auth != null ? (String) auth.getPrincipal() : null;
        String role = auth != null ? auth.getAuthorities().iterator().next().getAuthority() : null;
        VehicleResponse response = vehicleService.getVehicleById(id, email, role);
        return ResponseEntity.ok(response);
    }

    // 4. Seller: Create Vehicle listing
    @PostMapping
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<VehicleResponse> createVehicle(@Valid @RequestBody VehicleCreateRequest request, Authentication auth) {
        String email = (String) auth.getPrincipal();
        VehicleResponse response = vehicleService.createVehicle(request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 5. Seller: View My Vehicles listings
    @GetMapping("/my")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<List<VehicleResponse>> getMyVehicles(Authentication auth) {
        String email = (String) auth.getPrincipal();
        List<VehicleResponse> response = vehicleService.getMyVehicles(email);
        return ResponseEntity.ok(response);
    }

    // 6. Seller: Update Vehicle listing
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<VehicleResponse> updateVehicle(
            @PathVariable UUID id,
            @Valid @RequestBody VehicleUpdateRequest request,
            Authentication auth) {
        String email = (String) auth.getPrincipal();
        VehicleResponse response = vehicleService.updateVehicle(id, request, email);
        return ResponseEntity.ok(response);
    }

    // 7. Seller: Publish Listing
    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<VehicleResponse> publishVehicle(@PathVariable UUID id, Authentication auth) {
        String email = (String) auth.getPrincipal();
        VehicleResponse response = vehicleService.publishVehicle(id, email);
        return ResponseEntity.ok(response);
    }

    // 8. Seller/Admin: Archive (Soft Delete) Listing
    @DeleteMapping("/{id}")
    public ResponseEntity<VehicleResponse> archiveVehicle(@PathVariable UUID id, Authentication auth) {
        String email = (String) auth.getPrincipal();
        String role = auth.getAuthorities().iterator().next().getAuthority();
        VehicleResponse response = vehicleService.archiveVehicle(id, email, role);
        return ResponseEntity.ok(response);
    }

    // 9. Seller: Add Image Reference
    @PostMapping("/{id}/images")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<VehicleImageResponse> addImage(
            @PathVariable UUID id,
            @Valid @RequestBody VehicleImageRequest request,
            Authentication auth) {
        String email = (String) auth.getPrincipal();
        VehicleImageResponse response = vehicleImageService.addImage(id, request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 10. Public: Get Vehicle Images
    @GetMapping("/{id}/images")
    public ResponseEntity<List<VehicleImageResponse>> getImages(@PathVariable UUID id) {
        List<VehicleImageResponse> response = vehicleImageService.getImagesByVehicle(id);
        return ResponseEntity.ok(response);
    }

    // 11. Seller: Delete Image Reference
    @DeleteMapping("/{id}/images/{imageId}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Void> deleteImage(
            @PathVariable UUID id,
            @PathVariable UUID imageId,
            Authentication auth) {
        String email = (String) auth.getPrincipal();
        vehicleImageService.deleteImage(id, imageId, email);
        return ResponseEntity.noContent().build();
    }
}
