/**
 * Rental Data Transfer Object
 * 
 * Represents rental information for API responses following .ai-rules:
 * - Immutable design with validation
 * - Complete rental lifecycle information
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
@Schema(description = "Rental information")
public class RentalDto {

    @Schema(description = "Rental unique identifier", example = "550e8400-e29b-41d4-a716-446655440000")
    @NotNull
    UUID id;

    @Schema(description = "User ID who made the rental", example = "550e8400-e29b-41d4-a716-446655440001")
    @NotNull
    UUID userId;

    @Schema(description = "User name", example = "João Silva")
    @NotBlank
    String userName;

    @Schema(description = "User email", example = "joao@example.com")
    @NotBlank
    @Email
    String userEmail;

    @Schema(description = "Motorcycle ID being rented", example = "550e8400-e29b-41d4-a716-446655440002")
    @NotNull
    UUID motorcycleId;

    @Schema(description = "Motorcycle name", example = "Honda CG 160")
    @NotBlank
    String motorcycleName;

    @Schema(description = "Rental start date and time")
    @NotNull
    LocalDateTime startDate;

    @Schema(description = "Rental end date and time")
    @NotNull
    LocalDateTime endDate;

    @Schema(description = "Current rental status", example = "active", allowableValues = {"pending", "active", "completed", "cancelled"})
    @NotBlank
    String status;

    @Schema(description = "Total rental amount", example = "150.00")
    @NotNull
    @DecimalMin(value = "0.00", message = "Valor total deve ser zero ou positivo")
    BigDecimal totalAmount;

    @Schema(description = "Payment status", example = "paid", allowableValues = {"pending", "paid", "failed", "refunded"})
    @NotBlank
    String paymentStatus;

    @Schema(description = "Payment method used", example = "CREDIT_CARD")
    String paymentMethod;

    @Schema(description = "Stripe payment intent ID")
    String paymentIntentId;

    @Schema(description = "Rental location/store", example = "São Paulo - Centro")
    @NotBlank
    String location;

    @Schema(description = "Number of rental days", example = "3")
    @Positive
    Integer rentalDays;

    @Schema(description = "Daily rate applied", example = "50.00")
    @NotNull
    @DecimalMin(value = "0.01", message = "Diária deve ser maior que zero")
    BigDecimal dailyRate;

    @Schema(description = "Additional fees applied", example = "15.00")
    @DecimalMin(value = "0.00", message = "Taxas adicionais devem ser zero ou positivas")
    BigDecimal additionalFees;

    @Schema(description = "Discount applied", example = "5.00")
    @DecimalMin(value = "0.00", message = "Desconto deve ser zero ou positivo")
    BigDecimal discount;

    @Schema(description = "Insurance coverage selected")
    String insuranceCoverage;

    @Schema(description = "Special requirements or notes")
    String notes;

    @Schema(description = "Pickup confirmation timestamp")
    LocalDateTime pickedUpAt;

    @Schema(description = "Return confirmation timestamp")
    LocalDateTime returnedAt;

    @Schema(description = "Rental creation timestamp")
    @NotNull
    LocalDateTime createdAt;

    @Schema(description = "Last rental update timestamp")
    @NotNull
    LocalDateTime updatedAt;

    @Schema(description = "Cancellation reason if applicable")
    String cancellationReason;

    @Schema(description = "Cancellation timestamp")
    LocalDateTime cancelledAt;

    @Schema(description = "Late return fee if applicable", example = "25.00")
    @DecimalMin(value = "0.00", message = "Taxa de atraso deve ser zero ou positiva")
    BigDecimal lateReturnFee;

    @Schema(description = "Damage assessment fee if applicable", example = "100.00")
    @DecimalMin(value = "0.00", message = "Taxa de danos deve ser zero ou positiva")
    BigDecimal damageFee;

    @Schema(description = "Final inspection notes")
    String inspectionNotes;

    @Schema(description = "Customer rating for the rental", example = "5")
    @Min(value = 1, message = "Avaliação deve ser entre 1 e 5")
    @Max(value = 5, message = "Avaliação deve ser entre 1 e 5")
    Integer customerRating;

    @Schema(description = "Customer feedback")
    String customerFeedback;
}
