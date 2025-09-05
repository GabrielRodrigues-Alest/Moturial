package com.moturial.payment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Aplicação principal do sistema de pagamento Moturial
 * 
 * Esta aplicação implementa um sistema de pagamento seguro integrado com Stripe,
 * seguindo as melhores práticas de segurança OWASP e padrões de qualidade de código.
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableTransactionManagement
@EnableAsync
@ConfigurationPropertiesScan
public class PaymentServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PaymentServiceApplication.class, args);
    }
}
