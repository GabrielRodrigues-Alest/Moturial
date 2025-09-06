/**
 * User Data Transfer Object
 * 
 * Represents user information for API responses following .ai-rules:
 * - Immutable design with validation
 * - No sensitive data exposure
 * - Production-ready structure
 * 
 * @author Moturial Team
 * @version 1.0.0
 */

package com.moturial.payment.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;
import java.util.UUID;

@Value
@Builder
@Schema(description = "User information")
public class UserDto {

    @Schema(description = "User unique identifier", example = "550e8400-e29b-41d4-a716-446655440000")
    @NotNull
    UUID id;

    @Schema(description = "User full name", example = "João Silva")
    @NotBlank
    String name;

    @Schema(description = "User email address", example = "joao@example.com")
    @NotBlank
    @Email
    String email;

    @Schema(description = "User phone number", example = "+5511999999999")
    String phone;

    @Schema(description = "User role in the system", example = "USER", allowableValues = {"USER", "ADMIN", "STAFF"})
    @NotBlank
    String role;

    @Schema(description = "Whether the user account is active", example = "true")
    @NotNull
    Boolean active;

    @Schema(description = "Whether the user has verified their email", example = "true")
    @NotNull
    Boolean emailVerified;

    @Schema(description = "Whether the user has verified their phone", example = "false")
    @NotNull
    Boolean phoneVerified;

    @Schema(description = "User's preferred language", example = "pt-BR")
    String preferredLanguage;

    @Schema(description = "User registration timestamp")
    @NotNull
    LocalDateTime createdAt;

    @Schema(description = "Last user information update timestamp")
    @NotNull
    LocalDateTime updatedAt;

    @Schema(description = "Last user login timestamp")
    LocalDateTime lastLoginAt;

    @Schema(description = "Number of completed rentals", example = "5")
    @NotNull
    Integer completedRentals;

    @Schema(description = "User's current status", example = "ACTIVE", allowableValues = {"ACTIVE", "INACTIVE", "SUSPENDED", "PENDING_VERIFICATION"})
    @NotBlank
    String status;
}
