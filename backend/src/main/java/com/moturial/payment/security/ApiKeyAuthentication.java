package com.moturial.payment.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 * Representa um token de autenticação para uma chave de API dentro do contexto de segurança do Spring.
 * Este objeto carrega a chave de API e o status de autenticação.
 */
public class ApiKeyAuthentication extends AbstractAuthenticationToken {

    private final String apiKey;

    /**
     * Construtor para um token autenticado.
     * @param apiKey A chave de API validada.
     * @param authorities As permissões concedidas a esta chave.
     */
    public ApiKeyAuthentication(String apiKey, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.apiKey = apiKey;
        setAuthenticated(true);
    }

    /**
     * Construtor para um token não autenticado, usado para transportar a chave extraída do request.
     * @param apiKey A chave de API extraída do cabeçalho da requisição.
     */
    public ApiKeyAuthentication(String apiKey) {
        super(null);
        this.apiKey = apiKey;
        setAuthenticated(false);
    }

    @Override
    public Object getCredentials() {
        // Credenciais não são necessárias para autenticação baseada em token.
        return null;
    }

    @Override
    public Object getPrincipal() {
        // O principal é a própria chave de API.
        return apiKey;
    }

    /**
     * Retorna a chave de API.
     * @return A chave de API.
     */
    public String getApiKey() {
        return apiKey;
    }
}
