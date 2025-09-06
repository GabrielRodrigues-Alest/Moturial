package com.moturial.payment.mapper;

import com.moturial.payment.domain.dto.CreateUserDto;
import com.moturial.payment.domain.dto.UpdateUserDto;
import com.moturial.payment.domain.dto.UserDto;
import com.moturial.payment.domain.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }

        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .active(user.getStatus() == User.Status.ACTIVE)
                .emailVerified(user.getEmailVerified())
                .phoneVerified(user.getPhoneVerified())
                .lastLoginAt(user.getLastLogin())
                .completedRentals(0)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    public User toEntity(CreateUserDto createUserDto, String passwordHash) {
        if (createUserDto == null) {
            return null;
        }

        return User.builder()
                .name(createUserDto.getName())
                .email(createUserDto.getEmail())
                .phone(createUserDto.getPhone())
                .passwordHash(passwordHash)
                .role(User.Role.valueOf(createUserDto.getRole()))
                .status(User.Status.ACTIVE)
                .emailVerified(false)
                .phoneVerified(false)
                .build();
    }

    public void updateEntity(User user, UpdateUserDto updateUserDto) {
        if (user == null || updateUserDto == null) {
            return;
        }

        if (updateUserDto.getName() != null) {
            user.setName(updateUserDto.getName());
        }
        if (updateUserDto.getPhone() != null) {
            user.setPhone(updateUserDto.getPhone());
        }
        if (updateUserDto.getRole() != null) {
            user.setRole(User.Role.valueOf(updateUserDto.getRole()));
        }
        if (updateUserDto.getStatus() != null) {
            user.setStatus(User.Status.valueOf(updateUserDto.getStatus()));
        }
    }
}
