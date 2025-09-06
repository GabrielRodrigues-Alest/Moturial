/**
 * Motorcycle Data Transfer Object
 * 
 * Represents motorcycle information for API responses following .ai-rules:
 * - Immutable design with validation
 * - Complete motorcycle specifications
 * - Production-ready structure
 * 
 * @author Moturial Team
 * @version 1.0.0
 */

package com.moturial.payment.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Value
@Builder
@Schema(description = "Motorcycle information")
public class MotorcycleDto {

    @Schema(description = "Motorcycle unique identifier", example = "550e8400-e29b-41d4-a716-446655440000")
    @NotNull
    UUID id;

    @Schema(description = "Motorcycle name/model", example = "Honda CG 160")
    @NotBlank
    String name;

    @Schema(description = "Motorcycle type", example = "Urban", allowableValues = {"Urban", "Sport", "Adventure", "Scooter"})
    @NotBlank
    String type;

    @Schema(description = "Engine specifications", example = "160cc")
    @NotBlank
    String engine;

    @Schema(description = "Fuel type", example = "Gasolina", allowableValues = {"Gasolina", "Etanol", "Flex", "Elétrica"})
    @NotBlank
    String fuel;

    @Schema(description = "Manufacturing year", example = "2023")
    @NotNull
    @Min(value = 2000, message = "Ano deve ser maior que 2000")
    @Max(value = 2030, message = "Ano não pode ser maior que 2030")
    Integer year;

    @Schema(description = "Whether the motorcycle is available for rental", example = "true")
    @NotNull
    Boolean available;

    @Schema(description = "Daily rental price", example = "45.00")
    @NotNull
    @DecimalMin(value = "0.01", message = "Preço deve ser maior que zero")
    @DecimalMax(value = "999.99", message = "Preço não pode exceder R$ 999,99")
    BigDecimal pricePerDay;

    @Schema(description = "Current location/store", example = "São Paulo - Centro")
    @NotBlank
    String location;

    @Schema(description = "Current mileage in kilometers", example = "15000")
    @PositiveOrZero
    Integer mileage;

    @Schema(description = "Last maintenance date")
    LocalDateTime lastMaintenance;

    @Schema(description = "Motorcycle condition", example = "excellent", allowableValues = {"excellent", "good", "fair", "maintenance"})
    @NotBlank
    String condition;

    @Schema(description = "License plate", example = "ABC-1234")
    @Pattern(regexp = "^[A-Z]{3}-\\d{4}$", message = "Placa deve estar no formato ABC-1234")
    String licensePlate;

    @Schema(description = "Motorcycle color", example = "Vermelho")
    String color;

    @Schema(description = "Maximum number of passengers", example = "2")
    @Min(value = 1, message = "Deve ter pelo menos 1 passageiro")
    @Max(value = 3, message = "Não pode ter mais que 3 passageiros")
    Integer maxPassengers;

    @Schema(description = "Motorcycle features")
    String features;

    @Schema(description = "Insurance policy number")
    String insurancePolicy;

    @Schema(description = "Next scheduled maintenance date")
    LocalDateTime nextMaintenance;

    @Schema(description = "Motorcycle registration timestamp")
    @NotNull
    LocalDateTime createdAt;

    @Schema(description = "Last motorcycle information update timestamp")
    @NotNull
    LocalDateTime updatedAt;

    @Schema(description = "Current rental status", example = "AVAILABLE", allowableValues = {"AVAILABLE", "RENTED", "MAINTENANCE", "INACTIVE"})
    @NotBlank
    String status;
}
