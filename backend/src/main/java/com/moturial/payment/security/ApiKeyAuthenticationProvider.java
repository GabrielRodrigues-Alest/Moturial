package com.moturial.payment.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collections;

/**
 * Provedor de autenticação que valida a chave de API.
 * Compara a chave fornecida na requisição com a chave segura configurada na aplicação.
 */
@Component
public class ApiKeyAuthenticationProvider implements AuthenticationProvider {

    @Value("${security.api.key}")
    private String validApiKey;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String apiKey = (String) authentication.getPrincipal();

        if (validApiKey.equals(apiKey)) {
            // Chave válida, retorna um token autenticado com a role padrão para APIs.
            return new ApiKeyAuthentication(apiKey, Collections.singleton(new SimpleGrantedAuthority("ROLE_API_USER")));
        } else {
            // Chave inválida, lança exceção.
            throw new BadCredentialsException("Invalid API Key");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        // Indica que este provedor suporta apenas tokens do tipo ApiKeyAuthentication.
        return ApiKeyAuthentication.class.equals(authentication);
    }
}
