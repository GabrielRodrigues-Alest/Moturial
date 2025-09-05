package com.moturial.payment.domain.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

/**
 * DTO para dados de boleto
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
public class BoletoData {

    @NotNull(message = "Data de vencimento é obrigatória")
    @Future(message = "Data de vencimento deve ser futura")
    private LocalDate dueDate;

    @Size(max = 200, message = "Instruções devem ter no máximo 200 caracteres")
    private String instructions;

    @Size(max = 200, message = "Descrição deve ter no máximo 200 caracteres")
    private String description;

    // Constructors
    public BoletoData() {}

    public BoletoData(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public BoletoData(LocalDate dueDate, String instructions, String description) {
        this.dueDate = dueDate;
        this.instructions = instructions;
        this.description = description;
    }

    // Getters and Setters
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    @Override
    public String toString() {
        return "BoletoData{" +
                "dueDate=" + dueDate +
                ", instructions='" + instructions + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
