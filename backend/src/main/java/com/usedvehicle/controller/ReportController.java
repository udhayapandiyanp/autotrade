package com.usedvehicle.controller;

import com.usedvehicle.dto.ReportRequest;
import com.usedvehicle.dto.ReportResponse;
import com.usedvehicle.entity.ReportReason;
import com.usedvehicle.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping("/{vehicleId}")
    public ResponseEntity<ReportResponse> createReport(
            @PathVariable UUID vehicleId,
            @Valid @RequestBody ReportRequest request,
            Authentication auth) {
        String email = (String) auth.getPrincipal();
        ReportReason reasonEnum = ReportReason.valueOf(request.getReason().toUpperCase());
        ReportResponse response = reportService.createReport(vehicleId, reasonEnum, request.getDescription(), email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReportResponse>> getReports(Authentication auth) {
        String email = (String) auth.getPrincipal();
        List<ReportResponse> response = reportService.getReports(email);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/admin/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportResponse> resolveReport(@PathVariable UUID id, Authentication auth) {
        String email = (String) auth.getPrincipal();
        ReportResponse response = reportService.resolveReport(id, email);
        return ResponseEntity.ok(response);
    }
}
