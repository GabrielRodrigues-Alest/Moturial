package com.moturial.payment.config;

import io.micrometer.core.aop.TimedAspect;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.boot.actuator.autoconfigure.metrics.MeterRegistryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração do Actuator para observabilidade
 * 
 * Implementa métricas, health checks e endpoints de monitoramento
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
@Configuration
public class ActuatorConfig {

    /**
     * Customização do MeterRegistry com tags da aplicação
     */
    @Bean
    public MeterRegistryCustomizer<MeterRegistry> metricsCommonTags() {
        return registry -> registry.config()
            .commonTags("application", "moturial-payment-service")
            .commonTags("version", "1.0.0")
            .commonTags("environment", System.getenv().getOrDefault("SPRING_PROFILES_ACTIVE", "dev"));
    }

    /**
     * Aspect para timing automático de métodos
     */
    @Bean
    public TimedAspect timedAspect(MeterRegistry registry) {
        return new TimedAspect(registry);
    }
}
