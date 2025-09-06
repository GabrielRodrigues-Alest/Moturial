/**
 * Update User Data Transfer Object
 * 
 * DTO for user update requests following .ai-rules:
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

@Value
@Builder
@Jacksonized
@Schema(description = "User update request")
public class UpdateUserDto {

    @Schema(description = "User full name", example = "João Silva")
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    @Pattern(regexp = "^[\\p{L}\\s'-]+$", message = "Nome deve conter apenas letras, espaços, hífens e apostrofes")
    String name;

    @Schema(description = "User phone number", example = "+5511999999999")
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Telefone deve ser um número válido no formato internacional")
    String phone;

    @Schema(description = "User role in the system", example = "USER", allowableValues = {"USER", "ADMIN", "STAFF"})
    @Pattern(regexp = "^(USER|ADMIN|STAFF)$", message = "Função deve ser USER, ADMIN ou STAFF")
    String role;

    @Schema(description = "Whether the user account is active", example = "true")
    Boolean active;

    @Schema(description = "User's preferred language", example = "pt-BR")
    @Pattern(regexp = "^[a-z]{2}-[A-Z]{2}$", message = "Idioma deve estar no formato ISO (ex: pt-BR)")
    String preferredLanguage;

    @Schema(description = "User's current status", example = "ACTIVE", allowableValues = {"ACTIVE", "INACTIVE", "SUSPENDED", "PENDING_VERIFICATION"})
    @Pattern(regexp = "^(ACTIVE|INACTIVE|SUSPENDED|PENDING_VERIFICATION)$", message = "Status deve ser ACTIVE, INACTIVE, SUSPENDED ou PENDING_VERIFICATION")
    String status;
}
