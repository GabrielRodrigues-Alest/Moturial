package com.moturial.payment.repository;

import com.moturial.payment.domain.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repositório para entidade Payment
 * 
 * Segue padrões de Clean Architecture e implementa queries otimizadas
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    /**
     * Busca pagamento por ID externo
     */
    Optional<Payment> findByExternalId(String externalId);

    /**
     * Lista pagamentos de um usuário ordenados por data de criação (mais recentes primeiro)
     */
    List<Payment> findByUserIdOrderByCreatedAtDesc(String userId);

    /**
     * Lista pagamentos por status
     */
    List<Payment> findByStatusOrderByCreatedAtDesc(com.moturial.payment.domain.enums.PaymentStatus status);

    /**
     * Lista pagamentos por método de pagamento
     */
    List<Payment> findByPaymentMethodOrderByCreatedAtDesc(com.moturial.payment.domain.enums.PaymentMethod paymentMethod);

    /**
     * Busca pagamentos criados em um período específico
     */
    @Query("SELECT p FROM Payment p WHERE p.createdAt BETWEEN :startDate AND :endDate ORDER BY p.createdAt DESC")
    List<Payment> findByCreatedAtBetweenOrderByCreatedAtDesc(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    /**
     * Busca pagamentos de um usuário em um período específico
     */
    @Query("SELECT p FROM Payment p WHERE p.userId = :userId AND p.createdAt BETWEEN :startDate AND :endDate ORDER BY p.createdAt DESC")
    List<Payment> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(
        @Param("userId") String userId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    /**
     * Conta pagamentos por status
     */
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status")
    long countByStatus(@Param("status") com.moturial.payment.domain.enums.PaymentStatus status);

    /**
     * Conta pagamentos de um usuário
     */
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.userId = :userId")
    long countByUserId(@Param("userId") String userId);

    /**
     * Busca pagamentos pendentes que podem ser cancelados
     */
    @Query("SELECT p FROM Payment p WHERE p.status IN ('PENDING', 'PROCESSING') AND p.createdAt < :cutoffDate")
    List<Payment> findPendingPaymentsOlderThan(@Param("cutoffDate") LocalDateTime cutoffDate);

    /**
     * Verifica se existe pagamento com ID externo
     */
    boolean existsByExternalId(String externalId);

    /**
     * Busca pagamentos por valor (para auditoria)
     */
    @Query("SELECT p FROM Payment p WHERE p.amount = :amount ORDER BY p.createdAt DESC")
    List<Payment> findByAmountOrderByCreatedAtDesc(@Param("amount") java.math.BigDecimal amount);

    /**
     * Busca pagamentos com erro
     */
    @Query("SELECT p FROM Payment p WHERE p.status = 'ERROR' AND p.errorMessage IS NOT NULL ORDER BY p.createdAt DESC")
    List<Payment> findErrorPaymentsOrderByCreatedAtDesc();

    /**
     * Busca pagamentos processados em um período específico
     */
    @Query("SELECT p FROM Payment p WHERE p.processedAt BETWEEN :startDate AND :endDate ORDER BY p.processedAt DESC")
    List<Payment> findByProcessedAtBetweenOrderByProcessedAtDesc(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}
