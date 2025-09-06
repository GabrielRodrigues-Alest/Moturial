package com.moturial.payment.repository;

import com.moturial.payment.domain.entity.Motorcycle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MotorcycleRepository extends JpaRepository<Motorcycle, UUID> {

    Optional<Motorcycle> findByLicensePlate(String licensePlate);

    boolean existsByLicensePlate(String licensePlate);

    @Query("SELECT m FROM Motorcycle m WHERE " +
           "(:search IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.type) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:type IS NULL OR m.type = :type) AND " +
           "(:status IS NULL OR m.status = :status) AND " +
           "(:location IS NULL OR LOWER(m.location) LIKE LOWER(CONCAT('%', :location, '%')))")
    Page<Motorcycle> findMotorcyclesWithFilters(@Param("search") String search,
                                               @Param("type") String type,
                                               @Param("status") String status,
                                               @Param("location") String location,
                                               Pageable pageable);

    long countByStatus(Motorcycle.Status status);

    long countByLocation(String location);
}
