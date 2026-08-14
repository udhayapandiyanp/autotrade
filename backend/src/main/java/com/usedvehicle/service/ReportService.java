package com.usedvehicle.service;

import com.usedvehicle.dto.ReportResponse;
import com.usedvehicle.entity.*;
import com.usedvehicle.repository.ReportRepository;
import com.usedvehicle.repository.UserRepository;
import com.usedvehicle.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    public ReportService(ReportRepository reportRepository, UserRepository userRepository, VehicleRepository vehicleRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional
    public ReportResponse createReport(UUID vehicleId, ReportReason reason, String description, String reporterEmail) {
        User reporter = userRepository.findByEmail(reporterEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found."));

        if (reportRepository.existsByReporterIdAndVehicleId(reporter.getId(), vehicleId)) {
            throw new IllegalArgumentException("You have already reported this vehicle listing.");
        }

        Report report = new Report();
        report.setReporter(reporter);
        report.setVehicle(vehicle);
        report.setReason(reason);
        report.setDescription(description);
        report.setStatus(ReportStatus.PENDING);

        Report saved = reportRepository.save(report);
        return convertToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getReports(String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (!"ADMIN".equals(admin.getRole().getName())) {
            throw new IllegalArgumentException("Only administrative users can access moderation reports.");
        }

        return reportRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReportResponse resolveReport(UUID reportId, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (!"ADMIN".equals(admin.getRole().getName())) {
            throw new IllegalArgumentException("Only administrative users can resolve reports.");
        }

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found."));

        report.setStatus(ReportStatus.RESOLVED);
        Report saved = reportRepository.save(report);
        return convertToResponse(saved);
    }

    private ReportResponse convertToResponse(Report r) {
        return new ReportResponse(
                r.getId(),
                r.getReporter().getFirstName() + " " + r.getReporter().getLastName(),
                r.getVehicle().getId(),
                r.getVehicle().getMake() + " " + r.getVehicle().getModel(),
                r.getReason().name(),
                r.getDescription(),
                r.getStatus().name(),
                r.getCreatedAt()
        );
    }
}
