/**
 * Validation Groups for Bean Validation
 * 
 * Defines validation groups for different operations following .ai-rules:
 * - Clear separation of validation contexts
 * - Production-ready validation strategy
 * - Type-safe group definitions
 * 
 * @author Moturial Team
 * @version 1.0.0
 */

package com.moturial.payment.validation;

/**
 * Validation groups for different CRUD operations
 */
public final class ValidationGroups {

    private ValidationGroups() {
        // Utility class - prevent instantiation
    }

    /**
     * Validation group for create operations
     */
    public interface Create {
    }

    /**
     * Validation group for update operations
     */
    public interface Update {
    }

    /**
     * Validation group for delete operations
     */
    public interface Delete {
    }

    /**
     * Validation group for admin-specific operations
     */
    public interface Admin {
    }

    /**
     * Validation group for user-specific operations
     */
    public interface User {
    }

    /**
     * Validation group for payment operations
     */
    public interface Payment {
    }

    /**
     * Validation group for rental operations
     */
    public interface Rental {
    }

    /**
     * Validation group for motorcycle operations
     */
    public interface Motorcycle {
    }
}
