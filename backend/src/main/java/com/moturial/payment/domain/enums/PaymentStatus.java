package com.moturial.payment.domain.enums;

/**
 * Enum que representa os status possíveis de um pagamento
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
public enum PaymentStatus {
    
    /**
     * Pagamento pendente de processamento
     */
    PENDING("pending", "Pendente"),
    
    /**
     * Pagamento processando
     */
    PROCESSING("processing", "Processando"),
    
    /**
     * Pagamento aprovado
     */
    APPROVED("approved", "Aprovado"),
    
    /**
     * Pagamento rejeitado
     */
    REJECTED("rejected", "Rejeitado"),
    
    /**
     * Pagamento cancelado
     */
    CANCELLED("cancelled", "Cancelado"),
    
    /**
     * Pagamento com erro
     */
    ERROR("error", "Erro"),
    
    /**
     * Pagamento reembolsado
     */
    REFUNDED("refunded", "Reembolsado"),
    
    /**
     * Pagamento parcialmente reembolsado
     */
    PARTIALLY_REFUNDED("partially_refunded", "Parcialmente Reembolsado");

    private final String code;
    private final String description;

    PaymentStatus(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static PaymentStatus fromCode(String code) {
        for (PaymentStatus status : values()) {
            if (status.code.equalsIgnoreCase(code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Status de pagamento inválido: " + code);
    }

    public boolean isFinal() {
        return this == APPROVED || this == REJECTED || this == CANCELLED || 
               this == ERROR || this == REFUNDED || this == PARTIALLY_REFUNDED;
    }

    public boolean isSuccessful() {
        return this == APPROVED;
    }

    public boolean isFailed() {
        return this == REJECTED || this == CANCELLED || this == ERROR;
    }

    @Override
    public String toString() {
        return code;
    }
}
