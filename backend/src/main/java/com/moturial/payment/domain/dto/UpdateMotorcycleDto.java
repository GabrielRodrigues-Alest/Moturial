/**
 * Update Motorcycle Data Transfer Object
 * 
 * DTO for motorcycle update requests following .ai-rules:
 * - Partial update support with validation
 * - Security-focused input sanitization
 * - Production-ready validation rules
 * 
 * @author Moturial Team
 * @version 1.0.0
 */

package com.moturial.payment.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Value
@Builder
@Jacksonized
@Schema(description = "Motorcycle update request")
public class UpdateMotorcycleDto {

    @Schema(description = "Motorcycle name/model", example = "Honda CG 160")
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    String name;

    @Schema(description = "Motorcycle type", example = "Urban", allowableValues = {"Urban", "Sport", "Adventure", "Scooter"})
    @Pattern(regexp = "^(Urban|Sport|Adventure|Scooter)$", message = "Tipo deve ser Urban, Sport, Adventure ou Scooter")
    String type;

    @Schema(description = "Engine specifications", example = "160cc")
    @Size(max = 50, message = "Especificação do motor não pode exceder 50 caracteres")
    String engine;

    @Schema(description = "Fuel type", example = "Gasolina", allowableValues = {"Gasolina", "Etanol", "Flex", "Elétrica"})
    @Pattern(regexp = "^(Gasolina|Etanol|Flex|Elétrica)$", message = "Combustível deve ser Gasolina, Etanol, Flex ou Elétrica")
    String fuel;

    @Schema(description = "Manufacturing year", example = "2023")
    @Min(value = 2000, message = "Ano deve ser maior que 2000")
    @Max(value = 2030, message = "Ano não pode ser maior que 2030")
    Integer year;

    @Schema(description = "Whether the motorcycle is available for rental", example = "true")
    Boolean available;

    @Schema(description = "Daily rental price", example = "45.00")
    @DecimalMin(value = "0.01", message = "Preço deve ser maior que zero")
    @DecimalMax(value = "999.99", message = "Preço não pode exceder R$ 999,99")
    BigDecimal pricePerDay;

    @Schema(description = "Current location/store", example = "São Paulo - Centro")
    @Size(max = 100, message = "Localização não pode exceder 100 caracteres")
    String location;

    @Schema(description = "Current mileage in kilometers", example = "15000")
    @PositiveOrZero(message = "Quilometragem deve ser zero ou positiva")
    @Max(value = 999999, message = "Quilometragem não pode exceder 999.999 km")
    Integer mileage;

    @Schema(description = "Motorcycle condition", example = "excellent", allowableValues = {"excellent", "good", "fair", "maintenance"})
    @Pattern(regexp = "^(excellent|good|fair|maintenance)$", message = "Condição deve ser excellent, good, fair ou maintenance")
    String condition;

    @Schema(description = "Motorcycle color", example = "Vermelho")
    @Size(max = 30, message = "Cor não pode exceder 30 caracteres")
    String color;

    @Schema(description = "Maximum number of passengers", example = "2")
    @Min(value = 1, message = "Deve ter pelo menos 1 passageiro")
    @Max(value = 3, message = "Não pode ter mais que 3 passageiros")
    Integer maxPassengers;

    @Schema(description = "Motorcycle features", example = "ABS, Partida elétrica, Painel digital")
    @Size(max = 500, message = "Características não podem exceder 500 caracteres")
    String features;

    @Schema(description = "Insurance policy number")
    @Size(max = 50, message = "Número da apólice não pode exceder 50 caracteres")
    String insurancePolicy;

    @Schema(description = "Last maintenance date")
    LocalDateTime lastMaintenance;

    @Schema(description = "Next scheduled maintenance date")
    LocalDateTime nextMaintenance;

    @Schema(description = "Current rental status", example = "AVAILABLE", allowableValues = {"AVAILABLE", "RENTED", "MAINTENANCE", "INACTIVE"})
    @Pattern(regexp = "^(AVAILABLE|RENTED|MAINTENANCE|INACTIVE)$", message = "Status deve ser AVAILABLE, RENTED, MAINTENANCE ou INACTIVE")
    String status;
}
