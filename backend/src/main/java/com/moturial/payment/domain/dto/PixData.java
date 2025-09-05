package com.moturial.payment.domain.dto;

import jakarta.validation.constraints.*;

/**
 * DTO para dados de PIX
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
public class PixData {

    @Size(max = 100, message = "Chave PIX deve ter no máximo 100 caracteres")
    private String pixKey;

    @Size(max = 50, message = "Tipo de chave PIX deve ter no máximo 50 caracteres")
    private String pixKeyType;

    // Constructors
    public PixData() {}

    public PixData(String pixKey, String pixKeyType) {
        this.pixKey = pixKey;
        this.pixKeyType = pixKeyType;
    }

    // Getters and Setters
    public String getPixKey() { return pixKey; }
    public void setPixKey(String pixKey) { this.pixKey = pixKey; }

    public String getPixKeyType() { return pixKeyType; }
    public void setPixKeyType(String pixKeyType) { this.pixKeyType = pixKeyType; }

    @Override
    public String toString() {
        return "PixData{" +
                "pixKey='" + pixKey + '\'' +
                ", pixKeyType='" + pixKeyType + '\'' +
                '}';
    }
}
