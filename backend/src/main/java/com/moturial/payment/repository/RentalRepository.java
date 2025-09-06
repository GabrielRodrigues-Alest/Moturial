package com.moturial.payment.repository;

import com.moturial.payment.domain.entity.Rental;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RentalRepository extends JpaRepository<Rental, UUID> {

    @Query("SELECT r FROM Rental r JOIN FETCH r.user u JOIN FETCH r.motorcycle m WHERE " +
           "(:search IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:paymentStatus IS NULL OR r.paymentStatus = :paymentStatus)")
    Page<Rental> findRentalsWithFilters(@Param("search") String search,
                                       @Param("status") String status,
                                       @Param("paymentStatus") String paymentStatus,
                                       Pageable pageable);

    long countByStatus(Rental.Status status);

    long countByPaymentStatus(Rental.PaymentStatus paymentStatus);

    @Query("SELECT COUNT(r) FROM Rental r WHERE r.user.id = :userId")
    long countByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(r) FROM Rental r WHERE r.motorcycle.id = :motorcycleId")
    long countByMotorcycleId(@Param("motorcycleId") UUID motorcycleId);
}
