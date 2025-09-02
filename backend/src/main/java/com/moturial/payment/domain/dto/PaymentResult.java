package com.moturial.payment.domain.dto;

import com.moturial.payment.domain.enums.PaymentMethod;
import com.moturial.payment.domain.enums.PaymentStatus;
import java.math.BigDecimal;
import java.util.Map;

/**
 * DTO para resultado de processamento de pagamento
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
public class PaymentResult {

    private String externalId;
    private PaymentStatus status;
    private BigDecimal amount;
    private String currency;
    private PaymentMethod paymentMethod;
    private Integer installments;
    private String description;
    private Map<String, String> metadata;
    private String errorMessage;
    private String pixQrCode;
    private String pixCopyPaste;
    private String boletoUrl;
    private String boletoBarcode;

    private PaymentResult(Builder builder) {
        this.externalId = builder.externalId;
        this.status = builder.status;
        this.amount = builder.amount;
        this.currency = builder.currency;
        this.paymentMethod = builder.paymentMethod;
        this.installments = builder.installments;
        this.description = builder.description;
        this.metadata = builder.metadata;
        this.errorMessage = builder.errorMessage;
        this.pixQrCode = builder.pixQrCode;
        this.pixCopyPaste = builder.pixCopyPaste;
        this.boletoUrl = builder.boletoUrl;
        this.boletoBarcode = builder.boletoBarcode;
    }

    // Getters
    public String getExternalId() { return externalId; }
    public PaymentStatus getStatus() { return status; }
    public BigDecimal getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public Integer getInstallments() { return installments; }
    public String getDescription() { return description; }
    public Map<String, String> getMetadata() { return metadata; }
    public String getErrorMessage() { return errorMessage; }
    public String getPixQrCode() { return pixQrCode; }
    public String getPixCopyPaste() { return pixCopyPaste; }
    public String getBoletoUrl() { return boletoUrl; }
    public String getBoletoBarcode() { return boletoBarcode; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String externalId;
        private PaymentStatus status;
        private BigDecimal amount;
        private String currency;
        private PaymentMethod paymentMethod;
        private Integer installments;
        private String description;
        private Map<String, String> metadata;
        private String errorMessage;
        private String pixQrCode;
        private String pixCopyPaste;
        private String boletoUrl;
        private String boletoBarcode;

        public Builder externalId(String externalId) {
            this.externalId = externalId;
            return this;
        }

        public Builder status(PaymentStatus status) {
            this.status = status;
            return this;
        }

        public Builder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public Builder currency(String currency) {
            this.currency = currency;
            return this;
        }

        public Builder paymentMethod(PaymentMethod paymentMethod) {
            this.paymentMethod = paymentMethod;
            return this;
        }

        public Builder installments(Integer installments) {
            this.installments = installments;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder metadata(Map<String, String> metadata) {
            this.metadata = metadata;
            return this;
        }

        public Builder errorMessage(String errorMessage) {
            this.errorMessage = errorMessage;
            return this;
        }

        public Builder pixQrCode(String pixQrCode) {
            this.pixQrCode = pixQrCode;
            return this;
        }

        public Builder pixCopyPaste(String pixCopyPaste) {
            this.pixCopyPaste = pixCopyPaste;
            return this;
        }

        public Builder boletoUrl(String boletoUrl) {
            this.boletoUrl = boletoUrl;
            return this;
        }

        public Builder boletoBarcode(String boletoBarcode) {
            this.boletoBarcode = boletoBarcode;
            return this;
        }

        public PaymentResult build() {
            return new PaymentResult(this);
        }
    }

    @Override
    public String toString() {
        return "PaymentResult{" +
                "externalId='" + externalId + '\'' +
                ", status=" + status +
                ", amount=" + amount +
                ", currency='" + currency + '\'' +
                ", paymentMethod=" + paymentMethod +
                ", installments=" + installments +
                ", description='" + description + '\'' +
                '}';
    }
}
