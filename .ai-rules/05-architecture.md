# 05 - Universal Architecture Patterns (Padrões Arquiteturais Universais)

## 🎯 OBJETIVO UNIVERSAL
Estabelecer padrões arquiteturais agnósticos de linguagem que garantam código consistente, escalável e maintível, seguindo princípios universais de design.

## 🏗️ PRINCÍPIOS ARQUITETURAIS FUNDAMENTAIS

### 1. Clean Architecture Universal
```text
// ✅ Princípios universais de arquitetura limpa:

SEPARATION OF CONCERNS:
- Each layer has single, well-defined responsibility
- Business logic isolated from technical details
- Clear boundaries between domains
- Minimal coupling between layers

DEPENDENCY INVERSION:
- Depend on abstractions, not concretions
- High-level modules should not depend on low-level modules
- Both should depend on abstractions
- Abstractions should not depend on details

TESTABILITY:
- Each layer independently testable
- Mock external dependencies at boundaries
- Domain logic testable without infrastructure
- Clear input/output contracts
```

### 2. Domain-Driven Design (DDD) Universal
```text
// ✅ Princípios DDD agnósticos de linguagem:

UBIQUITOUS LANGUAGE:
- Same terminology used in code and business
- Domain concepts reflected in class/method names
- Consistent vocabulary across all layers
- Business experts can read the code

BOUNDED CONTEXTS:
- Clear boundaries between different domains
- Each context has its own models
- Explicit integration between contexts
- Context-specific language and rules

AGGREGATES:
- Consistency boundaries around related entities
- Single entry point for modifications
- Invariants maintained within aggregate
- Transactional consistency guaranteed
```

## 📐 ESTRUTURA DE CAMADAS UNIVERSAL

### Template Hexagonal Architecture (Language Agnostic)
```text
// ✅ Estrutura universal aplicável a qualquer linguagem:

project-root/
├── domain/                    # Pure business logic
│   ├── entities/             # Core business entities
│   ├── value-objects/        # Immutable value objects
│   ├── repositories/         # Repository interfaces
│   ├── services/             # Domain services
│   └── events/               # Domain events
├── application/              # Use cases & application logic
│   ├── use-cases/           # Application use cases
│   ├── dto/                 # Data transfer objects
│   ├── ports/               # Interfaces to infrastructure
│   └── services/            # Application services
├── infrastructure/           # Technical implementation details
│   ├── persistence/         # Database implementations
│   ├── external/            # External API clients
│   ├── messaging/           # Message queues, events
│   ├── web/                 # HTTP controllers, REST APIs
│   └── security/            # Authentication, authorization
├── shared/                   # Cross-cutting concerns
│   ├── common/              # Common utilities
│   ├── exceptions/          # Custom exceptions
│   ├── validation/          # Input validation
│   └── logging/             # Logging utilities
└── configuration/            # Application configuration
    ├── environments/        # Environment-specific config
    └── dependency-injection/ # DI container setup
```

### Layer Responsibility Rules
```text
// ✅ Regras universais de responsabilidade:

DOMAIN LAYER RULES:
- Contains ONLY business logic
- No dependencies on external frameworks
- No infrastructure concerns
- Pure functions when possible
- Immutable objects preferred

APPLICATION LAYER RULES:
- Orchestrates domain objects
- Implements use cases
- Handles application flow
- Coordinates between layers
- Manages transactions

INFRASTRUCTURE LAYER RULES:
- Implements interfaces from inner layers
- Contains framework-specific code
- Handles external system integration
- Manages technical concerns
- No business logic allowed
```

## 🎯 DOMAIN LAYER UNIVERSAL PATTERNS

### Universal Entity Principles

```text
// ✅ Princípios universais para entidades de domínio:

ENTITY CHARACTERISTICS:
- Unique identity throughout lifecycle
- Encapsulate business logic
- Maintain invariants
- Raise domain events for state changes
- Immutable when possible

ENTITY DESIGN RULES:
- Rich domain model (behavior over data)
- No anemic data structures
- Factory methods for creation
- Guard clauses for validation
- Clear method names reflecting business operations
```

### Multi-language Entity Examples

```python
# Python - Domain Entity
from abc import ABC, abstractmethod
from datetime import datetime
from typing import List, Optional
from dataclasses import dataclass

class Entity(ABC):
    def __init__(self, entity_id: str):
        self._id = entity_id
        self._domain_events: List[DomainEvent] = []
    
    @property
    def id(self) -> str:
        return self._id
    
    def add_domain_event(self, event: 'DomainEvent') -> None:
        self._domain_events.append(event)
    
    def clear_events(self) -> None:
        self._domain_events.clear()

class User(Entity):
    def __init__(self, user_id: str, email: Email, name: str, role: UserRole):
        super().__init__(user_id)
        self._email = email
        self._name = name
        self._role = role
        self._created_at = datetime.now()
        self._updated_at = datetime.now()
    
    @classmethod
    def create(cls, email: str, name: str, role: str) -> 'User':
        email_vo = Email.create(email)
        role_vo = UserRole.create(role)
        user_id = str(uuid.uuid4())
        return cls(user_id, email_vo, name, role_vo)
    
    def change_email(self, new_email: str) -> None:
        email_vo = Email.create(new_email)
        self._email = email_vo
        self._updated_at = datetime.now()
        
        # Raise domain event
        event = UserEmailChangedEvent(self.id, new_email)
        self.add_domain_event(event)
    
    def is_admin(self) -> bool:
        return self._role.is_admin()
    
    @property
    def email(self) -> Email:
        return self._email
```

```java
// Java - Domain Entity
public abstract class Entity {
    protected final String id;
    private final List<DomainEvent> domainEvents;
    
    protected Entity(String id) {
        this.id = id;
        this.domainEvents = new ArrayList<>();
    }
    
    public String getId() {
        return id;
    }
    
    protected void addDomainEvent(DomainEvent event) {
        this.domainEvents.add(event);
    }
    
    public List<DomainEvent> getDomainEvents() {
        return Collections.unmodifiableList(domainEvents);
    }
    
    public void clearEvents() {
        domainEvents.clear();
    }
}

public class User extends Entity {
    private Email email;
    private final String name;
    private UserRole role;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private User(String id, Email email, String name, UserRole role) {
        super(id);
        this.email = email;
        this.name = name;
        this.role = role;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public static User create(String email, String name, String role) {
        Email emailVO = Email.create(email);
        UserRole roleVO = UserRole.create(role);
        String userId = UUID.randomUUID().toString();
        return new User(userId, emailVO, name, roleVO);
    }
    
    public void changeEmail(String newEmail) {
        Email newEmailVO = Email.create(newEmail);
        this.email = newEmailVO;
        this.updatedAt = LocalDateTime.now();
        
        // Raise domain event
        addDomainEvent(new UserEmailChangedEvent(getId(), newEmail));
    }
    
    public boolean isAdmin() {
        return role.isAdmin();
    }
    
    public Email getEmail() {
        return email;
    }
}
```

## 📐 RESUMO EXECUTIVO - ARCHITECTURE PATTERNS

### Regras de Ouro Arquiteturais Universais
```text
1. 🏗️ ALWAYS separate business logic from technical details
2. 🔄 Depend on abstractions, never on concretions
3. 🎯 Each layer should have single, clear responsibility
4. 🧪 Make every layer independently testable
5. 📦 Use dependency injection for loose coupling
6. 🌐 Domain layer must be framework-agnostic
7. 📊 Application layer orchestrates, never implements business logic
8. 🔧 Infrastructure layer implements interfaces from inner layers
9. 📝 Use ubiquitous language consistently across all layers
10. 🚀 Design for maintainability and scalability from day one
```

---
**Última atualização**: 2025-01-13
**Versão**: 2.0 - Universal Language-Agnostic Architecture Patterns
```

### Repository Interface Template
```typescript
// domain/repositories/user.repository.ts
import { User } from '@/domain/entities/user.entity';
import { Email } from '@/domain/value-objects/email';

export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  exists(id: string): Promise<boolean>;
  delete(id: string): Promise<void>;
}
```

## 🔧 APPLICATION LAYER - USE CASES

### Use Case Template
```typescript
// application/use-cases/create-user.use-case.ts
import { UseCase } from '@/shared/application/use-case';
import { User } from '@/domain/entities/user.entity';
import { UserRepository } from '@/domain/repositories/user.repository';
import { Email } from '@/domain/value-objects/email';
import { UserRole } from '@/domain/value-objects/user-role';

export interface CreateUserRequest {
  email: string;
  name: string;
  role: string;
}

export interface CreateUserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
}

export class CreateUserUseCase implements UseCase<CreateUserRequest, CreateUserResponse> {
  constructor(
    private userRepository: UserRepository,
    private logger: Logger
  ) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    this.logger.info('Creating user', { email: request.email });

    // 1. Create value objects
    const email = Email.create(request.email);
    const role = UserRole.create(request.role);

    // 2. Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApplicationError('USER_ALREADY_EXISTS', 'User with this email already exists');
    }

    // 3. Create domain entity
    const user = User.create({
      email,
      name: request.name,
      role
    });

    // 4. Save to repository
    await this.userRepository.save(user);

    this.logger.info('User created successfully', { userId: user.id });

    // 5. Return response
    return {
      id: user.id,
      email: user.email.value,
      name: user.name,
      role: user.role.value
    };
  }
}
```

### DTO Template
```typescript
// application/dto/user.dto.ts
export interface UserDto {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export class UserMapper {
  public static toDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email.value,
      name: user.name,
      role: user.role.value,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }

  public static toDomain(dto: UserDto): User {
    return User.create({
      email: Email.create(dto.email),
      name: dto.name,
      role: UserRole.create(dto.role)
    }, dto.id);
  }
}
```

## 🏢 INFRASTRUCTURE LAYER

### Repository Implementation Template
```typescript
// infrastructure/database/repositories/prisma-user.repository.ts
import { UserRepository } from '@/domain/repositories/user.repository';
import { User } from '@/domain/entities/user.entity';
import { Email } from '@/domain/value-objects/email';
import { PrismaClient } from '@prisma/client';

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email.value,
        name: user.name,
        role: user.role.value,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      update: {
        email: user.email.value,
        name: user.name,
        role: user.role.value,
        updatedAt: user.updatedAt
      }
    });
  }

  async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!userData) return null;

    return User.create({
      email: Email.create(userData.email),
      name: userData.name,
      role: UserRole.create(userData.role),
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    }, userData.id);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email: email.value }
    });

    if (!userData) return null;

    return User.create({
      email: Email.create(userData.email),
      name: userData.name,
      role: UserRole.create(userData.role),
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    }, userData.id);
  }

  async exists(id: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true }
    });
    return !!user;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    });
  }
}
```

### Controller Template
```typescript
// infrastructure/web/controllers/user.controller.ts
import { Request, Response } from 'express';
import { CreateUserUseCase } from '@/application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '@/application/use-cases/get-user-by-id.use-case';
import { validateInput } from '@/shared/infrastructure/validation';
import { CreateUserSchema } from '@/infrastructure/web/schemas/user.schema';

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getUserByIdUseCase: GetUserByIdUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = validateInput(CreateUserSchema, req.body);
      
      const result = await this.createUserUseCase.execute(validatedData);
      
      res.status(201).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof ApplicationError) {
        res.status(400).json({
          success: false,
          error: {
            code: error.code,
            message: error.message
          }
        });
      } else {
        res.status(500).json({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred'
          }
        });
      }
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const result = await this.getUserByIdUseCase.execute({ id });
      
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof ApplicationError && error.code === 'USER_NOT_FOUND') {
        res.status(404).json({
          success: false,
          error: {
            code: error.code,
            message: error.message
          }
        });
      } else {
        res.status(500).json({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred'
          }
        });
      }
    }
  }
}
```

## 🔄 DEPENDENCY INJECTION

### Container Setup Template
```typescript
// infrastructure/container/container.ts
import { Container } from 'inversify';
import { TYPES } from './types';

// Domain
import { UserRepository } from '@/domain/repositories/user.repository';

// Application
import { CreateUserUseCase } from '@/application/use-cases/create-user.use-case';

// Infrastructure
import { PrismaUserRepository } from '@/infrastructure/database/repositories/prisma-user.repository';
import { UserController } from '@/infrastructure/web/controllers/user.controller';

const container = new Container();

// Repositories
container.bind<UserRepository>(TYPES.UserRepository).to(PrismaUserRepository);

// Use Cases
container.bind<CreateUserUseCase>(TYPES.CreateUserUseCase).to(CreateUserUseCase);

// Controllers
container.bind<UserController>(TYPES.UserController).to(UserController);

export { container };
```

## 📡 EVENT-DRIVEN ARCHITECTURE

### Domain Events Template
```typescript
// shared/domain/domain-event.ts
export interface DomainEvent {
  aggregateId: string;
  eventName: string;
  occurredOn: Date;
  eventVersion: number;
}

export abstract class Entity<T> {
  private _domainEvents: DomainEvent[] = [];

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }

  public get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }
}

// domain/events/user-email-changed.event.ts
export class UserEmailChangedEvent implements DomainEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly newEmail: string,
    public readonly occurredOn: Date = new Date(),
    public readonly eventVersion: number = 1
  ) {}

  public get eventName(): string {
    return 'UserEmailChanged';
  }
}
```

### Event Handler Template
```typescript
// application/event-handlers/user-email-changed.handler.ts
import { EventHandler } from '@/shared/application/event-handler';
import { UserEmailChangedEvent } from '@/domain/events/user-email-changed.event';

export class UserEmailChangedHandler implements EventHandler<UserEmailChangedEvent> {
  constructor(
    private emailService: EmailService,
    private logger: Logger
  ) {}

  async handle(event: UserEmailChangedEvent): Promise<void> {
    this.logger.info('Handling user email changed event', {
      userId: event.aggregateId,
      newEmail: event.newEmail
    });

    try {
      await this.emailService.sendEmailChangeConfirmation(event.newEmail);
    } catch (error) {
      this.logger.error('Failed to send email change confirmation', { error });
      // Implement retry logic or dead letter queue
    }
  }
}
```

## 🔄 CQRS PATTERN

### Command/Query Separation
```typescript
// application/commands/create-user.command.ts
export interface Command<TResponse = void> {
  execute(): Promise<TResponse>;
}

export class CreateUserCommand implements Command<CreateUserResponse> {
  constructor(
    private request: CreateUserRequest,
    private userRepository: UserRepository
  ) {}

  async execute(): Promise<CreateUserResponse> {
    // Command logic here
  }
}

// application/queries/get-user.query.ts
export interface Query<TResponse> {
  execute(): Promise<TResponse>;
}

export class GetUserByIdQuery implements Query<UserDto> {
  constructor(
    private userId: string,
    private userReadRepository: UserReadRepository
  ) {}

  async execute(): Promise<UserDto> {
    // Query logic here - can use optimized read models
  }
}
```

## 🧪 TESTING ARCHITECTURE

### Architecture Tests Template
```typescript
// tests/architecture/dependency-rules.test.ts
import { describe, it, expect } from 'vitest';

describe('Architecture Rules', () => {
  it('domain layer should not depend on infrastructure', async () => {
    const domainFiles = await glob('./src/domain/**/*.ts');
    
    for (const file of domainFiles) {
      const content = await fs.readFile(file, 'utf-8');
      
      expect(content).not.toMatch(/from ['"]\.\.\/.*infrastructure/);
      expect(content).not.toMatch(/import.*infrastructure/);
    }
  });

  it('application layer should not depend on infrastructure', async () => {
    const applicationFiles = await glob('./src/application/**/*.ts');
    
    for (const file of applicationFiles) {
      const content = await fs.readFile(file, 'utf-8');
      
      expect(content).not.toMatch(/from ['"]\.\.\/.*infrastructure/);
      expect(content).not.toMatch(/import.*infrastructure/);
    }
  });

  it('use cases should implement UseCase interface', async () => {
    const useCaseFiles = await glob('./src/application/use-cases/**/*.ts');
    
    for (const file of useCaseFiles) {
      const content = await fs.readFile(file, 'utf-8');
      
      if (content.includes('class') && content.includes('UseCase')) {
        expect(content).toMatch(/implements UseCase</);
      }
    }
  });
});
```

## 🚫 ARCHITECTURE ANTI-PATTERNS

### ❌ Violações Proibidas
```typescript
// NUNCA fazer isso - Domain dependendo de Infrastructure
import { PrismaClient } from '@prisma/client'; // ❌ No domain layer

// NUNCA fazer isso - Use case acessando diretamente HTTP request
export class CreateUserUseCase {
  async execute(req: Request) { // ❌ HTTP concern no application layer
    // ...
  }
}

// NUNCA fazer isso - Entity com lógica de persistência
export class User extends Entity {
  async save() { // ❌ Persistência na entidade
    await prisma.user.create(/* ... */);
  }
}
```

### ✅ Padrões Corretos
```typescript
// ✅ Domain independente
export class User extends Entity {
  public changeEmail(email: Email): void {
    // Pure domain logic only
  }
}

// ✅ Use case recebe DTO, não Request
export class CreateUserUseCase {
  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    // Application logic
  }
}

// ✅ Repository interface no domain, implementação na infrastructure
export interface UserRepository {
  save(user: User): Promise<void>;
}
```

## ✅ ARCHITECTURE CHECKLIST

### Domain Layer
- [ ] Entities contêm apenas lógica de negócio?
- [ ] Value Objects são imutáveis?
- [ ] Interfaces de repositório definidas?
- [ ] Domain events implementados?
- [ ] Zero dependências externas?

### Application Layer
- [ ] Use cases implementam interface UseCase?
- [ ] DTOs definidos para entrada/saída?
- [ ] Não há dependência de infrastructure?
- [ ] Event handlers implementados?

### Infrastructure Layer
- [ ] Repositórios implementam interfaces do domain?
- [ ] Controllers não contêm lógica de negócio?
- [ ] Configuração de DI implementada?
- [ ] Database mapping separado do domain?

---
**Última atualização**: 2025-08-15
**Versão**: 1.0
