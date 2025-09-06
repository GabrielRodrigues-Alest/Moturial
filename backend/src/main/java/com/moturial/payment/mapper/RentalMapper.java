package com.moturial.payment.mapper;

import com.moturial.payment.domain.dto.RentalDto;
import com.moturial.payment.domain.entity.Rental;
import org.springframework.stereotype.Component;

@Component
public class RentalMapper {

    public RentalDto toDto(Rental rental) {
        if (rental == null) {
            return null;
        }

        return RentalDto.builder()
                .id(rental.getId())
                .userId(rental.getUser().getId())
                .userName(rental.getUser().getName())
                .userEmail(rental.getUser().getEmail())
                .motorcycleId(rental.getMotorcycle().getId())
                .motorcycleName(rental.getMotorcycle().getName())
                .startDate(rental.getStartDate())
                .endDate(rental.getEndDate())
                .returnedAt(rental.getActualReturnDate())
                .status(rental.getStatus().name())
                .paymentStatus(rental.getPaymentStatus().name())
                .dailyRate(rental.getDailyRate())
                .rentalDays(rental.getTotalDays())
                .totalAmount(rental.getTotalAmount())
                .additionalFees(rental.getDepositAmount())
                .lateReturnFee(rental.getLateFee())
                .damageFee(rental.getDamageFee())
                .location(rental.getPickupLocation())
                .notes(rental.getNotes())
                .createdAt(rental.getCreatedAt())
                .updatedAt(rental.getUpdatedAt())
                .build();
    }
}
