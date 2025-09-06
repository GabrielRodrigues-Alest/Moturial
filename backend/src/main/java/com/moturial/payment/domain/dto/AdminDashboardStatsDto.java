/**
 * Admin Dashboard Statistics DTO
 * 
 * Data Transfer Object for admin dashboard statistics following .ai-rules:
 * - Immutable design with validation
 * - Clear documentation and type safety
 * - Production-ready structure
 * 
 * @author Moturial Team
 * @version 1.0.0
 */

package com.moturial.payment.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Value
@Builder
@Schema(description = "Admin dashboard statistics")
public class AdminDashboardStatsDto {

    @Schema(description = "Total number of rentals", example = "150")
    @NotNull
    @PositiveOrZero
    Integer totalRentals;

    @Schema(description = "Number of active rentals", example = "12")
    @NotNull
    @PositiveOrZero
    Integer activeRentals;

    @Schema(description = "Total revenue generated", example = "15750.50")
    @NotNull
    @PositiveOrZero
    BigDecimal totalRevenue;

    @Schema(description = "Number of available motorcycles", example = "25")
    @NotNull
    @PositiveOrZero
    Integer availableMotorcycles;

    @Schema(description = "Total number of registered users", example = "89")
    @NotNull
    @PositiveOrZero
    Integer totalUsers;

    @Schema(description = "Number of active stores", example = "3")
    @NotNull
    @PositiveOrZero
    Integer activeStores;

    @Schema(description = "Revenue for current month", example = "3250.75")
    @NotNull
    @PositiveOrZero
    BigDecimal monthlyRevenue;

    @Schema(description = "Number of rentals this month", example = "28")
    @NotNull
    @PositiveOrZero
    Integer monthlyRentals;

    @Schema(description = "System status indicators")
    @NotNull
    SystemStatusDto systemStatus;

    @Schema(description = "Recent activity logs")
    @NotNull
    List<ActivityLogDto> recentActivities;

    @Schema(description = "Statistics generation timestamp")
    @NotNull
    LocalDateTime generatedAt;

    @Value
    @Builder
    @Schema(description = "System status information")
    public static class SystemStatusDto {

        @Schema(description = "API service status", example = "HEALTHY")
        @NotNull
        String apiStatus;

        @Schema(description = "Database connection status", example = "HEALTHY")
        @NotNull
        String databaseStatus;

        @Schema(description = "Payment system status", example = "HEALTHY")
        @NotNull
        String paymentStatus;

        @Schema(description = "External services status", example = "HEALTHY")
        @NotNull
        String externalServicesStatus;
    }

    @Value
    @Builder
    @Schema(description = "Activity log entry")
    public static class ActivityLogDto {

        @Schema(description = "Activity ID", example = "550e8400-e29b-41d4-a716-446655440000")
        @NotNull
        String id;

        @Schema(description = "Activity type", example = "RENTAL_CREATED")
        @NotNull
        String type;

        @Schema(description = "Activity description", example = "Nova locação criada por João Silva")
        @NotNull
        String description;

        @Schema(description = "User who performed the activity", example = "João Silva")
        String userName;

        @Schema(description = "Activity timestamp")
        @NotNull
        LocalDateTime timestamp;

        @Schema(description = "Activity severity level", example = "INFO")
        @NotNull
        String level;
    }
}
