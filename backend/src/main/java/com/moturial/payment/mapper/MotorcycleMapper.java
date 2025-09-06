package com.moturial.payment.mapper;

import com.moturial.payment.domain.dto.CreateMotorcycleDto;
import com.moturial.payment.domain.dto.UpdateMotorcycleDto;
import com.moturial.payment.domain.dto.MotorcycleDto;
import com.moturial.payment.domain.entity.Motorcycle;
import org.springframework.stereotype.Component;

@Component
public class MotorcycleMapper {

    public MotorcycleDto toDto(Motorcycle motorcycle) {
        if (motorcycle == null) {
            return null;
        }

        return MotorcycleDto.builder()
                .id(motorcycle.getId())
                .name(motorcycle.getName())
                .type(motorcycle.getType())
                .engine(motorcycle.getEngine())
                .fuel(motorcycle.getFuel())
                .year(motorcycle.getYear())
                .color(motorcycle.getColor())
                .licensePlate(motorcycle.getLicensePlate())
                .status(motorcycle.getStatus().name())
                .location(motorcycle.getLocation())
                .pricePerDay(motorcycle.getDailyRate())
                .mileage(motorcycle.getMileage())
                .lastMaintenance(motorcycle.getLastMaintenance())
                .nextMaintenance(motorcycle.getNextMaintenance())
                .available(motorcycle.getStatus() == Motorcycle.Status.AVAILABLE)
                .condition("excellent")
                .createdAt(motorcycle.getCreatedAt())
                .updatedAt(motorcycle.getUpdatedAt())
                .build();
    }

    public Motorcycle toEntity(CreateMotorcycleDto createMotorcycleDto) {
        if (createMotorcycleDto == null) {
            return null;
        }

        return Motorcycle.builder()
                .name(createMotorcycleDto.getName())
                .type(createMotorcycleDto.getType())
                .engine(createMotorcycleDto.getEngine())
                .fuel(createMotorcycleDto.getFuel())
                .year(createMotorcycleDto.getYear())
                .color(createMotorcycleDto.getColor())
                .licensePlate(createMotorcycleDto.getLicensePlate())
                .status(Motorcycle.Status.AVAILABLE)
                .location(createMotorcycleDto.getLocation())
                .dailyRate(createMotorcycleDto.getPricePerDay())
                .mileage(0)
                .build();
    }

    public void updateEntity(Motorcycle motorcycle, UpdateMotorcycleDto updateMotorcycleDto) {
        if (motorcycle == null || updateMotorcycleDto == null) {
            return;
        }

        if (updateMotorcycleDto.getName() != null) {
            motorcycle.setName(updateMotorcycleDto.getName());
        }
        if (updateMotorcycleDto.getType() != null) {
            motorcycle.setType(updateMotorcycleDto.getType());
        }
        if (updateMotorcycleDto.getEngine() != null) {
            motorcycle.setEngine(updateMotorcycleDto.getEngine());
        }
        if (updateMotorcycleDto.getFuel() != null) {
            motorcycle.setFuel(updateMotorcycleDto.getFuel());
        }
        if (updateMotorcycleDto.getYear() != null) {
            motorcycle.setYear(updateMotorcycleDto.getYear());
        }
        if (updateMotorcycleDto.getColor() != null) {
            motorcycle.setColor(updateMotorcycleDto.getColor());
        }
        if (updateMotorcycleDto.getLocation() != null) {
            motorcycle.setLocation(updateMotorcycleDto.getLocation());
        }
        if (updateMotorcycleDto.getPricePerDay() != null) {
            motorcycle.setDailyRate(updateMotorcycleDto.getPricePerDay());
        }
        if (updateMotorcycleDto.getStatus() != null) {
            motorcycle.setStatus(Motorcycle.Status.valueOf(updateMotorcycleDto.getStatus()));
        }
        if (updateMotorcycleDto.getMileage() != null) {
            motorcycle.setMileage(updateMotorcycleDto.getMileage());
        }
    }
}
