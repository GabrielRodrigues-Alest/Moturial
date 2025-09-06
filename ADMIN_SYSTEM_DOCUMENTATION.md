# Moturial Admin System Documentation

## Overview

This document provides comprehensive documentation for the Moturial Admin System, a complete administrative interface for managing the motorcycle rental platform. The system follows strict .ai-rules compliance for production-ready, secure, and maintainable code.

## Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **State Management**: React Query for server state, React Context for authentication
- **UI Library**: Radix UI components with Tailwind CSS
- **Routing**: React Router v6 with protected admin routes
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Spring Boot 3.x with Java 21
- **Database**: PostgreSQL with Flyway migrations
- **Security**: API Key authentication with role-based access control
- **Documentation**: OpenAPI 3.0 (Swagger) with comprehensive annotations
- **Validation**: Bean Validation (JSR-303) with custom validation groups

## Security Implementation

### Authentication & Authorization
- **API Key Authentication**: Secure API key-based authentication for admin access
- **Role-Based Access Control (RBAC)**: Three-tier role system (USER, STAFF, ADMIN)
- **Protected Routes**: Frontend route protection with role verification
- **Security Headers**: CORS, CSP, and other security headers configured

### Security Features
- **Input Validation**: Comprehensive validation on all endpoints
- **SQL Injection Prevention**: Parameterized queries and ORM usage
- **XSS Protection**: Input sanitization and output encoding
- **CSRF Protection**: Token-based CSRF protection
- **Rate Limiting**: API rate limiting to prevent abuse
- **Audit Logging**: Comprehensive security event logging

## Admin System Features

### 1. Dashboard Analytics
**Location**: `/src/pages/AdminDashboard.tsx`
- Real-time system metrics and KPIs
- Revenue and transaction statistics
- System health monitoring
- Recent activity logs
- Quick action buttons for common tasks

### 2. User Management
**Location**: `/src/pages/AdminUsers.tsx`
- Complete CRUD operations for users
- Advanced search and filtering
- Role assignment and permissions
- User status management
- Bulk operations support

### 3. Motorcycle Fleet Management
**Location**: `/src/pages/AdminMotorcycles.tsx`
- Fleet inventory management
- Motorcycle specifications and maintenance tracking
- Availability status management
- Location and pricing management
- Condition monitoring and reporting

### 4. Rental Management
**Location**: `/src/pages/AdminRentals.tsx`
- Comprehensive rental lifecycle management
- Real-time rental status tracking
- Payment status monitoring
- Customer communication tools
- Rental analytics and reporting

### 5. Store Management
**Location**: `/src/pages/AdminStores.tsx`
- Multi-location store management
- Store performance metrics
- Staff assignment and management
- Operating hours and contact information
- Fleet distribution across stores

### 6. Financial Reports & Analytics
**Location**: `/src/pages/AdminReports.tsx`
- Revenue analytics and trends
- Payment processing monitoring
- Transaction success rates
- Refund and chargeback tracking
- Financial performance metrics

## API Endpoints

### Admin Controller
**Base Path**: `/api/v1/admin`

#### Dashboard
- `GET /dashboard/stats` - Retrieve dashboard statistics

#### User Management
- `GET /users` - List users with pagination and filtering
- `POST /users` - Create new user
- `PUT /users/{userId}` - Update user information
- `DELETE /users/{userId}` - Soft delete user

#### Motorcycle Management
- `GET /motorcycles` - List motorcycles with filtering
- `POST /motorcycles` - Add new motorcycle
- `PUT /motorcycles/{motorcycleId}` - Update motorcycle
- `DELETE /motorcycles/{motorcycleId}` - Remove motorcycle

#### Rental Management
- `GET /rentals` - List rentals with filtering
- `GET /rentals/{rentalId}` - Get rental details
- `PUT /rentals/{rentalId}/status` - Update rental status

## Data Models

### User DTO
```typescript
interface UserDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN' | 'STAFF';
  active: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  preferredLanguage?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  completedRentals: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
}
```

### Motorcycle DTO
```typescript
interface MotorcycleDto {
  id: string;
  name: string;
  type: 'Urban' | 'Sport' | 'Adventure' | 'Scooter';
  engine: string;
  fuel: 'Gasolina' | 'Etanol' | 'Flex' | 'Elétrica';
  year: number;
  available: boolean;
  pricePerDay: number;
  location: string;
  mileage?: number;
  condition: 'excellent' | 'good' | 'fair' | 'maintenance';
  licensePlate: string;
  color?: string;
  maxPassengers: number;
  features?: string;
  insurancePolicy?: string;
  status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'INACTIVE';
}
```

### Rental DTO
```typescript
interface RentalDto {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  motorcycleId: string;
  motorcycleName: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  location: string;
  rentalDays: number;
  dailyRate: number;
  additionalFees: number;
  discount: number;
}
```

## Configuration

### Environment Variables

#### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_API_KEY=your-admin-api-key
VITE_ENVIRONMENT=development
```

#### Backend (application.yml)
```yaml
moturial:
  admin:
    api-key: ${ADMIN_API_KEY:admin-secure-key}
  staff:
    api-key: ${STAFF_API_KEY:staff-secure-key}

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/moturial
    username: ${DB_USERNAME:moturial}
    password: ${DB_PASSWORD:password}
  
  security:
    cors:
      allowed-origins: ${CORS_ORIGINS:http://localhost:3000}
      allowed-methods: GET,POST,PUT,DELETE,OPTIONS
      allowed-headers: "*"
      allow-credentials: true
```

## Deployment

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Configure environment variables
4. Set up custom domain and SSL

### Backend Deployment
1. Package the application: `./mvnw clean package`
2. Deploy to cloud platform (AWS, GCP, Azure)
3. Configure database connection
4. Set up environment variables
5. Configure load balancer and SSL

## Security Checklist

### OWASP Top 10 Compliance
- ✅ **A01 - Broken Access Control**: Role-based access control implemented
- ✅ **A02 - Cryptographic Failures**: Secure password hashing and API key management
- ✅ **A03 - Injection**: Parameterized queries and input validation
- ✅ **A04 - Insecure Design**: Security-by-design architecture
- ✅ **A05 - Security Misconfiguration**: Secure defaults and configuration
- ✅ **A06 - Vulnerable Components**: Regular dependency updates
- ✅ **A07 - Authentication Failures**: Secure authentication mechanisms
- ✅ **A08 - Software Integrity Failures**: Code signing and integrity checks
- ✅ **A09 - Logging Failures**: Comprehensive security logging
- ✅ **A10 - Server-Side Request Forgery**: Input validation and allowlisting

### Additional Security Measures
- API rate limiting
- Request/response logging
- Error handling without information disclosure
- Secure session management
- Regular security audits

## Monitoring & Logging

### Application Metrics
- Request/response times
- Error rates and types
- User activity patterns
- System resource usage

### Security Monitoring
- Failed authentication attempts
- Suspicious activity patterns
- API abuse detection
- Security event correlation

### Business Metrics
- Revenue trends
- User engagement
- Operational efficiency
- Customer satisfaction

## Maintenance

### Regular Tasks
- Database maintenance and optimization
- Security updates and patches
- Performance monitoring and tuning
- Backup verification
- Log rotation and cleanup

### Monitoring Alerts
- System downtime
- High error rates
- Security incidents
- Performance degradation
- Resource exhaustion

## Support & Troubleshooting

### Common Issues
1. **Authentication Failures**: Check API key configuration
2. **Database Connection**: Verify connection string and credentials
3. **Performance Issues**: Review query optimization and caching
4. **CORS Errors**: Validate allowed origins configuration

### Debug Mode
Enable debug logging in development:
```yaml
logging:
  level:
    com.moturial: DEBUG
    org.springframework.security: DEBUG
```

### Health Checks
- `/actuator/health` - Application health status
- `/actuator/metrics` - Application metrics
- `/actuator/info` - Application information

## Future Enhancements

### Planned Features
- Advanced analytics dashboard
- Mobile admin application
- Multi-tenant support
- Advanced reporting tools
- Integration with external services

### Performance Optimizations
- Database query optimization
- Caching strategy implementation
- CDN integration
- Image optimization
- API response compression

---

## Contact Information

For technical support or questions about the admin system:
- **Development Team**: dev@moturial.com
- **Security Issues**: security@moturial.com
- **Documentation**: docs@moturial.com

---

*This documentation is maintained as part of the Moturial Admin System and follows .ai-rules compliance for production-ready systems.*
