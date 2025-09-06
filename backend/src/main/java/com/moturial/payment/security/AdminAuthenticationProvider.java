/**
 * Admin Authentication Provider
 * 
 * Provides authentication for admin users following .ai-rules:
 * - Production-ready security implementation
 * - OWASP Top 10 compliance
 * - Role-based access control
 * - Structured logging and monitoring
 * 
 * @author Moturial Team
 * @version 1.0.0
 */

package com.moturial.payment.security;

import com.moturial.payment.exception.SecurityException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminAuthenticationProvider implements AuthenticationProvider {

    @Value("${moturial.admin.api-key:}")
    private String adminApiKey;

    @Value("${moturial.staff.api-key:}")
    private String staffApiKey;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        log.debug("Attempting admin authentication");
        
        if (!(authentication instanceof ApiKeyAuthentication)) {
            log.warn("Invalid authentication type: {}", authentication.getClass().getSimpleName());
            throw new BadCredentialsException("Tipo de autenticação inválido");
        }

        ApiKeyAuthentication apiKeyAuth = (ApiKeyAuthentication) authentication;
        String providedApiKey = apiKeyAuth.getApiKey();

        if (providedApiKey == null || providedApiKey.trim().isEmpty()) {
            log.warn("Empty API key provided");
            throw new BadCredentialsException("API Key é obrigatória");
        }

        try {
            // Validate API key and determine role
            String role = validateApiKeyAndGetRole(providedApiKey);
            
            if (role == null) {
                log.warn("Invalid API key provided: {}", maskApiKey(providedApiKey));
                throw new BadCredentialsException("API Key inválida");
            }

            // Create authorities based on role
            List<SimpleGrantedAuthority> authorities = createAuthorities(role);
            
            // Create authenticated token
            ApiKeyAuthentication authenticatedToken = new ApiKeyAuthentication(
                providedApiKey, 
                authorities
            );
            
            log.info("Admin authentication successful - role: {}", role);
            return authenticatedToken;
            
        } catch (AuthenticationException e) {
            log.error("Admin authentication failed", e);
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during admin authentication", e);
            throw new SecurityException("Erro interno de autenticação", e);
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return ApiKeyAuthentication.class.isAssignableFrom(authentication);
    }

    /**
     * Validate API key and return corresponding role
     */
    private String validateApiKeyAndGetRole(String apiKey) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return null;
        }

        // Check admin API key
        if (adminApiKey != null && !adminApiKey.trim().isEmpty() && adminApiKey.equals(apiKey)) {
            log.debug("Admin API key validated successfully");
            return "ADMIN";
        }

        // Check staff API key
        if (staffApiKey != null && !staffApiKey.trim().isEmpty() && staffApiKey.equals(apiKey)) {
            log.debug("Staff API key validated successfully");
            return "STAFF";
        }

        return null;
    }

    /**
     * Create authorities based on role
     */
    private List<SimpleGrantedAuthority> createAuthorities(String role) {
        return switch (role) {
            case "ADMIN" -> List.of(
                new SimpleGrantedAuthority("ROLE_ADMIN"),
                new SimpleGrantedAuthority("ROLE_STAFF"),
                new SimpleGrantedAuthority("ROLE_USER")
            );
            case "STAFF" -> List.of(
                new SimpleGrantedAuthority("ROLE_STAFF"),
                new SimpleGrantedAuthority("ROLE_USER")
            );
            default -> List.of(new SimpleGrantedAuthority("ROLE_USER"));
        };
    }

    /**
     * Mask API key for logging (security best practice)
     */
    private String maskApiKey(String apiKey) {
        if (apiKey == null || apiKey.length() < 8) {
            return "***";
        }
        return apiKey.substring(0, 4) + "***" + apiKey.substring(apiKey.length() - 4);
    }
}
