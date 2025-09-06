package com.moturial.payment.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro que intercepta todas as requisições para extrair e validar a chave de API.
 * A chave é esperada no cabeçalho 'X-API-KEY'.
 */
@RequiredArgsConstructor
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {

    private static final String API_KEY_HEADER = "X-API-KEY";
    private final AuthenticationManager authenticationManager;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String apiKey = request.getHeader(API_KEY_HEADER);

        if (apiKey == null) {
            // Se não há chave, continua a cadeia de filtros.
            // Outros mecanismos de segurança podem ser aplicados ou o acesso pode ser público.
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Cria um token de autenticação com a chave extraída.
            Authentication authenticationRequest = new ApiKeyAuthentication(apiKey);
            
            // Delega a autenticação para o AuthenticationManager (que usará nosso ApiKeyAuthenticationProvider).
            Authentication authenticationResult = authenticationManager.authenticate(authenticationRequest);

            // Se a autenticação for bem-sucedida, define o objeto de autenticação no contexto de segurança.
            SecurityContextHolder.getContext().setAuthentication(authenticationResult);
            
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            // Em caso de falha na autenticação, limpa o contexto e retorna um erro 401 Unauthorized.
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "API Key inválida ou ausente");
        }
    }
}
