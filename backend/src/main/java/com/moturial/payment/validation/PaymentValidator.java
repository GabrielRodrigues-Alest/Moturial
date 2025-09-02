package com.moturial.payment.validation;

import com.moturial.payment.domain.dto.PaymentRequest;
import com.moturial.payment.domain.dto.CardData;
import com.moturial.payment.domain.dto.CustomerData;
import com.moturial.payment.exception.PaymentValidationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.regex.Pattern;

/**
 * Validador de pagamentos seguindo princípios OWASP e regras de negócio
 * 
 * Implementa validações rigorosas para garantir segurança e integridade
 * dos dados de pagamento.
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
@Component
public class PaymentValidator {

    @Value("${payment.limits.max-amount:1000000}")
    private BigDecimal maxAmount;

    @Value("${payment.limits.min-amount:100}")
    private BigDecimal minAmount;

    @Value("${payment.limits.max-installments:12}")
    private Integer maxInstallments;

    @Value("${payment.validation.card-number-pattern:^[0-9]{13,19}$}")
    private String cardNumberPattern;

    @Value("${payment.validation.cvv-pattern:^[0-9]{3,4}$}")
    private String cvvPattern;

    @Value("${payment.validation.expiry-pattern:^(0[1-9]|1[0-2])/([0-9]{2})$}")
    private String expiryPattern;

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );

    private static final Pattern CPF_PATTERN = Pattern.compile(
        "^[0-9]{3}\\.?[0-9]{3}\\.?[0-9]{3}-?[0-9]{2}$"
    );

    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "^\\+?[0-9]{10,15}$"
    );

    /**
     * Valida requisição de pagamento completa
     */
    public void validatePaymentRequest(PaymentRequest request) {
        if (request == null) {
            throw new PaymentValidationException("Requisição de pagamento não pode ser nula");
        }

        validateUserId(request.getUserId());
        validateAmount(request.getAmount());
        validateCurrency(request.getCurrency());
        validatePaymentMethod(request.getPaymentMethod());
        validateInstallments(request.getInstallments());
        validateDescription(request.getDescription());
        validateCustomer(request.getCustomer());
    }

    /**
     * Valida dados de cartão
     */
    public void validateCardData(CardData cardData) {
        if (cardData == null) {
            throw new PaymentValidationException("Dados do cartão não podem ser nulos");
        }

        // Se tem token, não precisa validar outros campos
        if (StringUtils.hasText(cardData.getToken())) {
            validateCardToken(cardData.getToken());
            return;
        }

        validateCardNumber(cardData.getNumber());
        validateCardHolderName(cardData.getHolderName());
        validateExpiryDate(cardData.getExpiryDate());
        validateCvv(cardData.getCvv());
    }

    /**
     * Valida ID do usuário
     */
    private void validateUserId(String userId) {
        if (!StringUtils.hasText(userId)) {
            throw new PaymentValidationException("User ID é obrigatório");
        }

        if (userId.length() > 255) {
            throw new PaymentValidationException("User ID deve ter no máximo 255 caracteres");
        }

        if (!userId.matches("^[a-zA-Z0-9_-]+$")) {
            throw new PaymentValidationException("User ID contém caracteres inválidos");
        }
    }

    /**
     * Valida valor do pagamento
     */
    private void validateAmount(BigDecimal amount) {
        if (amount == null) {
            throw new PaymentValidationException("Valor é obrigatório");
        }

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new PaymentValidationException("Valor deve ser maior que zero");
        }

        if (amount.compareTo(maxAmount) > 0) {
            throw new PaymentValidationException("Valor máximo excedido: " + maxAmount);
        }

        if (amount.compareTo(minAmount) < 0) {
            throw new PaymentValidationException("Valor mínimo não atingido: " + minAmount);
        }

        // Validar escala (máximo 2 casas decimais)
        if (amount.scale() > 2) {
            throw new PaymentValidationException("Valor deve ter no máximo 2 casas decimais");
        }
    }

    /**
     * Valida moeda
     */
    private void validateCurrency(String currency) {
        if (!StringUtils.hasText(currency)) {
            throw new PaymentValidationException("Moeda é obrigatória");
        }

        if (!currency.matches("^[A-Z]{3}$")) {
            throw new PaymentValidationException("Moeda deve ter 3 caracteres maiúsculos");
        }

        // Validar moedas suportadas
        if (!isSupportedCurrency(currency)) {
            throw new PaymentValidationException("Moeda não suportada: " + currency);
        }
    }

    /**
     * Valida método de pagamento
     */
    private void validatePaymentMethod(com.moturial.payment.domain.enums.PaymentMethod paymentMethod) {
        if (paymentMethod == null) {
            throw new PaymentValidationException("Método de pagamento é obrigatório");
        }
    }

    /**
     * Valida parcelas
     */
    private void validateInstallments(Integer installments) {
        if (installments == null) {
            throw new PaymentValidationException("Parcelas é obrigatório");
        }

        if (installments < 1) {
            throw new PaymentValidationException("Parcelas deve ser pelo menos 1");
        }

        if (installments > maxInstallments) {
            throw new PaymentValidationException("Parcelas não pode exceder " + maxInstallments);
        }
    }

    /**
     * Valida descrição
     */
    private void validateDescription(String description) {
        if (StringUtils.hasText(description) && description.length() > 500) {
            throw new PaymentValidationException("Descrição deve ter no máximo 500 caracteres");
        }
    }

    /**
     * Valida dados do cliente
     */
    private void validateCustomer(CustomerData customer) {
        if (customer == null) {
            throw new PaymentValidationException("Dados do cliente são obrigatórios");
        }

        validateCustomerName(customer.getName());
        validateCustomerEmail(customer.getEmail());
        validateCustomerDocument(customer.getDocument());
        validateCustomerPhone(customer.getPhone());
    }

    /**
     * Valida nome do cliente
     */
    private void validateCustomerName(String name) {
        if (!StringUtils.hasText(name)) {
            throw new PaymentValidationException("Nome do cliente é obrigatório");
        }

        if (name.length() < 2) {
            throw new PaymentValidationException("Nome deve ter pelo menos 2 caracteres");
        }

        if (name.length() > 100) {
            throw new PaymentValidationException("Nome deve ter no máximo 100 caracteres");
        }

        if (!name.matches("^[a-zA-ZÀ-ÿ\\s]+$")) {
            throw new PaymentValidationException("Nome contém caracteres inválidos");
        }
    }

    /**
     * Valida email do cliente
     */
    private void validateCustomerEmail(String email) {
        if (!StringUtils.hasText(email)) {
            throw new PaymentValidationException("Email do cliente é obrigatório");
        }

        if (email.length() > 255) {
            throw new PaymentValidationException("Email deve ter no máximo 255 caracteres");
        }

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new PaymentValidationException("Email deve ter formato válido");
        }
    }

    /**
     * Valida documento do cliente (CPF)
     */
    private void validateCustomerDocument(String document) {
        if (StringUtils.hasText(document)) {
            if (document.length() > 20) {
                throw new PaymentValidationException("CPF deve ter no máximo 20 caracteres");
            }

            if (!CPF_PATTERN.matcher(document).matches()) {
                throw new PaymentValidationException("CPF deve ter formato válido");
            }

            if (!isValidCpf(document.replaceAll("[^0-9]", ""))) {
                throw new PaymentValidationException("CPF inválido");
            }
        }
    }

    /**
     * Valida telefone do cliente
     */
    private void validateCustomerPhone(String phone) {
        if (StringUtils.hasText(phone)) {
            if (phone.length() > 20) {
                throw new PaymentValidationException("Telefone deve ter no máximo 20 caracteres");
            }

            if (!PHONE_PATTERN.matcher(phone.replaceAll("[^0-9+]", "")).matches()) {
                throw new PaymentValidationException("Telefone deve ter formato válido");
            }
        }
    }

    /**
     * Valida número do cartão
     */
    private void validateCardNumber(String number) {
        if (!StringUtils.hasText(number)) {
            throw new PaymentValidationException("Número do cartão é obrigatório");
        }

        String cleanNumber = number.replaceAll("\\s", "");
        
        if (!cleanNumber.matches(cardNumberPattern)) {
            throw new PaymentValidationException("Número do cartão deve ter entre 13 e 19 dígitos");
        }

        if (!isValidCardNumber(cleanNumber)) {
            throw new PaymentValidationException("Número do cartão inválido");
        }
    }

    /**
     * Valida nome do titular do cartão
     */
    private void validateCardHolderName(String holderName) {
        if (!StringUtils.hasText(holderName)) {
            throw new PaymentValidationException("Nome do titular é obrigatório");
        }

        if (holderName.length() < 2) {
            throw new PaymentValidationException("Nome do titular deve ter pelo menos 2 caracteres");
        }

        if (holderName.length() > 100) {
            throw new PaymentValidationException("Nome do titular deve ter no máximo 100 caracteres");
        }

        if (!holderName.matches("^[a-zA-ZÀ-ÿ\\s]+$")) {
            throw new PaymentValidationException("Nome do titular contém caracteres inválidos");
        }
    }

    /**
     * Valida data de expiração
     */
    private void validateExpiryDate(String expiryDate) {
        if (!StringUtils.hasText(expiryDate)) {
            throw new PaymentValidationException("Data de expiração é obrigatória");
        }

        if (!expiryDate.matches(expiryPattern)) {
            throw new PaymentValidationException("Data de expiração deve estar no formato MM/YY");
        }

        if (!isValidExpiryDate(expiryDate)) {
            throw new PaymentValidationException("Data de expiração inválida ou vencida");
        }
    }

    /**
     * Valida CVV
     */
    private void validateCvv(String cvv) {
        if (!StringUtils.hasText(cvv)) {
            throw new PaymentValidationException("CVV é obrigatório");
        }

        if (!cvv.matches(cvvPattern)) {
            throw new PaymentValidationException("CVV deve ter 3 ou 4 dígitos");
        }
    }

    /**
     * Valida token do cartão
     */
    private void validateCardToken(String token) {
        if (!StringUtils.hasText(token)) {
            throw new PaymentValidationException("Token do cartão é obrigatório");
        }

        if (token.length() > 255) {
            throw new PaymentValidationException("Token do cartão deve ter no máximo 255 caracteres");
        }

        if (!token.matches("^[a-zA-Z0-9_-]+$")) {
            throw new PaymentValidationException("Token do cartão contém caracteres inválidos");
        }
    }

    /**
     * Valida número de cartão usando algoritmo de Luhn
     */
    private boolean isValidCardNumber(String number) {
        int sum = 0;
        boolean alternate = false;
        
        for (int i = number.length() - 1; i >= 0; i--) {
            int n = Integer.parseInt(number.substring(i, i + 1));
            if (alternate) {
                n *= 2;
                if (n > 9) {
                    n = (n % 10) + 1;
                }
            }
            sum += n;
            alternate = !alternate;
        }
        
        return sum % 10 == 0;
    }

    /**
     * Valida data de expiração
     */
    private boolean isValidExpiryDate(String expiryDate) {
        try {
            String[] parts = expiryDate.split("/");
            int month = Integer.parseInt(parts[0]);
            int year = Integer.parseInt(parts[1]) + 2000;

            java.time.YearMonth expiry = java.time.YearMonth.of(year, month);
            java.time.YearMonth current = java.time.YearMonth.now();

            return !expiry.isBefore(current);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Valida CPF usando algoritmo oficial
     */
    private boolean isValidCpf(String cpf) {
        if (cpf.length() != 11) {
            return false;
        }

        // Verifica se todos os dígitos são iguais
        if (cpf.matches("^(\\d)\\1{10}$")) {
            return false;
        }

        // Calcula primeiro dígito verificador
        int sum = 0;
        for (int i = 0; i < 9; i++) {
            sum += Character.getNumericValue(cpf.charAt(i)) * (10 - i);
        }
        int remainder = sum % 11;
        int digit1 = remainder < 2 ? 0 : 11 - remainder;

        // Calcula segundo dígito verificador
        sum = 0;
        for (int i = 0; i < 10; i++) {
            sum += Character.getNumericValue(cpf.charAt(i)) * (11 - i);
        }
        remainder = sum % 11;
        int digit2 = remainder < 2 ? 0 : 11 - remainder;

        // Verifica se os dígitos calculados são iguais aos do CPF
        return Character.getNumericValue(cpf.charAt(9)) == digit1 &&
               Character.getNumericValue(cpf.charAt(10)) == digit2;
    }

    /**
     * Verifica se a moeda é suportada
     */
    private boolean isSupportedCurrency(String currency) {
        return "BRL".equals(currency) || "USD".equals(currency) || "EUR".equals(currency);
    }
}
