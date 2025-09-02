package com.moturial.payment.domain.dto;

import jakarta.validation.constraints.*;

/**
 * DTO para dados de cartão de crédito/débito
 * 
 * Implementa validações rigorosas seguindo padrões PCI DSS
 * para segurança de dados de cartão.
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
public class CardData {

    @NotBlank(message = "Número do cartão é obrigatório")
    @Pattern(regexp = "^[0-9]{13,19}$", message = "Número do cartão deve ter entre 13 e 19 dígitos")
    private String number;

    @NotBlank(message = "Nome do titular é obrigatório")
    @Size(min = 2, max = 100, message = "Nome do titular deve ter entre 2 e 100 caracteres")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s]+$", message = "Nome do titular contém caracteres inválidos")
    private String holderName;

    @NotBlank(message = "Data de expiração é obrigatória")
    @Pattern(regexp = "^(0[1-9]|1[0-2])/([0-9]{2})$", message = "Data de expiração deve estar no formato MM/YY")
    private String expiryDate;

    @NotBlank(message = "CVV é obrigatório")
    @Pattern(regexp = "^[0-9]{3,4}$", message = "CVV deve ter 3 ou 4 dígitos")
    private String cvv;

    @Size(max = 255, message = "Token do cartão deve ter no máximo 255 caracteres")
    private String token;

    // Constructors
    public CardData() {}

    public CardData(String number, String holderName, String expiryDate, String cvv) {
        this.number = number;
        this.holderName = holderName;
        this.expiryDate = expiryDate;
        this.cvv = cvv;
    }

    public CardData(String token) {
        this.token = token;
    }

    // Getters and Setters
    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }

    public String getHolderName() { return holderName; }
    public void setHolderName(String holderName) { this.holderName = holderName; }

    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }

    public String getCvv() { return cvv; }
    public void setCvv(String cvv) { this.cvv = cvv; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    /**
     * Valida se o cartão é válido usando algoritmo de Luhn
     */
    public boolean isValidCardNumber() {
        if (number == null || number.trim().isEmpty()) {
            return false;
        }

        String cleanNumber = number.replaceAll("\\s", "");
        if (!cleanNumber.matches("^[0-9]{13,19}$")) {
            return false;
        }

        int sum = 0;
        boolean alternate = false;
        
        for (int i = cleanNumber.length() - 1; i >= 0; i--) {
            int n = Integer.parseInt(cleanNumber.substring(i, i + 1));
            if (alternate) {
                n *= 2;
                if (n > 9) {
                    n = (n % 10) + 1;
                }
            }
            sum += n;
            alternate = !alternate;
        }
        
        return (sum % 10 == 0);
    }

    /**
     * Valida se a data de expiração não está vencida
     */
    public boolean isExpiryDateValid() {
        if (expiryDate == null || !expiryDate.matches("^(0[1-9]|1[0-2])/([0-9]{2})$")) {
            return false;
        }

        try {
            String[] parts = expiryDate.split("/");
            int month = Integer.parseInt(parts[0]);
            int year = Integer.parseInt(parts[1]) + 2000;

            java.time.YearMonth expiry = java.time.YearMonth.of(year, month);
            java.time.YearMonth current = java.time.YearMonth.now();

            return !expiry.isBefore(current);
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public String toString() {
        return "CardData{" +
                "number='" + (number != null ? "****" + number.substring(Math.max(0, number.length() - 4)) : "null") + '\'' +
                ", holderName='" + holderName + '\'' +
                ", expiryDate='" + expiryDate + '\'' +
                ", cvv='***'" +
                ", token='" + (token != null ? "***" : "null") + '\'' +
                '}';
    }
}
