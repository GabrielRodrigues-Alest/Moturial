package com.moturial.payment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller de teste para validar a configuração de segurança.
 */
@RestController
@RequestMapping("/api/v1/test")
public class TestController {

    /**
     * Endpoint protegido por API Key para validar a autenticação.
     * @return Uma mensagem de sucesso se a autenticação for bem-sucedida.
     */
    @GetMapping("/secure")
    public ResponseEntity<String> getSecureData() {
        return ResponseEntity.ok("Acesso ao endpoint seguro concedido! A autenticação via API Key funciona.");
    }
}
