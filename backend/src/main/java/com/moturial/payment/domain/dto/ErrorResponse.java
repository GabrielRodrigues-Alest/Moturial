package com.moturial.payment.domain.dto;

import java.time.Instant;

/**
 * DTO para padronização de respostas de erro da API.
 * 
 * @param timestamp O momento em que o erro ocorreu.
 * @param status O código de status HTTP.
 * @param error O tipo de erro (ex: "Bad Request").
 * @param message A mensagem de erro detalhada.
 * @param path O caminho da requisição que causou o erro.
 */
public record ErrorResponse(
    Instant timestamp,
    int status,
    String error,
    String message,
    String path
) {}
