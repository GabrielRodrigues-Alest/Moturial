/**
 * Create User Data Transfer Object
 * 
 * DTO for user creation requests following .ai-rules:
 * - Comprehensive validation with custom groups
 * - Security-focused input sanitization
 * - Production-ready validation rules
 * 
 * @author Moturial Team
 * @version 1.0.0
 */

package com.moturial.payment.domain.dto;

import com.moturial.payment.validation.ValidationGroups;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
@Schema(description = "User creation request")
public class CreateUserDto {

    @Schema(description = "User full name", example = "João Silva", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    @Pattern(regexp = "^[\\p{L}\\s'-]+$", message = "Nome deve conter apenas letras, espaços, hífens e apostrofes")
    String name;

    @Schema(description = "User email address", example = "joao@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ter formato válido")
    @Size(max = 255, message = "Email não pode exceder 255 caracteres")
    String email;

    @Schema(description = "User phone number", example = "+5511999999999")
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Telefone deve ser um número válido no formato internacional")
    String phone;

    @Schema(description = "User password", example = "SecurePass123!", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Senha é obrigatória", groups = ValidationGroups.Create.class)
    @Size(min = 8, max = 128, message = "Senha deve ter entre 8 e 128 caracteres")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
        message = "Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial"
    )
    String password;

    @Schema(description = "User role in the system", example = "USER", allowableValues = {"USER", "ADMIN", "STAFF"})
    @NotBlank(message = "Função é obrigatória")
    @Pattern(regexp = "^(USER|ADMIN|STAFF)$", message = "Função deve ser USER, ADMIN ou STAFF")
    String role;

    @Schema(description = "Whether the user account should be active immediately", example = "true")
    @NotNull(message = "Status ativo deve ser especificado")
    Boolean active;

    @Schema(description = "User's preferred language", example = "pt-BR")
    @Pattern(regexp = "^[a-z]{2}-[A-Z]{2}$", message = "Idioma deve estar no formato ISO (ex: pt-BR)")
    String preferredLanguage;

    @Schema(description = "Whether to send welcome email", example = "true")
    Boolean sendWelcomeEmail;
}
