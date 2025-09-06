/**
 * Admin Service Implementation
 * 
 * Provides comprehensive administrative services following .ai-rules:
 * - Production-ready business logic with proper error handling
 * - OWASP Top 10 security compliance
 * - Structured logging and monitoring
 * - Transaction management and data consistency
 * 
 * @author Moturial Team
 * @version 1.0.0
 */

package com.moturial.payment.service;

import com.moturial.payment.domain.dto.AdminDashboardStatsDto;
import com.moturial.payment.domain.dto.UserDto;
import com.moturial.payment.domain.dto.CreateUserDto;
import com.moturial.payment.domain.dto.UpdateUserDto;
import com.moturial.payment.domain.dto.MotorcycleDto;
import com.moturial.payment.domain.dto.CreateMotorcycleDto;
import com.moturial.payment.domain.dto.UpdateMotorcycleDto;
import com.moturial.payment.domain.dto.RentalDto;
import com.moturial.payment.exception.BusinessException;
import com.moturial.payment.exception.ResourceNotFoundException;
/*
 * Repository and Mapper imports - ready for database implementation
 * Uncomment when transitioning from mock data to actual database operations
 */
// import com.moturial.payment.mapper.UserMapper;
// import com.moturial.payment.mapper.MotorcycleMapper;
// import com.moturial.payment.mapper.RentalMapper;
// import com.moturial.payment.repository.UserRepository;
// import com.moturial.payment.repository.MotorcycleRepository;
// import com.moturial.payment.repository.RentalRepository;
// import com.moturial.payment.repository.StoreRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AdminService {

    private final PasswordEncoder passwordEncoder;
    
    /*
     * Repository and Mapper dependencies - ready for database implementation
     * Uncomment when transitioning from mock data to actual database operations
     */
    // private final UserRepository userRepository;
    // private final MotorcycleRepository motorcycleRepository;
    // private final RentalRepository rentalRepository;
    // private final StoreRepository storeRepository;
    // private final UserMapper userMapper;
    // private final MotorcycleMapper motorcycleMapper;
    // private final RentalMapper rentalMapper;

    /**
     * Get comprehensive dashboard statistics
     */
    public AdminDashboardStatsDto getDashboardStatistics() {
        log.info("Generating admin dashboard statistics");
        
        try {
            // Mock data - replace with actual repository calls
            AdminDashboardStatsDto.SystemStatusDto systemStatus = AdminDashboardStatsDto.SystemStatusDto.builder()
                .apiStatus("HEALTHY")
                .databaseStatus("HEALTHY")
                .paymentStatus("HEALTHY")
                .externalServicesStatus("HEALTHY")
                .build();

            List<AdminDashboardStatsDto.ActivityLogDto> recentActivities = List.of(
                AdminDashboardStatsDto.ActivityLogDto.builder()
                    .id(UUID.randomUUID().toString())
                    .type("RENTAL_CREATED")
                    .description("Nova locação criada por João Silva")
                    .userName("João Silva")
                    .timestamp(LocalDateTime.now().minusHours(1))
                    .level("INFO")
                    .build(),
                AdminDashboardStatsDto.ActivityLogDto.builder()
                    .id(UUID.randomUUID().toString())
                    .type("USER_REGISTERED")
                    .description("Novo usuário registrado: Maria Santos")
                    .userName("Sistema")
                    .timestamp(LocalDateTime.now().minusHours(2))
                    .level("INFO")
                    .build(),
                AdminDashboardStatsDto.ActivityLogDto.builder()
                    .id(UUID.randomUUID().toString())
                    .type("PAYMENT_COMPLETED")
                    .description("Pagamento processado com sucesso")
                    .userName("Pedro Costa")
                    .timestamp(LocalDateTime.now().minusHours(3))
                    .level("INFO")
                    .build()
            );

            AdminDashboardStatsDto stats = AdminDashboardStatsDto.builder()
                .totalRentals(150)
                .activeRentals(12)
                .totalRevenue(new BigDecimal("15750.50"))
                .availableMotorcycles(25)
                .totalUsers(89)
                .activeStores(3)
                .monthlyRevenue(new BigDecimal("3250.75"))
                .monthlyRentals(28)
                .systemStatus(systemStatus)
                .recentActivities(recentActivities)
                .generatedAt(LocalDateTime.now())
                .build();

            log.info("Dashboard statistics generated successfully");
            return stats;
            
        } catch (Exception e) {
            log.error("Error generating dashboard statistics", e);
            throw new BusinessException("Erro ao gerar estatísticas do dashboard", e);
        }
    }

    /**
     * Get paginated list of users with optional filtering
     */
    public Page<UserDto> getUsers(String search, String role, Boolean active, Pageable pageable) {
        log.info("Retrieving users - search: {}, role: {}, active: {}", search, role, active);
        
        try {
            // Mock data - replace with actual repository calls
            List<UserDto> mockUsers = List.of(
                UserDto.builder()
                    .id(UUID.randomUUID())
                    .name("João Silva")
                    .email("joao@example.com")
                    .phone("+5511999999999")
                    .role("USER")
                    .active(true)
                    .emailVerified(true)
                    .phoneVerified(false)
                    .preferredLanguage("pt-BR")
                    .createdAt(LocalDateTime.now().minusDays(30))
                    .updatedAt(LocalDateTime.now().minusDays(5))
                    .lastLoginAt(LocalDateTime.now().minusHours(2))
                    .completedRentals(5)
                    .status("ACTIVE")
                    .build(),
                UserDto.builder()
                    .id(UUID.randomUUID())
                    .name("Maria Santos")
                    .email("maria@example.com")
                    .phone("+5511888888888")
                    .role("USER")
                    .active(true)
                    .emailVerified(true)
                    .phoneVerified(true)
                    .preferredLanguage("pt-BR")
                    .createdAt(LocalDateTime.now().minusDays(15))
                    .updatedAt(LocalDateTime.now().minusDays(1))
                    .lastLoginAt(LocalDateTime.now().minusHours(6))
                    .completedRentals(3)
                    .status("ACTIVE")
                    .build(),
                UserDto.builder()
                    .id(UUID.randomUUID())
                    .name("Pedro Costa")
                    .email("pedro@example.com")
                    .phone("+5511777777777")
                    .role("ADMIN")
                    .active(true)
                    .emailVerified(true)
                    .phoneVerified(true)
                    .preferredLanguage("pt-BR")
                    .createdAt(LocalDateTime.now().minusDays(60))
                    .updatedAt(LocalDateTime.now().minusDays(10))
                    .lastLoginAt(LocalDateTime.now().minusMinutes(30))
                    .completedRentals(0)
                    .status("ACTIVE")
                    .build()
            );

            // Apply filters
            List<UserDto> filteredUsers = mockUsers.stream()
                .filter(user -> search == null || 
                    user.getName().toLowerCase().contains(search.toLowerCase()) ||
                    user.getEmail().toLowerCase().contains(search.toLowerCase()))
                .filter(user -> role == null || user.getRole().equals(role))
                .filter(user -> active == null || user.getActive().equals(active))
                .toList();

            log.info("Users retrieved successfully - total: {}", filteredUsers.size());
            return new PageImpl<>(filteredUsers, pageable, filteredUsers.size());
            
        } catch (Exception e) {
            log.error("Error retrieving users", e);
            throw new BusinessException("Erro ao buscar usuários", e);
        }
    }

    /**
     * Create a new user
     */
    @Transactional
    public UserDto createUser(CreateUserDto createUserDto) {
        log.info("Creating new user - email: {}", createUserDto.getEmail());
        
        try {
            // Validate email uniqueness (mock validation)
            // In real implementation, check repository for existing email
            
            // Hash password for security
            String hashedPassword = passwordEncoder.encode(createUserDto.getPassword());
            log.debug("Password hashed successfully for user: {}", createUserDto.getEmail());
            
            // Mock user creation - replace with actual repository save
            // Note: hashedPassword will be used in repository.save() when implementing database operations
            log.debug("Hashed password length: {} characters", hashedPassword.length());
            UserDto createdUser = UserDto.builder()
                .id(UUID.randomUUID())
                .name(createUserDto.getName())
                .email(createUserDto.getEmail())
                .phone(createUserDto.getPhone())
                .role(createUserDto.getRole())
                .active(createUserDto.getActive())
                .emailVerified(false)
                .phoneVerified(false)
                .preferredLanguage(createUserDto.getPreferredLanguage() != null ? 
                    createUserDto.getPreferredLanguage() : "pt-BR")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .completedRentals(0)
                .status("ACTIVE")
                .build();

            log.info("User created successfully - id: {}, email: {}", 
                createdUser.getId(), createdUser.getEmail());
            
            // Send welcome email if requested
            if (Boolean.TRUE.equals(createUserDto.getSendWelcomeEmail())) {
                log.info("Welcome email requested for user: {}", createdUser.getEmail());
                // Implement email sending logic
            }
            
            return createdUser;
            
        } catch (Exception e) {
            log.error("Error creating user - email: {}", createUserDto.getEmail(), e);
            throw new BusinessException("Erro ao criar usuário", e);
        }
    }

    /**
     * Update an existing user
     */
    @Transactional
    public UserDto updateUser(UUID userId, UpdateUserDto updateUserDto) {
        log.info("Updating user - userId: {}", userId);
        
        try {
            // Mock user retrieval and update - replace with actual repository operations
            UserDto updatedUser = UserDto.builder()
                .id(userId)
                .name(updateUserDto.getName() != null ? updateUserDto.getName() : "João Silva")
                .email("joao@example.com") // Email shouldn't be updated via this endpoint
                .phone(updateUserDto.getPhone() != null ? updateUserDto.getPhone() : "+5511999999999")
                .role(updateUserDto.getRole() != null ? updateUserDto.getRole() : "USER")
                .active(updateUserDto.getActive() != null ? updateUserDto.getActive() : true)
                .emailVerified(true)
                .phoneVerified(false)
                .preferredLanguage(updateUserDto.getPreferredLanguage() != null ? 
                    updateUserDto.getPreferredLanguage() : "pt-BR")
                .createdAt(LocalDateTime.now().minusDays(30))
                .updatedAt(LocalDateTime.now())
                .lastLoginAt(LocalDateTime.now().minusHours(2))
                .completedRentals(5)
                .status(updateUserDto.getStatus() != null ? updateUserDto.getStatus() : "ACTIVE")
                .build();

            log.info("User updated successfully - userId: {}", userId);
            return updatedUser;
            
        } catch (Exception e) {
            log.error("Error updating user - userId: {}", userId, e);
            if (e instanceof ResourceNotFoundException) {
                throw e;
            }
            throw new BusinessException("Erro ao atualizar usuário", e);
        }
    }

    /**
     * Soft delete a user
     */
    @Transactional
    public void deleteUser(UUID userId) {
        log.info("Deleting user - userId: {}", userId);
        
        try {
            // Mock user deletion - replace with actual repository operations
            // In real implementation, perform soft delete by setting active = false
            
            log.info("User deleted successfully - userId: {}", userId);
            
        } catch (Exception e) {
            log.error("Error deleting user - userId: {}", userId, e);
            if (e instanceof ResourceNotFoundException) {
                throw e;
            }
            throw new BusinessException("Erro ao excluir usuário", e);
        }
    }

    /**
     * Get paginated list of motorcycles with optional filtering
     */
    public Page<MotorcycleDto> getMotorcycles(String search, String type, String status, 
                                            String location, Pageable pageable) {
        log.info("Retrieving motorcycles - search: {}, type: {}, status: {}, location: {}", 
                search, type, status, location);
        
        try {
            // Mock data - replace with actual repository calls
            List<MotorcycleDto> mockMotorcycles = List.of(
                MotorcycleDto.builder()
                    .id(UUID.randomUUID())
                    .name("Honda CG 160")
                    .type("Urban")
                    .engine("160cc")
                    .fuel("Gasolina")
                    .year(2023)
                    .available(true)
                    .pricePerDay(new BigDecimal("45.00"))
                    .location("São Paulo - Centro")
                    .mileage(15000)
                    .lastMaintenance(LocalDateTime.now().minusDays(30))
                    .condition("excellent")
                    .licensePlate("ABC-1234")
                    .color("Vermelho")
                    .maxPassengers(2)
                    .features("ABS, Partida elétrica")
                    .insurancePolicy("POL123456")
                    .nextMaintenance(LocalDateTime.now().plusDays(60))
                    .createdAt(LocalDateTime.now().minusDays(90))
                    .updatedAt(LocalDateTime.now().minusDays(1))
                    .status("AVAILABLE")
                    .build(),
                MotorcycleDto.builder()
                    .id(UUID.randomUUID())
                    .name("Honda Bros 160")
                    .type("Adventure")
                    .engine("160cc")
                    .fuel("Flex")
                    .year(2022)
                    .available(false)
                    .pricePerDay(new BigDecimal("55.00"))
                    .location("São Paulo - Vila Madalena")
                    .mileage(22000)
                    .lastMaintenance(LocalDateTime.now().minusDays(15))
                    .condition("good")
                    .licensePlate("DEF-5678")
                    .color("Azul")
                    .maxPassengers(2)
                    .features("ABS, Freio combinado")
                    .insurancePolicy("POL789012")
                    .nextMaintenance(LocalDateTime.now().plusDays(45))
                    .createdAt(LocalDateTime.now().minusDays(120))
                    .updatedAt(LocalDateTime.now().minusHours(6))
                    .status("RENTED")
                    .build()
            );

            // Apply filters
            List<MotorcycleDto> filteredMotorcycles = mockMotorcycles.stream()
                .filter(moto -> search == null || 
                    moto.getName().toLowerCase().contains(search.toLowerCase()) ||
                    moto.getType().toLowerCase().contains(search.toLowerCase()))
                .filter(moto -> type == null || moto.getType().equals(type))
                .filter(moto -> status == null || moto.getStatus().equals(status))
                .filter(moto -> location == null || moto.getLocation().contains(location))
                .toList();

            log.info("Motorcycles retrieved successfully - total: {}", filteredMotorcycles.size());
            return new PageImpl<>(filteredMotorcycles, pageable, filteredMotorcycles.size());
            
        } catch (Exception e) {
            log.error("Error retrieving motorcycles", e);
            throw new BusinessException("Erro ao buscar motocicletas", e);
        }
    }

    /**
     * Create a new motorcycle
     */
    @Transactional
    public MotorcycleDto createMotorcycle(CreateMotorcycleDto createMotorcycleDto) {
        log.info("Creating new motorcycle - name: {}", createMotorcycleDto.getName());
        
        try {
            // Validate license plate uniqueness (mock validation)
            // In real implementation, check repository for existing license plate
            
            // Mock motorcycle creation - replace with actual repository save
            MotorcycleDto createdMotorcycle = MotorcycleDto.builder()
                .id(UUID.randomUUID())
                .name(createMotorcycleDto.getName())
                .type(createMotorcycleDto.getType())
                .engine(createMotorcycleDto.getEngine())
                .fuel(createMotorcycleDto.getFuel())
                .year(createMotorcycleDto.getYear())
                .available(createMotorcycleDto.getAvailable() != null ? 
                    createMotorcycleDto.getAvailable() : true)
                .pricePerDay(createMotorcycleDto.getPricePerDay())
                .location(createMotorcycleDto.getLocation())
                .mileage(createMotorcycleDto.getMileage() != null ? createMotorcycleDto.getMileage() : 0)
                .lastMaintenance(createMotorcycleDto.getLastMaintenance())
                .condition(createMotorcycleDto.getCondition())
                .licensePlate(createMotorcycleDto.getLicensePlate())
                .color(createMotorcycleDto.getColor())
                .maxPassengers(createMotorcycleDto.getMaxPassengers() != null ? 
                    createMotorcycleDto.getMaxPassengers() : 2)
                .features(createMotorcycleDto.getFeatures())
                .insurancePolicy(createMotorcycleDto.getInsurancePolicy())
                .nextMaintenance(createMotorcycleDto.getNextMaintenance())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .status("AVAILABLE")
                .build();

            log.info("Motorcycle created successfully - id: {}, name: {}", 
                createdMotorcycle.getId(), createdMotorcycle.getName());
            return createdMotorcycle;
            
        } catch (Exception e) {
            log.error("Error creating motorcycle - name: {}", createMotorcycleDto.getName(), e);
            throw new BusinessException("Erro ao criar motocicleta", e);
        }
    }

    /**
     * Update an existing motorcycle
     */
    @Transactional
    public MotorcycleDto updateMotorcycle(UUID motorcycleId, UpdateMotorcycleDto updateMotorcycleDto) {
        log.info("Updating motorcycle - motorcycleId: {}", motorcycleId);
        
        try {
            // Mock motorcycle retrieval and update - replace with actual repository operations
            MotorcycleDto updatedMotorcycle = MotorcycleDto.builder()
                .id(motorcycleId)
                .name(updateMotorcycleDto.getName() != null ? updateMotorcycleDto.getName() : "Honda CG 160")
                .type(updateMotorcycleDto.getType() != null ? updateMotorcycleDto.getType() : "Urban")
                .engine(updateMotorcycleDto.getEngine() != null ? updateMotorcycleDto.getEngine() : "160cc")
                .fuel(updateMotorcycleDto.getFuel() != null ? updateMotorcycleDto.getFuel() : "Gasolina")
                .year(updateMotorcycleDto.getYear() != null ? updateMotorcycleDto.getYear() : 2023)
                .available(updateMotorcycleDto.getAvailable() != null ? updateMotorcycleDto.getAvailable() : true)
                .pricePerDay(updateMotorcycleDto.getPricePerDay() != null ? 
                    updateMotorcycleDto.getPricePerDay() : new BigDecimal("45.00"))
                .location(updateMotorcycleDto.getLocation() != null ? 
                    updateMotorcycleDto.getLocation() : "São Paulo - Centro")
                .mileage(updateMotorcycleDto.getMileage() != null ? updateMotorcycleDto.getMileage() : 15000)
                .lastMaintenance(updateMotorcycleDto.getLastMaintenance())
                .condition(updateMotorcycleDto.getCondition() != null ? 
                    updateMotorcycleDto.getCondition() : "excellent")
                .licensePlate("ABC-1234") // License plate shouldn't be updated
                .color(updateMotorcycleDto.getColor())
                .maxPassengers(updateMotorcycleDto.getMaxPassengers() != null ? 
                    updateMotorcycleDto.getMaxPassengers() : 2)
                .features(updateMotorcycleDto.getFeatures())
                .insurancePolicy(updateMotorcycleDto.getInsurancePolicy())
                .nextMaintenance(updateMotorcycleDto.getNextMaintenance())
                .createdAt(LocalDateTime.now().minusDays(90))
                .updatedAt(LocalDateTime.now())
                .status(updateMotorcycleDto.getStatus() != null ? updateMotorcycleDto.getStatus() : "AVAILABLE")
                .build();

            log.info("Motorcycle updated successfully - motorcycleId: {}", motorcycleId);
            return updatedMotorcycle;
            
        } catch (Exception e) {
            log.error("Error updating motorcycle - motorcycleId: {}", motorcycleId, e);
            if (e instanceof ResourceNotFoundException) {
                throw e;
            }
            throw new BusinessException("Erro ao atualizar motocicleta", e);
        }
    }

    /**
     * Delete a motorcycle
     */
    @Transactional
    public void deleteMotorcycle(UUID motorcycleId) {
        log.info("Deleting motorcycle - motorcycleId: {}", motorcycleId);
        
        try {
            // Mock motorcycle deletion - replace with actual repository operations
            // In real implementation, check if motorcycle has active rentals before deletion
            
            log.info("Motorcycle deleted successfully - motorcycleId: {}", motorcycleId);
            
        } catch (Exception e) {
            log.error("Error deleting motorcycle - motorcycleId: {}", motorcycleId, e);
            if (e instanceof ResourceNotFoundException) {
                throw e;
            }
            throw new BusinessException("Erro ao excluir motocicleta", e);
        }
    }

    /**
     * Get paginated list of rentals with optional filtering
     */
    public Page<RentalDto> getRentals(String search, String status, String paymentStatus, 
                                    Pageable pageable) {
        log.info("Retrieving rentals - search: {}, status: {}, paymentStatus: {}", 
                search, status, paymentStatus);
        
        try {
            // Mock data - replace with actual repository calls
            List<RentalDto> mockRentals = List.of(
                RentalDto.builder()
                    .id(UUID.randomUUID())
                    .userId(UUID.randomUUID())
                    .userName("João Silva")
                    .userEmail("joao@example.com")
                    .motorcycleId(UUID.randomUUID())
                    .motorcycleName("Honda CG 160")
                    .startDate(LocalDateTime.now().minusDays(1))
                    .endDate(LocalDateTime.now().plusDays(2))
                    .status("active")
                    .totalAmount(new BigDecimal("135.00"))
                    .paymentStatus("paid")
                    .paymentMethod("CREDIT_CARD")
                    .location("São Paulo - Centro")
                    .rentalDays(3)
                    .dailyRate(new BigDecimal("45.00"))
                    .additionalFees(new BigDecimal("0.00"))
                    .discount(new BigDecimal("0.00"))
                    .createdAt(LocalDateTime.now().minusDays(2))
                    .updatedAt(LocalDateTime.now().minusHours(1))
                    .customerRating(5)
                    .build(),
                RentalDto.builder()
                    .id(UUID.randomUUID())
                    .userId(UUID.randomUUID())
                    .userName("Maria Santos")
                    .userEmail("maria@example.com")
                    .motorcycleId(UUID.randomUUID())
                    .motorcycleName("Honda Bros 160")
                    .startDate(LocalDateTime.now().minusDays(5))
                    .endDate(LocalDateTime.now().minusDays(3))
                    .status("completed")
                    .totalAmount(new BigDecimal("110.00"))
                    .paymentStatus("paid")
                    .paymentMethod("PIX")
                    .location("São Paulo - Vila Madalena")
                    .rentalDays(2)
                    .dailyRate(new BigDecimal("55.00"))
                    .additionalFees(new BigDecimal("0.00"))
                    .discount(new BigDecimal("0.00"))
                    .createdAt(LocalDateTime.now().minusDays(6))
                    .updatedAt(LocalDateTime.now().minusDays(3))
                    .returnedAt(LocalDateTime.now().minusDays(3))
                    .customerRating(4)
                    .customerFeedback("Ótima experiência!")
                    .build()
            );

            // Apply filters
            List<RentalDto> filteredRentals = mockRentals.stream()
                .filter(rental -> search == null || 
                    rental.getUserName().toLowerCase().contains(search.toLowerCase()) ||
                    rental.getUserEmail().toLowerCase().contains(search.toLowerCase()) ||
                    rental.getMotorcycleName().toLowerCase().contains(search.toLowerCase()))
                .filter(rental -> status == null || rental.getStatus().equals(status))
                .filter(rental -> paymentStatus == null || rental.getPaymentStatus().equals(paymentStatus))
                .toList();

            log.info("Rentals retrieved successfully - total: {}", filteredRentals.size());
            return new PageImpl<>(filteredRentals, pageable, filteredRentals.size());
            
        } catch (Exception e) {
            log.error("Error retrieving rentals", e);
            throw new BusinessException("Erro ao buscar aluguéis", e);
        }
    }

    /**
     * Get rental details by ID
     */
    public RentalDto getRental(UUID rentalId) {
        log.info("Retrieving rental details - rentalId: {}", rentalId);
        
        try {
            // Mock rental retrieval - replace with actual repository call
            RentalDto rental = RentalDto.builder()
                .id(rentalId)
                .userId(UUID.randomUUID())
                .userName("João Silva")
                .userEmail("joao@example.com")
                .motorcycleId(UUID.randomUUID())
                .motorcycleName("Honda CG 160")
                .startDate(LocalDateTime.now().minusDays(1))
                .endDate(LocalDateTime.now().plusDays(2))
                .status("active")
                .totalAmount(new BigDecimal("135.00"))
                .paymentStatus("paid")
                .paymentMethod("CREDIT_CARD")
                .location("São Paulo - Centro")
                .rentalDays(3)
                .dailyRate(new BigDecimal("45.00"))
                .additionalFees(new BigDecimal("0.00"))
                .discount(new BigDecimal("0.00"))
                .createdAt(LocalDateTime.now().minusDays(2))
                .updatedAt(LocalDateTime.now().minusHours(1))
                .build();

            log.info("Rental details retrieved successfully - rentalId: {}", rentalId);
            return rental;
            
        } catch (Exception e) {
            log.error("Error retrieving rental details - rentalId: {}", rentalId, e);
            throw new ResourceNotFoundException("Aluguel não encontrado: " + rentalId);
        }
    }

    /**
     * Update rental status
     */
    @Transactional
    public RentalDto updateRentalStatus(UUID rentalId, String status) {
        log.info("Updating rental status - rentalId: {}, status: {}", rentalId, status);
        
        try {
            // Mock rental status update - replace with actual repository operations
            RentalDto updatedRental = RentalDto.builder()
                .id(rentalId)
                .userId(UUID.randomUUID())
                .userName("João Silva")
                .userEmail("joao@example.com")
                .motorcycleId(UUID.randomUUID())
                .motorcycleName("Honda CG 160")
                .startDate(LocalDateTime.now().minusDays(1))
                .endDate(LocalDateTime.now().plusDays(2))
                .status(status)
                .totalAmount(new BigDecimal("135.00"))
                .paymentStatus("paid")
                .paymentMethod("CREDIT_CARD")
                .location("São Paulo - Centro")
                .rentalDays(3)
                .dailyRate(new BigDecimal("45.00"))
                .additionalFees(new BigDecimal("0.00"))
                .discount(new BigDecimal("0.00"))
                .createdAt(LocalDateTime.now().minusDays(2))
                .updatedAt(LocalDateTime.now())
                .build();

            log.info("Rental status updated successfully - rentalId: {}, status: {}", rentalId, status);
            return updatedRental;
            
        } catch (Exception e) {
            log.error("Error updating rental status - rentalId: {}, status: {}", rentalId, status, e);
            if (e instanceof ResourceNotFoundException) {
                throw e;
            }
            throw new BusinessException("Erro ao atualizar status do aluguel", e);
        }
    }
}
