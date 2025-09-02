package com.moturial.payment.exception;

/**
 * Exceção para erros de validação de pagamento
 * 
 * Segue o padrão Problem Details (RFC 7807) para APIs HTTP
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
public class PaymentValidationException extends RuntimeException {

    private final String errorCode;
    private final String field;

    public PaymentValidationException(String message) {
        super(message);
        this.errorCode = "VALIDATION_ERROR";
        this.field = null;
    }

    public PaymentValidationException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
        this.field = null;
    }

    public PaymentValidationException(String message, String errorCode, String field) {
        super(message);
        this.errorCode = errorCode;
        this.field = field;
    }

    public PaymentValidationException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "VALIDATION_ERROR";
        this.field = null;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getField() {
        return field;
    }
}
