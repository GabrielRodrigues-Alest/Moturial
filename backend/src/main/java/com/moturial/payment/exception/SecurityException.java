/**
 * Security Exception
 * 
 * Custom exception for security-related errors following .ai-rules:
 * - Structured error handling
 * - Security-focused error messages
 * - Production-ready exception design
 * 
 * @author Moturial Team
 * @version 1.0.0
 */

package com.moturial.payment.exception;

public class SecurityException extends RuntimeException {

    public SecurityException(String message) {
        super(message);
    }

    public SecurityException(String message, Throwable cause) {
        super(message, cause);
    }
}
