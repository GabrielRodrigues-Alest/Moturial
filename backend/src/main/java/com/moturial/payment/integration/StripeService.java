package com.moturial.payment.integration;

import com.moturial.payment.domain.dto.PaymentRequest;
import com.moturial.payment.domain.dto.CardData;
import com.moturial.payment.domain.dto.CustomerData;
import com.moturial.payment.domain.enums.PaymentMethod;
import com.moturial.payment.domain.enums.PaymentStatus;
import com.moturial.payment.exception.PaymentProcessingException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentMethod;
import com.stripe.model.Customer;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentMethodCreateParams;
import com.stripe.param.CustomerCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * Serviço de integração com Stripe
 * 
 * Implementa operações seguras de pagamento com retry logic
 * e tratamento robusto de erros.
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
@Service
public class StripeService {

    private static final Logger logger = LoggerFactory.getLogger(StripeService.class);

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${stripe.currency:BRL}")
    private String defaultCurrency;

    /**
     * Processa pagamento com cartão de crédito/débito
     */
    @Retryable(
        value = {StripeException.class},
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    public PaymentResult processCardPayment(PaymentRequest request, CardData cardData) {
        try {
            Stripe.apiKey = stripeSecretKey;

            // Criar ou recuperar cliente
            Customer customer = createOrRetrieveCustomer(request.getCustomer());

            // Criar método de pagamento
            PaymentMethod paymentMethod = createPaymentMethod(cardData);

            // Vincular método de pagamento ao cliente
            paymentMethod.attach(PaymentMethod.AttachParams.builder()
                .setCustomer(customer.getId())
                .build());

            // Criar PaymentIntent
            PaymentIntentCreateParams.Builder paramsBuilder = PaymentIntentCreateParams.builder()
                .setAmount(convertToCents(request.getAmount()))
                .setCurrency(request.getCurrency().toLowerCase())
                .setCustomer(customer.getId())
                .setPaymentMethod(paymentMethod.getId())
                .setConfirm(true)
                .setDescription(request.getDescription())
                .setMetadata(createMetadata(request));

            if (request.getInstallments() > 1) {
                paramsBuilder.setPaymentMethodOptions(PaymentIntentCreateParams.PaymentMethodOptions.builder()
                    .setCard(PaymentIntentCreateParams.PaymentMethodOptions.Card.builder()
                        .setInstallments(PaymentIntentCreateParams.PaymentMethodOptions.Card.Installments.builder()
                            .setPlan(PaymentIntentCreateParams.PaymentMethodOptions.Card.Installments.Plan.FIXED_COUNT)
                            .setCount(request.getInstallments())
                            .build())
                        .build())
                    .build());
            }

            PaymentIntent paymentIntent = PaymentIntent.create(paramsBuilder.build());

            return PaymentResult.builder()
                .externalId(paymentIntent.getId())
                .status(mapStripeStatus(paymentIntent.getStatus()))
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .paymentMethod(PaymentMethod.CARD)
                .installments(request.getInstallments())
                .description(request.getDescription())
                .metadata(paymentIntent.getMetadata())
                .build();

        } catch (StripeException e) {
            logger.error("Erro ao processar pagamento com cartão: {}", e.getMessage(), e);
            throw new PaymentProcessingException("Erro ao processar pagamento: " + e.getMessage(), e);
        }
    }

    /**
     * Processa pagamento via PIX
     */
    @Retryable(
        value = {StripeException.class},
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    public PaymentResult processPixPayment(PaymentRequest request) {
        try {
            Stripe.apiKey = stripeSecretKey;

            Customer customer = createOrRetrieveCustomer(request.getCustomer());

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(convertToCents(request.getAmount()))
                .setCurrency(request.getCurrency().toLowerCase())
                .setCustomer(customer.getId())
                .setPaymentMethodTypes(java.util.Arrays.asList("pix"))
                .setDescription(request.getDescription())
                .setMetadata(createMetadata(request))
                .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            return PaymentResult.builder()
                .externalId(paymentIntent.getId())
                .status(mapStripeStatus(paymentIntent.getStatus()))
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .paymentMethod(PaymentMethod.PIX)
                .installments(1)
                .description(request.getDescription())
                .metadata(paymentIntent.getMetadata())
                .pixQrCode(paymentIntent.getNextAction() != null ? 
                    paymentIntent.getNextAction().getPixDisplayQrCode().getImageUrlPng() : null)
                .pixCopyPaste(paymentIntent.getNextAction() != null ? 
                    paymentIntent.getNextAction().getPixDisplayQrCode().getData() : null)
                .build();

        } catch (StripeException e) {
            logger.error("Erro ao processar pagamento PIX: {}", e.getMessage(), e);
            throw new PaymentProcessingException("Erro ao processar pagamento PIX: " + e.getMessage(), e);
        }
    }

    /**
     * Recupera status de um pagamento
     */
    public PaymentResult getPaymentStatus(String paymentIntentId) {
        try {
            Stripe.apiKey = stripeSecretKey;
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);

            return PaymentResult.builder()
                .externalId(paymentIntent.getId())
                .status(mapStripeStatus(paymentIntent.getStatus()))
                .amount(convertFromCents(paymentIntent.getAmount()))
                .currency(paymentIntent.getCurrency().toUpperCase())
                .paymentMethod(mapStripePaymentMethod(paymentIntent.getPaymentMethodTypes().get(0)))
                .description(paymentIntent.getDescription())
                .metadata(paymentIntent.getMetadata())
                .build();

        } catch (StripeException e) {
            logger.error("Erro ao recuperar status do pagamento: {}", e.getMessage(), e);
            throw new PaymentProcessingException("Erro ao recuperar status: " + e.getMessage(), e);
        }
    }

    /**
     * Cancela um pagamento
     */
    public PaymentResult cancelPayment(String paymentIntentId) {
        try {
            Stripe.apiKey = stripeSecretKey;
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            paymentIntent = paymentIntent.cancel();

            return PaymentResult.builder()
                .externalId(paymentIntent.getId())
                .status(PaymentStatus.CANCELLED)
                .amount(convertFromCents(paymentIntent.getAmount()))
                .currency(paymentIntent.getCurrency().toUpperCase())
                .description(paymentIntent.getDescription())
                .metadata(paymentIntent.getMetadata())
                .build();

        } catch (StripeException e) {
            logger.error("Erro ao cancelar pagamento: {}", e.getMessage(), e);
            throw new PaymentProcessingException("Erro ao cancelar pagamento: " + e.getMessage(), e);
        }
    }

    private Customer createOrRetrieveCustomer(CustomerData customerData) throws StripeException {
        // Buscar cliente existente por email
        Map<String, Object> params = new HashMap<>();
        params.put("email", customerData.getEmail());
        
        var customers = Customer.list(params);
        if (!customers.getData().isEmpty()) {
            return customers.getData().get(0);
        }

        // Criar novo cliente
        CustomerCreateParams.Builder paramsBuilder = CustomerCreateParams.builder()
            .setEmail(customerData.getEmail())
            .setName(customerData.getName());

        if (StringUtils.hasText(customerData.getPhone())) {
            paramsBuilder.setPhone(customerData.getPhone());
        }

        return Customer.create(paramsBuilder.build());
    }

    private PaymentMethod createPaymentMethod(CardData cardData) throws StripeException {
        PaymentMethodCreateParams.Builder paramsBuilder = PaymentMethodCreateParams.builder()
            .setType(PaymentMethodCreateParams.Type.CARD);

        if (StringUtils.hasText(cardData.getToken())) {
            paramsBuilder.setCard(PaymentMethodCreateParams.Card.builder()
                .setToken(cardData.getToken())
                .build());
        } else {
            paramsBuilder.setCard(PaymentMethodCreateParams.Card.builder()
                .setNumber(cardData.getNumber())
                .setExpMonth(Long.parseLong(cardData.getExpiryDate().split("/")[0]))
                .setExpYear(Long.parseLong("20" + cardData.getExpiryDate().split("/")[1]))
                .setCvc(cardData.getCvv())
                .build());
        }

        return PaymentMethod.create(paramsBuilder.build());
    }

    private Map<String, String> createMetadata(PaymentRequest request) {
        Map<String, String> metadata = new HashMap<>();
        metadata.put("user_id", request.getUserId());
        metadata.put("payment_method", request.getPaymentMethod().getCode());
        metadata.put("installments", String.valueOf(request.getInstallments()));
        
        if (request.getMetadata() != null) {
            request.getMetadata().forEach((key, value) -> 
                metadata.put(key, value != null ? value.toString() : ""));
        }
        
        return metadata;
    }

    private long convertToCents(BigDecimal amount) {
        return amount.multiply(BigDecimal.valueOf(100)).longValue();
    }

    private BigDecimal convertFromCents(long amount) {
        return BigDecimal.valueOf(amount).divide(BigDecimal.valueOf(100));
    }

    private PaymentStatus mapStripeStatus(String stripeStatus) {
        return switch (stripeStatus) {
            case "succeeded" -> PaymentStatus.APPROVED;
            case "processing" -> PaymentStatus.PROCESSING;
            case "requires_payment_method", "requires_confirmation", "requires_action" -> PaymentStatus.PENDING;
            case "canceled" -> PaymentStatus.CANCELLED;
            default -> PaymentStatus.ERROR;
        };
    }

    private PaymentMethod mapStripePaymentMethod(String stripePaymentMethod) {
        return switch (stripePaymentMethod) {
            case "card" -> PaymentMethod.CARD;
            case "pix" -> PaymentMethod.PIX;
            case "boleto" -> PaymentMethod.BOLETO;
            default -> PaymentMethod.CARD;
        };
    }
}
