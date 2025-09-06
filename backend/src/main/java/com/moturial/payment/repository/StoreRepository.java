package com.moturial.payment.repository;

import com.moturial.payment.domain.entity.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface StoreRepository extends JpaRepository<Store, UUID> {

    @Query("SELECT s FROM Store s WHERE " +
           "(:search IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.city) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.address) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:city IS NULL OR LOWER(s.city) = LOWER(:city)) AND " +
           "(:status IS NULL OR s.status = :status)")
    Page<Store> findStoresWithFilters(@Param("search") String search,
                                     @Param("city") String city,
                                     @Param("status") String status,
                                     Pageable pageable);

    long countByStatus(Store.Status status);

    long countByCity(String city);

    @Query("SELECT SUM(s.capacity) FROM Store s WHERE s.status = 'ACTIVE'")
    Long getTotalCapacity();

    @Query("SELECT SUM(s.currentInventory) FROM Store s WHERE s.status = 'ACTIVE'")
    Long getTotalInventory();
}
