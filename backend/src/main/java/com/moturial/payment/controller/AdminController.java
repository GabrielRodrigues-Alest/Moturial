package com.moturial.payment.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.moturial.payment.domain.dto.AdminDashboardStatsDto;
import com.moturial.payment.domain.dto.CreateMotorcycleDto;
import com.moturial.payment.domain.dto.UpdateMotorcycleDto;
import com.moturial.payment.domain.dto.CreateUserDto;
import com.moturial.payment.domain.dto.UpdateUserDto;
import com.moturial.payment.domain.dto.UserDto;
import com.moturial.payment.domain.dto.MotorcycleDto;
import com.moturial.payment.domain.dto.RentalDto;
import com.moturial.payment.service.AdminService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.UUID;

/**
 * Administrative REST Controller for Moturial System
 * 
 * Provides comprehensive administrative operations including:
 * - Dashboard statistics and monitoring
 * - User management (CRUD operations)
 * - Motorcycle fleet management
 * - Rental management and monitoring
 * 
 * Security Features:
 * - API key authentication required
 * - Role-based access control (ADMIN/STAFF)
 * - Input validation and sanitization
 * - Structured logging and audit trail
 * - OWASP Top 10 security compliance
 * 
 * @author Moturial Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Validated
@Slf4j
public class AdminController {

    private final AdminService adminService;

    // Dashboard Statistics
    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardStatsDto> getDashboardStats() {
        log.info("Admin dashboard stats requested");
        
        try {
            AdminDashboardStatsDto stats = adminService.getDashboardStatistics();
            log.info("Dashboard stats retrieved successfully");
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error retrieving dashboard stats", e);
            throw e;
        }
    }

    // User Management
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserDto>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean active,
            @PageableDefault(size = 20) Pageable pageable) {
        
        log.info("Admin users list requested - search: {}, role: {}, active: {}, page: {}", 
                search, role, active, pageable.getPageNumber());
        
        try {
            Page<UserDto> users = adminService.getUsers(search, role, active, pageable);
            log.info("Users retrieved successfully - count: {}", users.getTotalElements());
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Error retrieving users", e);
            throw e;
        }
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserDto createUserDto) {
        log.info("Admin user creation requested - email: {}, role: {}", 
                createUserDto.getEmail(), createUserDto.getRole());
        
        try {
            UserDto createdUser = adminService.createUser(createUserDto);
            log.info("User created successfully - userId: {}", createdUser.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (Exception e) {
            log.error("Error creating user", e);
            throw e;
        }
    }

    @PutMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable @NotNull UUID userId,
            @Valid @RequestBody UpdateUserDto updateUserDto) {
        
        log.info("Admin user update requested - userId: {}", userId);
        
        try {
            UserDto updatedUser = adminService.updateUser(userId, updateUserDto);
            log.info("User updated successfully - userId: {}", userId);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            log.error("Error updating user - userId: {}", userId, e);
            throw e;
        }
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable @NotNull UUID userId) {
        log.info("Admin user deletion requested - userId: {}", userId);
        
        try {
            adminService.deleteUser(userId);
            log.info("User deleted successfully - userId: {}", userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting user - userId: {}", userId, e);
            throw e;
        }
    }

    // Motorcycle Management
    @GetMapping("/motorcycles")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<Page<MotorcycleDto>> getMotorcycles(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String location,
            @PageableDefault(size = 20) Pageable pageable) {
        
        log.info("Admin motorcycles list requested - search: {}, type: {}, status: {}, location: {}", 
                search, type, status, location);
        
        try {
            Page<MotorcycleDto> motorcycles = adminService.getMotorcycles(search, type, status, location, pageable);
            log.info("Motorcycles retrieved successfully - count: {}", motorcycles.getTotalElements());
            return ResponseEntity.ok(motorcycles);
        } catch (Exception e) {
            log.error("Error retrieving motorcycles", e);
            throw e;
        }
    }

    @PostMapping("/motorcycles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MotorcycleDto> createMotorcycle(@Valid @RequestBody CreateMotorcycleDto createMotorcycleDto) {
        log.info("Admin motorcycle creation requested - name: {}, type: {}", 
                createMotorcycleDto.getName(), createMotorcycleDto.getType());
        
        try {
            MotorcycleDto createdMotorcycle = adminService.createMotorcycle(createMotorcycleDto);
            log.info("Motorcycle created successfully - motorcycleId: {}", createdMotorcycle.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdMotorcycle);
        } catch (Exception e) {
            log.error("Error creating motorcycle", e);
            throw e;
        }
    }

    @PutMapping("/motorcycles/{motorcycleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MotorcycleDto> updateMotorcycle(
            @PathVariable @NotNull UUID motorcycleId,
            @Valid @RequestBody UpdateMotorcycleDto updateMotorcycleDto) {
        
        log.info("Admin motorcycle update requested - motorcycleId: {}", motorcycleId);
        
        try {
            MotorcycleDto updatedMotorcycle = adminService.updateMotorcycle(motorcycleId, updateMotorcycleDto);
            log.info("Motorcycle updated successfully - motorcycleId: {}", motorcycleId);
            return ResponseEntity.ok(updatedMotorcycle);
        } catch (Exception e) {
            log.error("Error updating motorcycle - motorcycleId: {}", motorcycleId, e);
            throw e;
        }
    }

    @DeleteMapping("/motorcycles/{motorcycleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMotorcycle(@PathVariable @NotNull UUID motorcycleId) {
        log.info("Admin motorcycle deletion requested - motorcycleId: {}", motorcycleId);
        
        try {
            adminService.deleteMotorcycle(motorcycleId);
            log.info("Motorcycle deleted successfully - motorcycleId: {}", motorcycleId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting motorcycle - motorcycleId: {}", motorcycleId, e);
            throw e;
        }
    }

    // Rental Management
    @GetMapping("/rentals")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<Page<RentalDto>> getRentals(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentStatus,
            @PageableDefault(size = 20) Pageable pageable) {
        
        log.info("Admin rentals list requested - search: {}, status: {}, paymentStatus: {}", 
                search, status, paymentStatus);
        
        try {
            Page<RentalDto> rentals = adminService.getRentals(search, status, paymentStatus, pageable);
            log.info("Rentals retrieved successfully - count: {}", rentals.getTotalElements());
            return ResponseEntity.ok(rentals);
        } catch (Exception e) {
            log.error("Error retrieving rentals", e);
            throw e;
        }
    }

    @GetMapping("/rentals/{rentalId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<RentalDto> getRental(@PathVariable @NotNull UUID rentalId) {
        log.info("Admin rental details requested - rentalId: {}", rentalId);
        
        try {
            RentalDto rental = adminService.getRental(rentalId);
            log.info("Rental details retrieved successfully - rentalId: {}", rentalId);
            return ResponseEntity.ok(rental);
        } catch (Exception e) {
            log.error("Error retrieving rental - rentalId: {}", rentalId, e);
            throw e;
        }
    }

    @PutMapping("/rentals/{rentalId}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<RentalDto> updateRentalStatus(
            @PathVariable @NotNull UUID rentalId,
            @RequestParam @NotBlank String status) {
        
        log.info("Admin rental status update requested - rentalId: {}, newStatus: {}", rentalId, status);
        
        try {
            RentalDto updatedRental = adminService.updateRentalStatus(rentalId, status);
            log.info("Rental status updated successfully - rentalId: {}, status: {}", rentalId, status);
            return ResponseEntity.ok(updatedRental);
        } catch (Exception e) {
            log.error("Error updating rental status - rentalId: {}, status: {}", rentalId, status, e);
            throw e;
        }
    }
}
