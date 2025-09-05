package com.moturial.payment.service;

import com.moturial.payment.domain.dto.*;
import com.moturial.payment.domain.entity.Payment;
import com.moturial.payment.domain.enums.PaymentMethodType;
import com.moturial.payment.domain.enums.PaymentStatus;
import com.moturial.payment.exception.PaymentProcessingException;
import com.moturial.payment.exception.PaymentValidationException;
import com.moturial.payment.integration.StripeService;
import com.moturial.payment.repository.PaymentRepository;
import com.moturial.payment.validation.PaymentValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Testes unitários para PaymentService
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private StripeService stripeService;

    @Mock
    private PaymentValidator paymentValidator;

    @InjectMocks
    private PaymentService paymentService;

    private PaymentRequest validPaymentRequest;
    private CardData validCardData;
    private CustomerData validCustomerData;
    private PaymentResult validPaymentResult;
    private Payment validPayment;

    @BeforeEach
    void setUp() {
        // Setup dados válidos
        validCustomerData = new CustomerData("João Silva", "joao@email.com");
        validCardData = new CardData("4242424242424242", "João Silva", "12/25", "123");
        
        validPaymentRequest = new PaymentRequest();
        validPaymentRequest.setUserId("user123");
        validPaymentRequest.setAmount(new BigDecimal("100.00"));
        validPaymentRequest.setCurrency("BRL");
                validPaymentRequest.setPaymentMethod(PaymentMethodType.CARD);
        validPaymentRequest.setInstallments(1);
        validPaymentRequest.setDescription("Teste de pagamento");
        validPaymentRequest.setCustomer(validCustomerData);
        validPaymentRequest.setCard(validCardData);

        validPaymentResult = PaymentResult.builder()
            .externalId("pi_test123")
            .status(PaymentStatus.APPROVED)
            .amount(new BigDecimal("100.00"))
            .currency("BRL")
                        .paymentMethod(PaymentMethodType.CARD)
            .installments(1)
            .description("Teste de pagamento")
            .build();

        validPayment = new Payment();
        validPayment.setId(UUID.randomUUID());
        validPayment.setExternalId("pi_test123");
        validPayment.setUserId("user123");
        validPayment.setAmount(new BigDecimal("100.00"));
        validPayment.setCurrency("BRL");
                validPayment.setPaymentMethod(PaymentMethodType.CARD);
        validPayment.setStatus(PaymentStatus.APPROVED);
        validPayment.setInstallments(1);
        validPayment.setDescription("Teste de pagamento");
    }

    @Test
    void processCardPayment_Success() {
        // Arrange
        when(paymentRepository.save(any(Payment.class))).thenReturn(validPayment);
        when(stripeService.processCardPayment(any(), any())).thenReturn(validPaymentResult);

        // Act
        PaymentResult result = paymentService.processCardPayment(validPaymentRequest);

        // Assert
        assertNotNull(result);
        assertEquals(PaymentStatus.APPROVED, result.getStatus());
        assertEquals("pi_test123", result.getExternalId());
        assertEquals(new BigDecimal("100.00"), result.getAmount());
        assertEquals("BRL", result.getCurrency());
                assertEquals(PaymentMethodType.CARD, result.getPaymentMethod());

        verify(paymentValidator).validatePaymentRequest(validPaymentRequest);
        verify(paymentValidator).validateCardData(validCardData);
        verify(paymentRepository, times(2)).save(any(Payment.class));
        verify(stripeService).processCardPayment(validPaymentRequest, validCardData);
    }

    @Test
    void processCardPayment_ValidationError() {
        // Arrange
        doThrow(new PaymentValidationException("Dados inválidos"))
            .when(paymentValidator).validatePaymentRequest(any());

        // Act & Assert
        assertThrows(PaymentValidationException.class, () -> {
            paymentService.processCardPayment(validPaymentRequest);
        });

        verify(paymentValidator).validatePaymentRequest(validPaymentRequest);
        verify(paymentRepository, never()).save(any(Payment.class));
        verify(stripeService, never()).processCardPayment(any(), any());
    }

    @Test
    void processCardPayment_StripeError() {
        // Arrange
        when(paymentRepository.save(any(Payment.class))).thenReturn(validPayment);
        when(stripeService.processCardPayment(any(), any()))
            .thenThrow(new PaymentProcessingException("Erro no Stripe"));

        // Act & Assert
        assertThrows(PaymentProcessingException.class, () -> {
            paymentService.processCardPayment(validPaymentRequest);
        });

        verify(paymentValidator).validatePaymentRequest(validPaymentRequest);
        verify(paymentValidator).validateCardData(validCardData);
        verify(paymentRepository).save(any(Payment.class));
        verify(stripeService).processCardPayment(validPaymentRequest, validCardData);
    }

    @Test
    void processPixPayment_Success() {
        // Arrange
                validPaymentRequest.setPaymentMethod(PaymentMethodType.PIX);
        validPaymentRequest.setCard(null);
        
        when(paymentRepository.save(any(Payment.class))).thenReturn(validPayment);
        when(stripeService.processPixPayment(any())).thenReturn(validPaymentResult);

        // Act
        PaymentResult result = paymentService.processPixPayment(validPaymentRequest);

        // Assert
        assertNotNull(result);
        assertEquals(PaymentStatus.APPROVED, result.getStatus());
        assertEquals("pi_test123", result.getExternalId());

        verify(paymentValidator).validatePaymentRequest(validPaymentRequest);
        verify(paymentRepository, times(2)).save(any(Payment.class));
        verify(stripeService).processPixPayment(validPaymentRequest);
    }

    @Test
    void getPaymentStatus_ExistingPayment() {
        // Arrange
        when(paymentRepository.findByExternalId("pi_test123")).thenReturn(Optional.of(validPayment));

        // Act
        PaymentResult result = paymentService.getPaymentStatus("pi_test123");

        // Assert
        assertNotNull(result);
        assertEquals(PaymentStatus.APPROVED, result.getStatus());
        assertEquals("pi_test123", result.getExternalId());

        verify(paymentRepository).findByExternalId("pi_test123");
        verify(stripeService, never()).getPaymentStatus(any());
    }

    @Test
    void getPaymentStatus_PendingPayment() {
        // Arrange
        validPayment.setStatus(PaymentStatus.PENDING);
        when(paymentRepository.findByExternalId("pi_test123")).thenReturn(Optional.of(validPayment));
        when(stripeService.getPaymentStatus("pi_test123")).thenReturn(validPaymentResult);

        // Act
        PaymentResult result = paymentService.getPaymentStatus("pi_test123");

        // Assert
        assertNotNull(result);
        assertEquals(PaymentStatus.APPROVED, result.getStatus());

        verify(paymentRepository).findByExternalId("pi_test123");
        verify(stripeService).getPaymentStatus("pi_test123");
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    void getPaymentStatus_NotFound() {
        // Arrange
        when(paymentRepository.findByExternalId("pi_test123")).thenReturn(Optional.empty());
        when(stripeService.getPaymentStatus("pi_test123")).thenReturn(validPaymentResult);

        // Act
        PaymentResult result = paymentService.getPaymentStatus("pi_test123");

        // Assert
        assertNotNull(result);
        assertEquals(PaymentStatus.APPROVED, result.getStatus());

        verify(paymentRepository).findByExternalId("pi_test123");
        verify(stripeService).getPaymentStatus("pi_test123");
    }

    @Test
    void cancelPayment_Success() {
        // Arrange
        validPayment.setStatus(PaymentStatus.PENDING);
        when(paymentRepository.findByExternalId("pi_test123")).thenReturn(Optional.of(validPayment));
        when(stripeService.cancelPayment("pi_test123")).thenReturn(validPaymentResult);

        // Act
        PaymentResult result = paymentService.cancelPayment("pi_test123");

        // Assert
        assertNotNull(result);
        assertEquals(PaymentStatus.APPROVED, result.getStatus());

        verify(paymentRepository).findByExternalId("pi_test123");
        verify(stripeService).cancelPayment("pi_test123");
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    void cancelPayment_NotFound() {
        // Arrange
        when(paymentRepository.findByExternalId("pi_test123")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(PaymentValidationException.class, () -> {
            paymentService.cancelPayment("pi_test123");
        });

        verify(paymentRepository).findByExternalId("pi_test123");
        verify(stripeService, never()).cancelPayment(any());
    }

    @Test
    void cancelPayment_AlreadyFinalized() {
        // Arrange
        validPayment.setStatus(PaymentStatus.APPROVED);
        when(paymentRepository.findByExternalId("pi_test123")).thenReturn(Optional.of(validPayment));

        // Act & Assert
        assertThrows(PaymentValidationException.class, () -> {
            paymentService.cancelPayment("pi_test123");
        });

        verify(paymentRepository).findByExternalId("pi_test123");
        verify(stripeService, never()).cancelPayment(any());
    }

    @Test
    void getUserPayments_Success() {
        // Arrange
        List<Payment> payments = List.of(validPayment);
        when(paymentRepository.findByUserIdOrderByCreatedAtDesc("user123")).thenReturn(payments);

        // Act
        List<Payment> result = paymentService.getUserPayments("user123");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(validPayment, result.get(0));

        verify(paymentRepository).findByUserIdOrderByCreatedAtDesc("user123");
    }

    @Test
    void getPaymentById_Success() {
        // Arrange
        UUID paymentId = UUID.randomUUID();
        when(paymentRepository.findById(paymentId)).thenReturn(Optional.of(validPayment));

        // Act
        Optional<Payment> result = paymentService.getPaymentById(paymentId);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(validPayment, result.get());

        verify(paymentRepository).findById(paymentId);
    }

    @Test
    void getPaymentById_NotFound() {
        // Arrange
        UUID paymentId = UUID.randomUUID();
        when(paymentRepository.findById(paymentId)).thenReturn(Optional.empty());

        // Act
        Optional<Payment> result = paymentService.getPaymentById(paymentId);

        // Assert
        assertFalse(result.isPresent());

        verify(paymentRepository).findById(paymentId);
    }

    @Test
    void getPaymentByExternalId_Success() {
        // Arrange
        when(paymentRepository.findByExternalId("pi_test123")).thenReturn(Optional.of(validPayment));

        // Act
        Optional<Payment> result = paymentService.getPaymentByExternalId("pi_test123");

        // Assert
        assertTrue(result.isPresent());
        assertEquals(validPayment, result.get());

        verify(paymentRepository).findByExternalId("pi_test123");
    }
}
