package com.usedvehicle.controller;

import com.usedvehicle.dto.VehicleRequestRequest;
import com.usedvehicle.dto.VehicleRequestResponse;
import com.usedvehicle.entity.RequestStatus;
import com.usedvehicle.service.VehicleRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/requests")
public class VehicleRequestController {

    private final VehicleRequestService vehicleRequestService;

    public VehicleRequestController(VehicleRequestService vehicleRequestService) {
        this.vehicleRequestService = vehicleRequestService;
    }

    @PostMapping
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<VehicleRequestResponse> createRequest(
            @Valid @RequestBody VehicleRequestRequest request, Authentication auth) {
        String email = (String) auth.getPrincipal();
        VehicleRequestResponse response = vehicleRequestService.createRequest(request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/buyer")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<List<VehicleRequestResponse>> getBuyerRequests(Authentication auth) {
        String email = (String) auth.getPrincipal();
        List<VehicleRequestResponse> response = vehicleRequestService.getRequestsByBuyer(email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/seller")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<List<VehicleRequestResponse>> getSellerRequests(Authentication auth) {
        String email = (String) auth.getPrincipal();
        List<VehicleRequestResponse> response = vehicleRequestService.getRequestsBySeller(email);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<VehicleRequestResponse> updateRequestStatus(
            @PathVariable UUID id,
            @RequestParam String status,
            Authentication auth) {
        String email = (String) auth.getPrincipal();
        RequestStatus newStatus = RequestStatus.valueOf(status.toUpperCase());
        VehicleRequestResponse response = vehicleRequestService.updateRequestStatus(id, newStatus, email);
        return ResponseEntity.ok(response);
    }
}
