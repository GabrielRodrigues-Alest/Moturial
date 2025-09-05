package com.moturial.payment.config;

import com.moturial.payment.exception.PaymentProcessingException;
import com.moturial.payment.exception.PaymentValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Configuração web com tratamento de erros e interceptors
 * 
 * Implementa logging estruturado, correlação de requests e tratamento de exceções
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
@Configuration
@ControllerAdvice
public class WebConfig implements WebMvcConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(WebConfig.class);

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new RequestLoggingInterceptor());
    }

    /**
     * Interceptor para logging de requests
     */
    public static class RequestLoggingInterceptor implements HandlerInterceptor {

        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
            String correlationId = UUID.randomUUID().toString();
            request.setAttribute("correlationId", correlationId);
            request.setAttribute("startTime", System.currentTimeMillis());
            
            logger.info("Request iniciado", Map.of(
                "correlationId", correlationId,
                "method", request.getMethod(),
                "uri", request.getRequestURI(),
                "userAgent", request.getHeader("User-Agent"),
                "remoteAddr", request.getRemoteAddr()
            ));
            
            return true;
        }

        @Override
        public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
            String correlationId = (String) request.getAttribute("correlationId");
            long startTime = (Long) request.getAttribute("startTime");
            long duration = System.currentTimeMillis() - startTime;
            
            logger.info("Request finalizado", Map.of(
                "correlationId", correlationId,
                "method", request.getMethod(),
                "uri", request.getRequestURI(),
                "status", response.getStatus(),
                "duration", duration
            ));
        }
    }

    /**
     * Tratamento de exceções de validação
     */
    @ExceptionHandler(PaymentValidationException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(PaymentValidationException ex, HttpServletRequest request) {
        String correlationId = (String) request.getAttribute("correlationId");
        
        logger.warn("Erro de validação", Map.of(
            "correlationId", correlationId,
            "error", ex.getMessage(),
            "errorCode", ex.getErrorCode(),
            "field", ex.getField()
        ));

        Map<String, Object> errorResponse = createErrorResponse(
            "https://moturial.com/errors/validation",
            "Erro de Validação",
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            request.getRequestURI(),
            correlationId,
            ex.getErrorCode(),
            ex.getField()
        );

        return ResponseEntity.badRequest().body(errorResponse);
    }

    /**
     * Tratamento de exceções de processamento
     */
    @ExceptionHandler(PaymentProcessingException.class)
    public ResponseEntity<Map<String, Object>> handleProcessingException(PaymentProcessingException ex, HttpServletRequest request) {
        String correlationId = (String) request.getAttribute("correlationId");
        
        logger.error("Erro de processamento", Map.of(
            "correlationId", correlationId,
            "error", ex.getMessage(),
            "errorCode", ex.getErrorCode(),
            "externalErrorCode", ex.getExternalErrorCode()
        ));

        Map<String, Object> errorResponse = createErrorResponse(
            "https://moturial.com/errors/processing",
            "Erro de Processamento",
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Erro interno do servidor",
            request.getRequestURI(),
            correlationId,
            ex.getErrorCode(),
            ex.getExternalErrorCode()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    /**
     * Tratamento de exceções genéricas
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex, HttpServletRequest request) {
        String correlationId = (String) request.getAttribute("correlationId");
        
        logger.error("Erro não tratado", Map.of(
            "correlationId", correlationId,
            "error", ex.getMessage(),
            "exception", ex.getClass().getSimpleName()
        ));

        Map<String, Object> errorResponse = createErrorResponse(
            "https://moturial.com/errors/internal",
            "Erro Interno",
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Erro interno do servidor",
            request.getRequestURI(),
            correlationId,
            "INTERNAL_ERROR",
            null
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    /**
     * Cria resposta de erro no formato Problem Details (RFC 7807)
     */
    private Map<String, Object> createErrorResponse(
            String type,
            String title,
            int status,
            String detail,
            String instance,
            String correlationId,
            String errorCode,
            String field) {
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("type", type);
        errorResponse.put("title", title);
        errorResponse.put("status", status);
        errorResponse.put("detail", detail);
        errorResponse.put("instance", instance);
        errorResponse.put("timestamp", LocalDateTime.now().toString());
        errorResponse.put("correlationId", correlationId);
        
        if (errorCode != null) {
            errorResponse.put("errorCode", errorCode);
        }
        
        if (field != null) {
            errorResponse.put("field", field);
        }
        
        return errorResponse;
    }
}
