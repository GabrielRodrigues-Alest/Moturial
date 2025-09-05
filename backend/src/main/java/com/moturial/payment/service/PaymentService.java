package com.moturial.payment.service;

import com.moturial.payment.domain.dto.PaymentRequest;
import com.moturial.payment.domain.dto.PaymentResult;
import com.moturial.payment.domain.entity.Payment;
import com.moturial.payment.exception.PaymentProcessingException;
import com.moturial.payment.exception.PaymentValidationException;
import com.moturial.payment.integration.StripeService;
import com.moturial.payment.repository.PaymentRepository;
import com.moturial.payment.validation.PaymentValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Serviço principal de processamento de pagamentos
 * 
 * Implementa a lógica de negócio para processamento seguro de pagamentos,
 * seguindo princípios SOLID e padrões de segurança OWASP.
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
@Service
@Transactional
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final StripeService stripeService;
    private final PaymentValidator paymentValidator;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, 
                         StripeService stripeService,
                         PaymentValidator paymentValidator) {
        this.paymentRepository = paymentRepository;
        this.stripeService = stripeService;
        this.paymentValidator = paymentValidator;
    }

    /**
     * Processa um pagamento com cartão
     */
    public PaymentResult processCardPayment(PaymentRequest request) {
        logger.info("Iniciando processamento de pagamento com cartão para usuário: {}", request.getUserId());

        try {
            // Validação rigorosa dos dados
            paymentValidator.validatePaymentRequest(request);
            paymentValidator.validateCardData(request.getCard());

            // Criar registro de pagamento
            Payment payment = createPaymentRecord(request);

            // Processar pagamento no Stripe
            PaymentResult result = stripeService.processCardPayment(request, request.getCard());

            // Atualizar registro com resultado
            updatePaymentRecord(payment, result);

            logger.info("Pagamento processado com sucesso. ID: {}, Status: {}", 
                       payment.getId(), result.getStatus());

            return result;

        } catch (PaymentValidationException e) {
            logger.warn("Falha na validação do pagamento com cartão: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Erro ao processar pagamento com cartão: {}", e.getMessage(), e);
            throw new PaymentProcessingException("Erro ao processar pagamento: " + e.getMessage(), e);
        }
    }

    /**
     * Processa um pagamento via PIX
     */
    public PaymentResult processPixPayment(PaymentRequest request) {
        logger.info("Iniciando processamento de pagamento PIX para usuário: {}", request.getUserId());

        try {
            // Validação dos dados
            paymentValidator.validatePaymentRequest(request);

            // Criar registro de pagamento
            Payment payment = createPaymentRecord(request);

            // Processar pagamento no Stripe
            PaymentResult result = stripeService.processPixPayment(request);

            // Atualizar registro com resultado
            updatePaymentRecord(payment, result);

            logger.info("Pagamento PIX processado com sucesso. ID: {}, Status: {}", 
                       payment.getId(), result.getStatus());

            return result;

        } catch (PaymentValidationException e) {
            logger.warn("Falha na validação do pagamento PIX: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Erro ao processar pagamento PIX: {}", e.getMessage(), e);
            throw new PaymentProcessingException("Erro ao processar pagamento PIX: " + e.getMessage(), e);
        }
    }

    /**
     * Recupera status de um pagamento
     */
    public PaymentResult getPaymentStatus(String externalId) {
        logger.info("Recuperando status do pagamento: {}", externalId);

        try {
            // Buscar no banco local
            Optional<Payment> paymentOpt = paymentRepository.findByExternalId(externalId);
            
            if (paymentOpt.isPresent()) {
                Payment payment = paymentOpt.get();
                
                // Se não é status final, consultar Stripe
                if (!payment.getStatus().isFinal()) {
                    PaymentResult result = stripeService.getPaymentStatus(externalId);
                    updatePaymentRecord(payment, result);
                    return result;
                }
                
                return mapToPaymentResult(payment);
            }

            // Se não encontrado localmente, consultar Stripe
            return stripeService.getPaymentStatus(externalId);

        } catch (PaymentValidationException e) {
            logger.warn("Falha na validação ao buscar status: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Erro ao recuperar status do pagamento: {}", e.getMessage(), e);
            throw new PaymentProcessingException("Erro ao recuperar status: " + e.getMessage(), e);
        }
    }

    /**
     * Cancela um pagamento
     */
    public PaymentResult cancelPayment(String externalId) {
        logger.info("Cancelando pagamento: {}", externalId);

        try {
            // Buscar pagamento
            Payment payment = paymentRepository.findByExternalId(externalId)
                .orElseThrow(() -> new PaymentValidationException("Pagamento não encontrado"));

            // Validar se pode ser cancelado
            if (payment.getStatus().isFinal()) {
                throw new PaymentValidationException("Pagamento não pode ser cancelado");
            }

            // Cancelar no Stripe
            PaymentResult result = stripeService.cancelPayment(externalId);

            // Atualizar registro
            updatePaymentRecord(payment, result);

            logger.info("Pagamento cancelado com sucesso. ID: {}", payment.getId());

            return result;

        } catch (PaymentValidationException e) {
            logger.warn("Falha na validação ao cancelar pagamento: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Erro ao cancelar pagamento: {}", e.getMessage(), e);
            throw new PaymentProcessingException("Erro ao cancelar pagamento: " + e.getMessage(), e);
        }
    }

    /**
     * Lista pagamentos de um usuário
     */
    public List<Payment> getUserPayments(String userId) {
        logger.info("Listando pagamentos do usuário: {}", userId);
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Busca pagamento por ID interno
     */
    public Optional<Payment> getPaymentById(UUID id) {
        return paymentRepository.findById(id);
    }

    /**
     * Busca pagamento por ID externo
     */
    public Optional<Payment> getPaymentByExternalId(String externalId) {
        return paymentRepository.findByExternalId(externalId);
    }

    private Payment createPaymentRecord(PaymentRequest request) {
        Payment payment = new Payment(
            UUID.randomUUID().toString(), // externalId temporário
            request.getUserId(),
            request.getAmount(),
            request.getCurrency(),
            request.getPaymentMethod(),
            request.getInstallments(),
            request.getDescription()
        );

        return paymentRepository.save(payment);
    }

    private void updatePaymentRecord(Payment payment, PaymentResult result) {
        payment.setExternalId(result.getExternalId());
        payment.setStatus(result.getStatus());
        payment.setProcessedAt(LocalDateTime.now());
        
        if (StringUtils.hasText(result.getErrorMessage())) {
            payment.setErrorMessage(result.getErrorMessage());
        }

        if (result.getMetadata() != null) {
            payment.setMetadata(result.getMetadata().toString());
        }

        paymentRepository.save(payment);
    }

    private PaymentResult mapToPaymentResult(Payment payment) {
        return PaymentResult.builder()
            .externalId(payment.getExternalId())
            .status(payment.getStatus())
            .amount(payment.getAmount())
            .currency(payment.getCurrency())
            .paymentMethod(payment.getPaymentMethod())
            .installments(payment.getInstallments())
            .description(payment.getDescription())
            .errorMessage(payment.getErrorMessage())
            .build();
    }
}
