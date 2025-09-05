package com.moturial.payment.domain.enums;

/**
 * Enum que representa os métodos de pagamento suportados pelo sistema
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
public enum PaymentMethodType {
    
    /**
     * Pagamento com cartão de crédito/débito
     */
    CARD("card", "Cartão de Crédito/Débito"),
    
    /**
     * Pagamento via PIX
     */
    PIX("pix", "PIX"),
    
    /**
     * Pagamento via boleto bancário
     */
    BOLETO("boleto", "Boleto Bancário");

    private final String code;
    private final String description;

    PaymentMethodType(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static PaymentMethodType fromCode(String code) {
        for (PaymentMethodType method : values()) {
            if (method.code.equalsIgnoreCase(code)) {
                return method;
            }
        }
        throw new IllegalArgumentException("Método de pagamento inválido: " + code);
    }

    @Override
    public String toString() {
        return code;
    }
}
