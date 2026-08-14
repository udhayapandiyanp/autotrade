package com.usedvehicle.repository;

import com.usedvehicle.entity.FuelType;
import com.usedvehicle.entity.Transmission;
import com.usedvehicle.entity.Vehicle;
import com.usedvehicle.entity.VehicleStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class VehicleSpecification {

    public static Specification<Vehicle> filterPublished(
            String make, String model, String fuelType, String transmission,
            BigDecimal minPrice, BigDecimal maxPrice,
            Integer minYear, Integer maxYear,
            Integer minMileage, Integer maxMileage) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always enforce status is PUBLISHED for public queries
            predicates.add(criteriaBuilder.equal(root.get("status"), VehicleStatus.PUBLISHED));

            if (make != null && !make.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("make")),
                        "%" + make.toLowerCase() + "%"
                ));
            }

            if (model != null && !model.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("model")),
                        "%" + model.toLowerCase() + "%"
                ));
            }

            if (fuelType != null && !fuelType.trim().isEmpty()) {
                try {
                    FuelType fuelTypeEnum = FuelType.valueOf(fuelType.toUpperCase());
                    predicates.add(criteriaBuilder.equal(root.get("fuelType"), fuelTypeEnum));
                } catch (IllegalArgumentException ignored) {}
            }

            if (transmission != null && !transmission.trim().isEmpty()) {
                try {
                    Transmission transmissionEnum = Transmission.valueOf(transmission.toUpperCase());
                    predicates.add(criteriaBuilder.equal(root.get("transmission"), transmissionEnum));
                } catch (IllegalArgumentException ignored) {}
            }

            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            if (minYear != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("year"), minYear));
            }
            if (maxYear != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("year"), maxYear));
            }

            if (minMileage != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("mileage"), minMileage));
            }
            if (maxMileage != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("mileage"), maxMileage));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
