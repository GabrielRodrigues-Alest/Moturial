package com.moturial.payment.exception;

/**
 * Exceção para erros de processamento de pagamento
 * 
 * Segue o padrão Problem Details (RFC 7807) para APIs HTTP
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
public class PaymentProcessingException extends RuntimeException {

    private final String errorCode;
    private final String externalErrorCode;

    public PaymentProcessingException(String message) {
        super(message);
        this.errorCode = "PROCESSING_ERROR";
        this.externalErrorCode = null;
    }

    public PaymentProcessingException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
        this.externalErrorCode = null;
    }

    public PaymentProcessingException(String message, String errorCode, String externalErrorCode) {
        super(message);
        this.errorCode = errorCode;
        this.externalErrorCode = externalErrorCode;
    }

    public PaymentProcessingException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "PROCESSING_ERROR";
        this.externalErrorCode = null;
    }

    public PaymentProcessingException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.externalErrorCode = null;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getExternalErrorCode() {
        return externalErrorCode;
    }
}
