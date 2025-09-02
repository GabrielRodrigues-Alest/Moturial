package com.moturial.payment.controller;

import com.moturial.payment.domain.dto.PaymentRequest;
import com.moturial.payment.domain.dto.PaymentResult;
import com.moturial.payment.domain.entity.Payment;
import com.moturial.payment.domain.enums.PaymentMethod;
import com.moturial.payment.exception.PaymentProcessingException;
import com.moturial.payment.exception.PaymentValidationException;
import com.moturial.payment.service.PaymentService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controlador REST para operações de pagamento
 * 
 * Implementa endpoints seguros com validações rigorosas
 * e tratamento abrangente de erros.
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/payments")
@Validated
@CrossOrigin(origins = "${security.cors.allowed-origins}")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Processa pagamento com cartão
     */
    @PostMapping("/card")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PaymentResult> processCardPayment(@Valid @RequestBody PaymentRequest request) {
        logger.info("Recebida requisição de pagamento com cartão para usuário: {}", request.getUserId());

        try {
            // Validar método de pagamento
            if (request.getPaymentMethod() != PaymentMethod.CARD) {
                throw new PaymentValidationException("Método de pagamento deve ser CARD");
            }

            PaymentResult result = paymentService.processCardPayment(request);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(result);

        } catch (PaymentValidationException e) {
            logger.warn("Erro de validação: {}", e.getMessage());
            throw e;
        } catch (PaymentProcessingException e) {
            logger.error("Erro de processamento: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Erro inesperado: {}", e.getMessage(), e);
            throw new PaymentProcessingException("Erro interno do servidor", e);
        }
    }

    /**
     * Processa pagamento via PIX
     */
    @PostMapping("/pix")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PaymentResult> processPixPayment(@Valid @RequestBody PaymentRequest request) {
        logger.info("Recebida requisição de pagamento PIX para usuário: {}", request.getUserId());

        try {
            // Validar método de pagamento
            if (request.getPaymentMethod() != PaymentMethod.PIX) {
                throw new PaymentValidationException("Método de pagamento deve ser PIX");
            }

            PaymentResult result = paymentService.processPixPayment(request);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(result);

        } catch (PaymentValidationException e) {
            logger.warn("Erro de validação: {}", e.getMessage());
            throw e;
        } catch (PaymentProcessingException e) {
            logger.error("Erro de processamento: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Erro inesperado: {}", e.getMessage(), e);
            throw new PaymentProcessingException("Erro interno do servidor", e);
        }
    }

    /**
     * Recupera status de um pagamento
     */
    @GetMapping("/{externalId}/status")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PaymentResult> getPaymentStatus(@PathVariable String externalId) {
        logger.info("Recebida requisição de status para pagamento: {}", externalId);

        try {
            PaymentResult result = paymentService.getPaymentStatus(externalId);
            return ResponseEntity.ok(result);

        } catch (PaymentValidationException e) {
            logger.warn("Erro de validação: {}", e.getMessage());
            throw e;
        } catch (PaymentProcessingException e) {
            logger.error("Erro de processamento: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Erro inesperado: {}", e.getMessage(), e);
            throw new PaymentProcessingException("Erro interno do servidor", e);
        }
    }

    /**
     * Cancela um pagamento
     */
    @PostMapping("/{externalId}/cancel")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PaymentResult> cancelPayment(@PathVariable String externalId) {
        logger.info("Recebida requisição de cancelamento para pagamento: {}", externalId);

        try {
            PaymentResult result = paymentService.cancelPayment(externalId);
            return ResponseEntity.ok(result);

        } catch (PaymentValidationException e) {
            logger.warn("Erro de validação: {}", e.getMessage());
            throw e;
        } catch (PaymentProcessingException e) {
            logger.error("Erro de processamento: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Erro inesperado: {}", e.getMessage(), e);
            throw new PaymentProcessingException("Erro interno do servidor", e);
        }
    }

    /**
     * Lista pagamentos de um usuário
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Payment>> getUserPayments(@PathVariable String userId) {
        logger.info("Recebida requisição de listagem de pagamentos para usuário: {}", userId);

        try {
            List<Payment> payments = paymentService.getUserPayments(userId);
            return ResponseEntity.ok(payments);

        } catch (Exception e) {
            logger.error("Erro ao listar pagamentos: {}", e.getMessage(), e);
            throw new PaymentProcessingException("Erro ao listar pagamentos", e);
        }
    }

    /**
     * Busca pagamento por ID interno
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Payment> getPaymentById(@PathVariable UUID id) {
        logger.info("Recebida requisição de busca de pagamento por ID: {}", id);

        try {
            return paymentService.getPaymentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());

        } catch (Exception e) {
            logger.error("Erro ao buscar pagamento: {}", e.getMessage(), e);
            throw new PaymentProcessingException("Erro ao buscar pagamento", e);
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Payment service is running");
    }
}
