package com.moturial.payment.validation;

import com.moturial.payment.domain.dto.CardData;
import com.moturial.payment.domain.dto.CustomerData;
import com.moturial.payment.domain.dto.PaymentRequest;
import com.moturial.payment.domain.enums.PaymentMethod;
import com.moturial.payment.exception.PaymentValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Testes unitários para PaymentValidator
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
@ExtendWith(MockitoExtension.class)
class PaymentValidatorTest {

    @InjectMocks
    private PaymentValidator validator;

    private PaymentRequest validPaymentRequest;
    private CardData validCardData;
    private CustomerData validCustomerData;

    @BeforeEach
    void setUp() {
        // Configurar valores padrão
        ReflectionTestUtils.setField(validator, "maxAmount", new BigDecimal("1000000"));
        ReflectionTestUtils.setField(validator, "minAmount", new BigDecimal("100"));
        ReflectionTestUtils.setField(validator, "maxInstallments", 12);

        // Setup dados válidos
        validCustomerData = new CustomerData("João Silva", "joao@email.com");
        validCardData = new CardData("4242424242424242", "João Silva", "12/25", "123");
        
        validPaymentRequest = new PaymentRequest();
        validPaymentRequest.setUserId("user123");
        validPaymentRequest.setAmount(new BigDecimal("100.00"));
        validPaymentRequest.setCurrency("BRL");
        validPaymentRequest.setPaymentMethod(PaymentMethod.CARD);
        validPaymentRequest.setInstallments(1);
        validPaymentRequest.setDescription("Teste de pagamento");
        validPaymentRequest.setCustomer(validCustomerData);
        validPaymentRequest.setCard(validCardData);
    }

    @Test
    void validatePaymentRequest_Success() {
        assertDoesNotThrow(() -> validator.validatePaymentRequest(validPaymentRequest));
    }

    @Test
    void validatePaymentRequest_NullRequest() {
        assertThrows(PaymentValidationException.class, () -> {
            validator.validatePaymentRequest(null);
        });
    }

    @Test
    void validatePaymentRequest_InvalidUserId() {
        validPaymentRequest.setUserId("");
        
        PaymentValidationException exception = assertThrows(PaymentValidationException.class, () -> {
            validator.validatePaymentRequest(validPaymentRequest);
        });
        
        assertEquals("User ID é obrigatório", exception.getMessage());
    }

    @Test
    void validatePaymentRequest_InvalidUserIdCharacters() {
        validPaymentRequest.setUserId("user@123");
        
        PaymentValidationException exception = assertThrows(PaymentValidationException.class, () -> {
            validator.validatePaymentRequest(validPaymentRequest);
        });
        
        assertEquals("User ID contém caracteres inválidos", exception.getMessage());
    }

    @Test
    void validatePaymentRequest_InvalidAmount() {
        validPaymentRequest.setAmount(new BigDecimal("50.00")); // Menor que mínimo
        
        PaymentValidationException exception = assertThrows(PaymentValidationException.class, () -> {
            validator.validatePaymentRequest(validPaymentRequest);
        });
        
        assertTrue(exception.getMessage().contains("Valor mínimo não atingido"));
    }

    @Test
    void validatePaymentRequest_AmountTooHigh() {
        validPaymentRequest.setAmount(new BigDecimal("2000000.00")); // Maior que máximo
        
        PaymentValidationException exception = assertThrows(PaymentValidationException.class, () -> {
            validator.validatePaymentRequest(validPaymentRequest);
        });
        
        assertTrue(exception.getMessage().contains("Valor máximo excedido"));
    }

    @Test
    void validatePaymentRequest_InvalidCurrency() {
        validPaymentRequest.setCurrency("INVALID");
        
        PaymentValidationException exception = assertThrows(PaymentValidationException.class, () -> {
            validator.validatePaymentRequest(validPaymentRequest);
        });
        
        assertEquals("Moeda não suportada: INVALID", exception.getMessage());
    }

    @Test
    void validatePaymentRequest_InvalidInstallments() {
        validPaymentRequest.setInstallments(15); // Maior que máximo
        
        PaymentValidationException exception = assertThrows(PaymentValidationException.class, () -> {
            validator.validatePaymentRequest(validPaymentRequest);
        });
        
        assertTrue(exception.getMessage().contains("Parcelas não pode exceder"));
    }

    @Test
    void validateCardData_Success() {
        assertDoesNotThrow(() -> validator.validateCardData(validCardData));
    }

    @Test
    void validateCardData_NullCardData() {
        assertThrows(PaymentValidationException.class, () -> {
            validator.validateCardData(null);
        });
    }

    @Test
    void validateCardData_InvalidCardNumber() {
        validCardData.setNumber("123456789012"); // Inválido
        
        PaymentValidationException exception = assertThrows(PaymentValidationException.class, () -> {
            validator.validateCardData(validCardData);
        });
        
        assertEquals("Número do cartão inválido", exception.getMessage());
    }

    @Test
    void validateCardData_InvalidExpiryDate() {
        validCardData.setExpiryDate("13/25"); // Mês inválido
        
        PaymentValidationException exception = assertThrows(PaymentValidationException.class, () -> {
            validator.validateCardData(validCardData);
        });
        
        assertEquals("Data de expiração deve estar no formato MM/YY", exception.getMessage());
    }

    @Test
    void validateCardData_ExpiredCard() {
        validCardData.setExpiryDate("01/20"); // Cartão vencido
        
        PaymentValidationException exception = assertThrows(PaymentValidationException.class, () -> {
            validator.validateCardData(validCardData);
        });
        
        assertEquals("Data de expiração inválida ou vencida", exception.getMessage());
    }

    @Test
    void validateCardData_InvalidCvv() {
        validCardData.setCvv("12"); // CVV muito curto
        
        PaymentValidationException exception = assertThrows(PaymentValidationException.class, () -> {
            validator.validateCardData(validCardData);
        });
        
        assertEquals("CVV deve ter 3 ou 4 dígitos", exception.getMessage());
    }

    @Test
    void validateCardData_InvalidHolderName() {
        validCardData.setHolderName("João123"); // Caracteres inválidos
        
        PaymentValidationException exception = assertThrows(PaymentValidationException.class, () -> {
            validator.validateCardData(validCardData);
        });
        
        assertEquals("Nome do titular contém caracteres inválidos", exception.getMessage());
    }

    @Test
    void validateCardData_WithToken() {
        CardData cardWithToken = new CardData("token_123");
        
        assertDoesNotThrow(() -> validator.validateCardData(cardWithToken));
    }

    @Test
    void validateCardData_InvalidToken() {
        CardData cardWithInvalidToken = new CardData("token@123"); // Caracteres inválidos
        
        PaymentValidationException exception = assertThrows(PaymentValidationException.class, () -> {
            validator.validateCardData(cardWithInvalidToken);
        });
        
        assertEquals("Token do cartão contém caracteres inválidos", exception.getMessage());
    }

    @Test
    void validateCustomer_Success() {
        assertDoesNotThrow(() -> validator.validatePaymentRequest(validPaymentRequest));
    }

    @Test
    void validateCustomer_InvalidName() {
        validCustomerData.setName("A"); // Muito curto
        
        PaymentValidationException exception = assertThrows(PaymentValidationException.class, () -> {
            validator.validatePaymentRequest(validPaymentRequest);
        });
        
        assertEquals("Nome deve ter pelo menos 2 caracteres", exception.getMessage());
    }

    @Test
    void validateCustomer_InvalidEmail() {
        validCustomerData.setEmail("invalid-email");
        
        PaymentValidationException exception = assertThrows(PaymentValidationException.class, () -> {
            validator.validatePaymentRequest(validPaymentRequest);
        });
        
        assertEquals("Email deve ter formato válido", exception.getMessage());
    }

    @Test
    void validateCustomer_InvalidCpf() {
        validCustomerData.setDocument("123.456.789-00"); // CPF inválido
        
        PaymentValidationException exception = assertThrows(PaymentValidationException.class, () -> {
            validator.validatePaymentRequest(validPaymentRequest);
        });
        
        assertEquals("CPF inválido", exception.getMessage());
    }

    @Test
    void validateCustomer_ValidCpf() {
        validCustomerData.setDocument("123.456.789-09"); // CPF válido
        
        assertDoesNotThrow(() -> validator.validatePaymentRequest(validPaymentRequest));
    }

    @Test
    void validateCustomer_InvalidPhone() {
        validCustomerData.setPhone("123"); // Muito curto
        
        PaymentValidationException exception = assertThrows(PaymentValidationException.class, () -> {
            validator.validatePaymentRequest(validPaymentRequest);
        });
        
        assertEquals("Telefone deve ter formato válido", exception.getMessage());
    }

    @Test
    void validateCustomer_ValidPhone() {
        validCustomerData.setPhone("+5511999999999");
        
        assertDoesNotThrow(() -> validator.validatePaymentRequest(validPaymentRequest));
    }

    @Test
    void validatePaymentRequest_DescriptionTooLong() {
        validPaymentRequest.setDescription("a".repeat(501)); // Muito longo
        
        PaymentValidationException exception = assertThrows(PaymentValidationException.class, () -> {
            validator.validatePaymentRequest(validPaymentRequest);
        });
        
        assertEquals("Descrição deve ter no máximo 500 caracteres", exception.getMessage());
    }

    @Test
    void validatePaymentRequest_ValidDescription() {
        validPaymentRequest.setDescription("Descrição válida");
        
        assertDoesNotThrow(() -> validator.validatePaymentRequest(validPaymentRequest));
    }

    @Test
    void validatePaymentRequest_NullDescription() {
        validPaymentRequest.setDescription(null);
        
        assertDoesNotThrow(() -> validator.validatePaymentRequest(validPaymentRequest));
    }
}
