package com.moturial.payment.domain.dto;

import jakarta.validation.constraints.*;
import java.util.List;

/**
 * DTO para dados do cliente
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
public class CustomerData {

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s]+$", message = "Nome contém caracteres inválidos")
    private String name;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ter formato válido")
    @Size(max = 255, message = "Email deve ter no máximo 255 caracteres")
    private String email;

    @Size(max = 20, message = "CPF deve ter no máximo 20 caracteres")
    @Pattern(regexp = "^[0-9.-]+$", message = "CPF contém caracteres inválidos")
    private String document;

    @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres")
    @Pattern(regexp = "^[0-9+\\-()\\s]+$", message = "Telefone contém caracteres inválidos")
    private String phone;

    private AddressData address;

    private List<String> tags;

    // Constructors
    public CustomerData() {}

    public CustomerData(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public CustomerData(String name, String email, String document, String phone) {
        this.name = name;
        this.email = email;
        this.document = document;
        this.phone = phone;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDocument() { return document; }
    public void setDocument(String document) { this.document = document; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public AddressData getAddress() { return address; }
    public void setAddress(AddressData address) { this.address = address; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    @Override
    public String toString() {
        return "CustomerData{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", document='" + document + '\'' +
                ", phone='" + phone + '\'' +
                '}';
    }
}
