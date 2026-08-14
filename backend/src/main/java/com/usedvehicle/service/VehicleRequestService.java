package com.usedvehicle.service;

import com.usedvehicle.dto.VehicleRequestRequest;
import com.usedvehicle.dto.VehicleRequestResponse;
import com.usedvehicle.entity.*;
import com.usedvehicle.repository.UserRepository;
import com.usedvehicle.repository.VehicleRepository;
import com.usedvehicle.repository.VehicleRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class VehicleRequestService {

    private final VehicleRequestRepository vehicleRequestRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public VehicleRequestService(VehicleRequestRepository vehicleRequestRepository,
                                 VehicleRepository vehicleRepository,
                                 UserRepository userRepository,
                                 NotificationService notificationService) {
        this.vehicleRequestRepository = vehicleRequestRepository;
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public VehicleRequestResponse createRequest(VehicleRequestRequest request, String buyerEmail) {
        User buyer = userRepository.findByEmail(buyerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (!"BUYER".equals(buyer.getRole().getName())) {
            throw new IllegalArgumentException("Only buyers can submit inquiries.");
        }

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle listing not found."));

        if (vehicle.getStatus() != VehicleStatus.PUBLISHED) {
            throw new IllegalArgumentException("You can only inquire about published vehicle listings.");
        }

        // Prevent duplicate simultaneously PENDING requests
        if (vehicleRequestRepository.existsByBuyerIdAndVehicleIdAndStatus(buyer.getId(), vehicle.getId(), RequestStatus.PENDING)) {
            throw new IllegalArgumentException("You already have a pending inquiry request for this vehicle.");
        }

        VehicleRequest vehicleRequest = new VehicleRequest();
        vehicleRequest.setBuyer(buyer);
        vehicleRequest.setVehicle(vehicle);
        vehicleRequest.setMessage(request.getMessage());
        vehicleRequest.setContactEmail(request.getContactEmail());
        vehicleRequest.setContactPhone(request.getContactPhone());
        vehicleRequest.setStatus(RequestStatus.PENDING);

        VehicleRequest saved = vehicleRequestRepository.save(vehicleRequest);

        // Notify seller
        notificationService.createNotification(
                vehicle.getSeller(),
                "New Vehicle Inquiry",
                String.format("%s %s has sent an inquiry regarding your %s %s listing.",
                        buyer.getFirstName(), buyer.getLastName(), vehicle.getMake(), vehicle.getModel())
        );

        return convertToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<VehicleRequestResponse> getRequestsByBuyer(String buyerEmail) {
        User buyer = userRepository.findByEmail(buyerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        return vehicleRequestRepository.findByBuyerId(buyer.getId()).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VehicleRequestResponse> getRequestsBySeller(String sellerEmail) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        return vehicleRequestRepository.findByVehicleSellerId(seller.getId()).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public VehicleRequestResponse updateRequestStatus(UUID requestId, RequestStatus newStatus, String sellerEmail) {
        VehicleRequest vehicleRequest = vehicleRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found."));

        // Verify caller is the seller of the listing
        if (!vehicleRequest.getVehicle().getSeller().getEmail().equals(sellerEmail)) {
            throw new IllegalArgumentException("You are not authorized to update this request status.");
        }

        // Enforce strict transitions: PENDING -> ACCEPTED or PENDING -> DECLINED
        if (vehicleRequest.getStatus() != RequestStatus.PENDING) {
            throw new IllegalArgumentException("Can only update status of PENDING requests.");
        }

        if (newStatus != RequestStatus.ACCEPTED && newStatus != RequestStatus.DECLINED) {
            throw new IllegalArgumentException("Invalid status transition.");
        }

        vehicleRequest.setStatus(newStatus);
        VehicleRequest saved = vehicleRequestRepository.save(vehicleRequest);

        // Notify buyer
        String verb = newStatus == RequestStatus.ACCEPTED ? "accepted" : "declined";
        notificationService.createNotification(
                vehicleRequest.getBuyer(),
                "Inquiry Request Update",
                String.format("The seller has %s your inquiry request for %s %s.",
                        verb, vehicleRequest.getVehicle().getMake(), vehicleRequest.getVehicle().getModel())
        );

        return convertToResponse(saved);
    }

    private VehicleRequestResponse convertToResponse(VehicleRequest req) {
        return new VehicleRequestResponse(
                req.getId(),
                req.getVehicle().getId(),
                req.getVehicle().getMake() + " " + req.getVehicle().getModel(),
                req.getBuyer().getFirstName() + " " + req.getBuyer().getLastName(),
                req.getMessage(),
                req.getStatus().name(),
                req.getCreatedAt()
        );
    }
}
