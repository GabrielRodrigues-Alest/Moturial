# 02 - Code Quality Standards (Padrões de Qualidade de Código)

## 🎯 OBJETIVO
Garantir que todo código gerado pela IA seja production-ready, maintível e siga padrões profissionais, independente da linguagem utilizada.

## ⚡ REGRA DE OURO
**NUNCA GERE CÓDIGO EXPERIMENTAL OU DE DEMONSTRAÇÃO**
- Todo código deve ser funcional em produção
- Zero hardcoded values ou dados fictícios
- Sempre implementar error handling real

## 🏗️ PADRÕES UNIVERSAIS OBRIGATÓRIOS

### 1. Estrutura de Código (Qualquer Linguagem)
```
// ✅ SEMPRE seguir esta estrutura
// 1. Imports/Dependencies (agrupados e ordenados)
// 2. Types/Interfaces/Models
// 3. Constants/Configuration
// 4. Main logic/Classes/Functions
// 5. Exports/Public API

// Exemplo Python
from typing import List, Dict, Optional
import logging

from .models import UserModel
from .exceptions import ValidationError

USER_ROLES = ['admin', 'user']
MAX_RETRY_ATTEMPTS = 3

class UserService:
    # implementação

# Exemplo Java
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;

public class UserService {
    private static final List<String> USER_ROLES = List.of("admin", "user");
    // implementação
}
```

### 2. Type Safety (Conforme linguagem)
```
// Strictness máximo conforme linguagem disponível

// TypeScript
strict: true, noImplicitAny: true

// Python  
from typing import List, Dict, Optional, Union
# Use mypy --strict

// Java
// Use generics, evite raw types

// C#
<Nullable>enable</Nullable>
<TreatWarningsAsErrors>true</TreatWarningsAsErrors>

// Go
// Use interfaces, evite interface{}
```

### 3. Nomenclatura Consistente (Conforme convenção da linguagem)
```
// ✅ Seguir convenção específica da linguagem

// Python (snake_case)
class UserService:
    def get_user_by_id(self, user_id: str) -> Optional[User]:
        USER_ROLES = ['admin', 'user']

// Java (camelCase)
public class UserService {
    private static final List<String> USER_ROLES = List.of("admin", "user");
    public Optional<User> getUserById(String userId) {}
}

// JavaScript/TypeScript (camelCase)
class UserService {
    static readonly USER_ROLES = ['admin', 'user'];
    getUserById(userId: string): User | null {}
}

// C# (PascalCase)
public class UserService {
    private static readonly string[] UserRoles = {"Admin", "User"};
    public User? GetUserById(string userId) {}
}
```

## 🛡️ ERROR HANDLING UNIVERSAL

### Princípios de Error Handling (Qualquer Linguagem)
```text
// ✅ Padrões obrigatórios para qualquer linguagem

1. STRUCTURED ERROR RESPONSES:
   - Código de erro consistente
   - Mensagem clara para usuário
   - Detalhes técnicos para debug
   - Timestamp do erro
   - Stack trace (desenvolvimento)

2. ERROR CATEGORIZATION:
   - Validation Errors (400)
   - Business Logic Errors (409)
   - Authentication Errors (401)
   - Authorization Errors (403)
   - Not Found Errors (404)
   - Internal Server Errors (500)

3. ERROR LOGGING:
   - Context completo (user, operation, input)
   - Severity level adequado
   - Structured format (JSON preferível)
   - Correlation ID para tracing
```

### Exemplos Multi-linguagem
```python
# Python Example
class ApplicationError(Exception):
    def __init__(self, code: str, message: str, status_code: int = 500):
        super().__init__(message)
        self.code = code
        self.status_code = status_code
        self.timestamp = datetime.utcnow()

def handle_errors(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ApplicationError as e:
            logger.error(f"Application error: {e.code}", extra={"error": e})
            raise
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise ApplicationError("INTERNAL_ERROR", "Internal server error", 500)
    return wrapper
```

```java
// Java Example
public class ApplicationException extends RuntimeException {
    private final String code;
    private final int statusCode;
    private final Instant timestamp;
    
    public ApplicationException(String code, String message, int statusCode) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.timestamp = Instant.now();
    }
}

@Component
public class ErrorHandler {
    public ResponseEntity<ErrorResponse> handleError(ApplicationException ex) {
        ErrorResponse error = ErrorResponse.builder()
            .code(ex.getCode())
            .message(ex.getMessage())
            .timestamp(ex.getTimestamp())
            .build();
        return ResponseEntity.status(ex.getStatusCode()).body(error);
    }
}
```
```

## 📋 VALIDAÇÃO UNIVERSAL

### Princípios de Validação (Qualquer Linguagem)
```text
// ✅ Padrões obrigatórios para qualquer stack

1. INPUT VALIDATION:
   - Validar TODOS os inputs antes do processamento
   - Sanitizar dados de entrada
   - Definir regras de negócio claras
   - Mensagens de erro específicas

2. VALIDATION RULES:
   - Required fields
   - Format validation (email, phone, etc)
   - Length constraints
   - Range validation
   - Custom business rules

3. VALIDATION PLACEMENT:
   - API/Controller layer (format validation)
   - Service layer (business rules)
   - Database layer (data integrity)
```

### Exemplos Multi-linguagem
```python
# Python with Pydantic
from pydantic import BaseModel, EmailStr, validator
from typing import Literal

class CreateUserRequest(BaseModel):
    email: EmailStr
    password: str
    role: Literal['admin', 'user'] = 'user'
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        # Add more password rules
        return v

def validate_input(model_class, data):
    try:
        return model_class(**data)
    except ValidationError as e:
        raise ApplicationError('VALIDATION_ERROR', str(e), 400)
```

```java
// Java with Bean Validation
import javax.validation.constraints.*;
import javax.validation.Valid;

public class CreateUserRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).*$", 
             message = "Password must contain letters and numbers")
    private String password;
    
    @Pattern(regexp = "^(admin|user)$", message = "Role must be admin or user")
    private String role = "user";
}

@PostMapping("/users")
public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request) {
    // Spring will automatically validate and throw MethodArgumentNotValidException
    return userService.createUser(request);
}
```

```csharp
// C# with Data Annotations
using System.ComponentModel.DataAnnotations;

public class CreateUserRequest
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; }
    
    [Required(ErrorMessage = "Password is required")]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
    [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d).*$", 
                      ErrorMessage = "Password must contain letters and numbers")]
    public string Password { get; set; }
    
    [RegularExpression(@"^(admin|user)$", ErrorMessage = "Role must be admin or user")]
    public string Role { get; set; } = "user";
}
```
```

## 🗂️ ESTRUTURA DE ARQUIVOS

### Padrão de Organização
```
src/
├── types/           # Definições de tipos globais
├── schemas/         # Schemas de validação Zod
├── utils/           # Utilitários puros
├── services/        # Lógica de negócio
├── controllers/     # Controladores HTTP
├── middleware/      # Middleware Express
├── config/          # Configurações
└── tests/           # Testes organizados por módulo
```

### Template de Service Layer
```typescript
// services/user.service.ts
import { z } from 'zod';
import { logger } from '@/utils/logger';
import { AppError } from '@/utils/errors';

interface UserRepository {
  findById(id: string): Promise<User | null>;
  create(data: CreateUserInput): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
}

export class UserService {
  constructor(private userRepo: UserRepository) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new AppError('USER_NOT_FOUND', 'Usuário não encontrado', 404);
    }
    return user;
  }

  async createUser(input: unknown): Promise<User> {
    const validatedInput = validateInput(CreateUserSchema, input);
    
    logger.info('Creating new user', { email: validatedInput.email });
    
    const user = await this.userRepo.create(validatedInput);
    
    logger.info('User created successfully', { userId: user.id });
    return user;
  }
}
```

## 📊 LOGGING ESTRUTURADO

### Template de Logger
```typescript
// utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: process.env.SERVICE_NAME || 'api',
    version: process.env.APP_VERSION || '1.0.0'
  },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Context logger para tracing
export const createContextLogger = (context: Record<string, any>) => ({
  info: (message: string, meta?: Record<string, any>) => 
    logger.info(message, { ...context, ...meta }),
  error: (message: string, meta?: Record<string, any>) => 
    logger.error(message, { ...context, ...meta }),
  warn: (message: string, meta?: Record<string, any>) => 
    logger.warn(message, { ...context, ...meta })
});
```

## 🔧 CONFIGURAÇÃO DE AMBIENTE

### Template de Config
```typescript
// config/index.ts
import { z } from 'zod';

const ConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().min(1000).max(65535),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  REDIS_URL: z.string().url(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info')
});

const parseConfig = () => {
  const result = ConfigSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(result.error.format());
    process.exit(1);
  }
  return result.data;
};

export const config = parseConfig();
```

## 🧪 TESTING REQUIREMENTS

### Template de Teste
```typescript
// tests/services/user.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from '@/services/user.service';

// Mock repository
const mockUserRepo = {
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn()
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(mockUserRepo);
    vi.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = 'user-123';
      const mockUser = { id: userId, email: 'test@test.com' };
      mockUserRepo.findById.mockResolvedValue(mockUser);

      // Act
      const result = await userService.getUserById(userId);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockUserRepo.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw error when user not found', async () => {
      // Arrange
      const userId = 'user-404';
      mockUserRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getUserById(userId))
        .rejects
        .toThrow('Usuário não encontrado');
    });
  });
});
```

## 🚫 ANTI-PADRÕES PROIBIDOS

### ❌ Código Experimental
```typescript
// NUNCA fazer isso
const users = [
  { id: 1, name: 'João' },  // Dados fake
  { id: 2, name: 'Maria' }  // Dados fake
];

const mockFunction = () => 'test'; // Mock em produção
```

### ❌ Error Handling Genérico
```typescript
// NUNCA fazer isso
try {
  // código
} catch (error) {
  console.log(error); // Log inadequado
  return { error: true }; // Response genérico
}
```

### ❌ Hardcoded Values
```typescript
// NUNCA fazer isso
const API_URL = 'https://api.example.com'; // Hardcoded
const MAX_RETRIES = 3; // Sem configuração
```

## ✅ CHECKLIST DE QUALIDADE

### Antes de Gerar Código
- [ ] Contexto técnico completo fornecido?
- [ ] Padrões de arquitetura definidos?
- [ ] Requisitos de error handling especificados?
- [ ] Schema de validação necessário?

### Após Gerar Código
- [ ] Todos os imports incluídos?
- [ ] TypeScript types completos?
- [ ] Error handling implementado?
- [ ] Logging estruturado incluído?
- [ ] Validação de input implementada?
- [ ] Configuração de ambiente externalizada?
- [ ] Código roda sem modificações?

## 🎯 EXEMPLO COMPLETO

### Controller com Todas as Práticas
```typescript
// controllers/user.controller.ts
import { Request, Response } from 'express';
import { z } from 'zod';
import { UserService } from '@/services/user.service';
import { validateInput } from '@/utils/validation';
import { createContextLogger } from '@/utils/logger';
import { withErrorHandling } from '@/utils/error-handling';

const CreateUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'user']).optional()
});

export class UserController {
  constructor(private userService: UserService) {}

  createUser = withErrorHandling(async (req: Request, res: Response) => {
    const logger = createContextLogger({ 
      requestId: req.headers['x-request-id'],
      method: req.method,
      path: req.path 
    });

    logger.info('Creating user request received');

    const validatedBody = validateInput(CreateUserBodySchema, req.body);
    const user = await this.userService.createUser(validatedBody);

    logger.info('User created successfully', { userId: user.id });

    res.status(201).json({
      success: true,
      data: { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      timestamp: new Date().toISOString()
    });
  });
}
```

---
**Última atualização**: 2025-08-15
**Versão**: 1.0
