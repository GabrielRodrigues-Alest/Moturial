package com.moturial.payment.domain.dto;

import com.moturial.payment.domain.enums.PaymentMethodType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.Map;

/**
 * DTO para requisição de pagamento
 * 
 * Implementa validações rigorosas seguindo os princípios OWASP
 * para garantir a segurança dos dados de entrada.
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
public class PaymentRequest {

    @NotBlank(message = "User ID é obrigatório")
    @Size(min = 1, max = 255, message = "User ID deve ter entre 1 e 255 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9_-]+$", message = "User ID contém caracteres inválidos")
    private String userId;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @DecimalMax(value = "9999999.99", message = "Valor máximo excedido")
    private BigDecimal amount;

    @NotBlank(message = "Moeda é obrigatória")
    @Pattern(regexp = "^[A-Z]{3}$", message = "Moeda deve ter 3 caracteres maiúsculos")
    private String currency;

    @NotNull(message = "Método de pagamento é obrigatório")
    private PaymentMethodType paymentMethod;

    @Min(value = 1, message = "Parcelas deve ser pelo menos 1")
    @Max(value = 12, message = "Parcelas não pode exceder 12")
    private Integer installments = 1;

    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
    private String description;

    @Valid
    @NotNull(message = "Dados do cliente são obrigatórios")
    private CustomerData customer;

    @Valid
    private CardData card;

    @Valid
    private PixData pix;

    @Valid
    private BoletoData boleto;

    private Map<String, Object> metadata;

    // Constructors
    public PaymentRequest() {}

    public PaymentRequest(String userId, BigDecimal amount, String currency, 
                         PaymentMethodType paymentMethod, CustomerData customer) {
        this.userId = userId;
        this.amount = amount;
        this.currency = currency;
        this.paymentMethod = paymentMethod;
        this.customer = customer;
    }

    // Getters and Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public PaymentMethodType getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethodType paymentMethod) { this.paymentMethod = paymentMethod; }

    public Integer getInstallments() { return installments; }
    public void setInstallments(Integer installments) { this.installments = installments; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public CustomerData getCustomer() { return customer; }
    public void setCustomer(CustomerData customer) { this.customer = customer; }

    public CardData getCard() { return card; }
    public void setCard(CardData card) { this.card = card; }

    public PixData getPix() { return pix; }
    public void setPix(PixData pix) { this.pix = pix; }

    public BoletoData getBoleto() { return boleto; }
    public void setBoleto(BoletoData boleto) { this.boleto = boleto; }

    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }

    @Override
    public String toString() {
        return "PaymentRequest{" +
                "userId='" + userId + '\'' +
                ", amount=" + amount +
                ", currency='" + currency + '\'' +
                ", paymentMethod=" + paymentMethod +
                ", installments=" + installments +
                ", description='" + description + '\'' +
                ", customer=" + customer +
                '}';
    }
}
