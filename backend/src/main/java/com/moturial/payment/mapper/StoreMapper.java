package com.moturial.payment.mapper;

import com.moturial.payment.domain.dto.StoreDto;
import com.moturial.payment.domain.entity.Store;
import org.springframework.stereotype.Component;

@Component
public class StoreMapper {

    public StoreDto toDto(Store store) {
        if (store == null) {
            return null;
        }

        return StoreDto.builder()
                .id(store.getId())
                .name(store.getName())
                .address(store.getAddress())
                .city(store.getCity())
                .state(store.getState())
                .zipCode(store.getZipCode())
                .phone(store.getPhone())
                .email(store.getEmail())
                .managerName(store.getManagerName())
                .status(store.getStatus().name())
                .capacity(store.getCapacity())
                .currentInventory(store.getCurrentInventory())
                .operatingHours(store.getOperatingHours())
                .latitude(store.getLatitude())
                .longitude(store.getLongitude())
                .createdAt(store.getCreatedAt())
                .updatedAt(store.getUpdatedAt())
                .build();
    }
}
