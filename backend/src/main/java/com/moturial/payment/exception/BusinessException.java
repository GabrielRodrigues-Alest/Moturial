package com.moturial.payment.exception;

/**
 * Business logic exception for domain-specific errors.
 * Used when business rules are violated or invalid operations are attempted.
 */
public class BusinessException extends RuntimeException {
    
    public BusinessException(String message) {
        super(message);
    }
    
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }
}
