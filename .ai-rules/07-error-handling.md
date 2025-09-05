# 07 - Universal Error Handling (Tratamento de Erros Universal)

## 🎯 OBJETIVO UNIVERSAL
Estabelecer padrões de tratamento de erros robustos e consistentes, agnósticos de linguagem, garantindo debugging eficiente e experiência adequada independente da stack tecnológica.

## ⚡ PRINCÍPIOS UNIVERSAIS FUNDAMENTAIS

### 1. Fail Fast, Fail Safe Universal
```text
// ✅ Princípios universais de falha rápida e segura:

FAIL FAST PRINCIPLES:
- Detect errors as early as possible in the flow
- Validate inputs at system boundaries
- Use guard clauses to prevent invalid states
- Throw meaningful exceptions immediately
- Never continue with corrupted data

FAIL SAFE PRINCIPLES:
- Always leave system in consistent state
- Implement proper cleanup in error scenarios
- Use transactions for atomic operations
- Provide graceful degradation when possible
- Log all errors with sufficient context
```

### 2. Universal Error Classification
```text
// ✅ Classificação universal de erros:

ERROR CATEGORIES:
- ValidationError: Input validation failures
- BusinessRuleError: Domain logic violations
- AuthenticationError: Identity verification failures
- AuthorizationError: Access permission denials
- ExternalServiceError: Third-party service failures
- InfrastructureError: Database, network, file system errors
- UnexpectedError: Uncaught system errors

ERROR SEVERITY LEVELS:
- CRITICAL: System unusable, immediate attention required
- HIGH: Major feature broken, affects many users
- MEDIUM: Minor feature issue, workaround available
- LOW: Cosmetic issue, minimal user impact
```

## 🏗️ ARQUITETURA DE ERROS OBRIGATÓRIA

### Universal Error Class Hierarchy

#### 2.1. Base Error Class Pattern

**Python Implementation:**
```python
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Optional, Dict, Any
import json

class BaseError(Exception, ABC):
    """Abstract base error class for all application errors."""
    
    def __init__(self, message: str, context: Optional[Dict[str, Any]] = None, cause: Optional[Exception] = None):
        super().__init__(message)
        self.message = message
        self.timestamp = datetime.utcnow()
        self.context = context or {}
        self.cause = cause
    
    @property
    @abstractmethod
    def code(self) -> str:
        """Error code identifier."""
        pass
    
    @property
    @abstractmethod
    def status_code(self) -> int:
        """HTTP status code."""
        pass
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.__class__.__name__,
            "code": self.code,
            "message": self.message,
            "status_code": self.status_code,
            "timestamp": self.timestamp.isoformat(),
            "context": self.context
        }
    
    def to_json(self) -> str:
        return json.dumps(self.to_dict())

class DomainError(BaseError):
    """Domain-specific business rule violations."""
    
    def __init__(self, code: str, message: str, context: Optional[Dict[str, Any]] = None, cause: Optional[Exception] = None):
        super().__init__(message, context, cause)
        self._code = code
    
    @property
    def code(self) -> str:
        return self._code
    
    @property
    def status_code(self) -> int:
        return 400

class ApplicationError(BaseError):
    """Application layer errors."""
    
    def __init__(self, code: str, message: str, status_code: int = 400, context: Optional[Dict[str, Any]] = None, cause: Optional[Exception] = None):
        super().__init__(message, context, cause)
        self._code = code
        self._status_code = status_code
    
    @property
    def code(self) -> str:
        return self._code
    
    @property
    def status_code(self) -> int:
        return self._status_code

class InfrastructureError(BaseError):
    """Infrastructure layer errors."""
    
    def __init__(self, code: str, message: str, context: Optional[Dict[str, Any]] = None, cause: Optional[Exception] = None):
        super().__init__(message, context, cause)
        self._code = code
    
    @property
    def code(self) -> str:
        return self._code
    
    @property
    def status_code(self) -> int:
        return 500
```

**Java Implementation:**
```java
import java.time.Instant;
import java.util.Map;
import java.util.HashMap;
import com.fasterxml.jackson.databind.ObjectMapper;

public abstract class BaseError extends RuntimeException {
    protected final String code;
    protected final int statusCode;
    protected final Instant timestamp;
    protected final Map<String, Object> context;
    
    public BaseError(String message, String code, int statusCode, Map<String, Object> context, Throwable cause) {
        super(message, cause);
        this.code = code;
        this.statusCode = statusCode;
        this.timestamp = Instant.now();
        this.context = context != null ? new HashMap<>(context) : new HashMap<>();
    }
    
    public String getCode() { return code; }
    public int getStatusCode() { return statusCode; }
    public Instant getTimestamp() { return timestamp; }
    public Map<String, Object> getContext() { return new HashMap<>(context); }
    
    public String toJson() {
        try {
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("name", this.getClass().getSimpleName());
            errorMap.put("code", code);
            errorMap.put("message", getMessage());
            errorMap.put("statusCode", statusCode);
            errorMap.put("timestamp", timestamp.toString());
            errorMap.put("context", context);
            return new ObjectMapper().writeValueAsString(errorMap);
        } catch (Exception e) {
            return "{\"error\":\"Failed to serialize error\"}";
        }
    }
}

public class DomainError extends BaseError {
    public DomainError(String code, String message, Map<String, Object> context, Throwable cause) {
        super(message, code, 400, context, cause);
    }
    
    public DomainError(String code, String message) {
        this(code, message, null, null);
    }
}

public class ApplicationError extends BaseError {
    public ApplicationError(String code, String message, int statusCode, Map<String, Object> context, Throwable cause) {
        super(message, code, statusCode, context, cause);
    }
    
    public ApplicationError(String code, String message) {
        this(code, message, 400, null, null);
    }
}

public class InfrastructureError extends BaseError {
    public InfrastructureError(String code, String message, Map<String, Object> context, Throwable cause) {
        super(message, code, 500, context, cause);
    }
    
    public InfrastructureError(String code, String message) {
        this(code, message, null, null);
    }
}
```

**C# Implementation:**
```csharp
using System;
using System.Collections.Generic;
using System.Text.Json;

public abstract class BaseError : Exception
{
    public abstract string Code { get; }
    public abstract int StatusCode { get; }
    public DateTime Timestamp { get; }
    public Dictionary<string, object> Context { get; }

    protected BaseError(string message, Dictionary<string, object> context = null, Exception innerException = null)
        : base(message, innerException)
    {
        Timestamp = DateTime.UtcNow;
        Context = context ?? new Dictionary<string, object>();
    }

    public string ToJson()
    {
        var errorObject = new
        {
            Name = GetType().Name,
            Code,
            Message,
            StatusCode,
            Timestamp = Timestamp.ToString("O"),
            Context
        };
        return JsonSerializer.Serialize(errorObject);
    }
}

public class DomainError : BaseError
{
    private readonly string _code;
    
    public override string Code => _code;
    public override int StatusCode => 400;

    public DomainError(string code, string message, Dictionary<string, object> context = null, Exception innerException = null)
        : base(message, context, innerException)
    {
        _code = code;
    }
}

public class ApplicationError : BaseError
{
    private readonly string _code;
    private readonly int _statusCode;
    
    public override string Code => _code;
    public override int StatusCode => _statusCode;

    public ApplicationError(string code, string message, int statusCode = 400, Dictionary<string, object> context = null, Exception innerException = null)
        : base(message, context, innerException)
    {
        _code = code;
        _statusCode = statusCode;
    }
}

public class InfrastructureError : BaseError
{
    private readonly string _code;
    
    public override string Code => _code;
    public override int StatusCode => 500;

    public InfrastructureError(string code, string message, Dictionary<string, object> context = null, Exception innerException = null)
        : base(message, context, innerException)
    {
        _code = code;
    }
}
```

### Universal Specific Error Types

#### 2.2. Common Business Error Types

**Python Implementation:**
```python
class ValidationError(ApplicationError):
    """Input validation error."""
    
    def __init__(self, field: str, value: Any, constraint: str, context: Optional[Dict[str, Any]] = None):
        combined_context = {"field": field, "value": str(value), "constraint": constraint}
        if context:
            combined_context.update(context)
        
        super().__init__(
            "VALIDATION_ERROR",
            f"Validation failed for field '{field}': {constraint}",
            400,
            combined_context
        )

class BusinessRuleError(DomainError):
    """Business rule violation error."""
    
    def __init__(self, rule: str, entity: str, context: Optional[Dict[str, Any]] = None):
        combined_context = {"rule": rule, "entity": entity}
        if context:
            combined_context.update(context)
        
        super().__init__(
            "BUSINESS_RULE_VIOLATION",
            f"Business rule '{rule}' violated for {entity}",
            combined_context
        )

class AuthenticationError(ApplicationError):
    """Authentication failure error."""
    
    def __init__(self, reason: str, context: Optional[Dict[str, Any]] = None):
        super().__init__(
            "AUTHENTICATION_FAILED",
            f"Authentication failed: {reason}",
            401,
            context
        )

class AuthorizationError(ApplicationError):
    """Authorization denial error."""
    
    def __init__(self, user_id: str, resource: str, action: str, context: Optional[Dict[str, Any]] = None):
        combined_context = {"user_id": user_id, "resource": resource, "action": action}
        if context:
            combined_context.update(context)
        
        super().__init__(
            "AUTHORIZATION_DENIED",
            f"User {user_id} not authorized to {action} on {resource}",
            403,
            combined_context
        )

class ExternalServiceError(InfrastructureError):
    """External service integration error."""
    
    def __init__(self, service: str, operation: str, context: Optional[Dict[str, Any]] = None, cause: Optional[Exception] = None):
        combined_context = {"service": service, "operation": operation}
        if context:
            combined_context.update(context)
        
        super().__init__(
            "EXTERNAL_SERVICE_ERROR",
            f"External service {service} failed during {operation}",
            combined_context,
            cause
        )
```

**Java Implementation:**
```java
public class ValidationError extends ApplicationError {
    public ValidationError(String field, Object value, String constraint, Map<String, Object> context) {
        super("VALIDATION_ERROR", 
              String.format("Validation failed for field '%s': %s", field, constraint),
              400,
              createContext(field, value, constraint, context),
              null);
    }
    
    private static Map<String, Object> createContext(String field, Object value, String constraint, Map<String, Object> context) {
        Map<String, Object> combined = new HashMap<>();
        combined.put("field", field);
        combined.put("value", String.valueOf(value));
        combined.put("constraint", constraint);
        if (context != null) combined.putAll(context);
        return combined;
    }
}

public class BusinessRuleError extends DomainError {
    public BusinessRuleError(String rule, String entity, Map<String, Object> context) {
        super("BUSINESS_RULE_VIOLATION",
              String.format("Business rule '%s' violated for %s", rule, entity),
              createContext(rule, entity, context));
    }
    
    private static Map<String, Object> createContext(String rule, String entity, Map<String, Object> context) {
        Map<String, Object> combined = new HashMap<>();
        combined.put("rule", rule);
        combined.put("entity", entity);
        if (context != null) combined.putAll(context);
        return combined;
    }
}

public class AuthenticationError extends ApplicationError {
    public AuthenticationError(String reason, Map<String, Object> context) {
        super("AUTHENTICATION_FAILED",
              "Authentication failed: " + reason,
              401,
              context,
              null);
    }
}

public class AuthorizationError extends ApplicationError {
    public AuthorizationError(String userId, String resource, String action, Map<String, Object> context) {
        super("AUTHORIZATION_DENIED",
              String.format("User %s not authorized to %s on %s", userId, action, resource),
              403,
              createContext(userId, resource, action, context),
              null);
    }
    
    private static Map<String, Object> createContext(String userId, String resource, String action, Map<String, Object> context) {
        Map<String, Object> combined = new HashMap<>();
        combined.put("userId", userId);
        combined.put("resource", resource);
        combined.put("action", action);
        if (context != null) combined.putAll(context);
        return combined;
    }
}

public class ExternalServiceError extends InfrastructureError {
    public ExternalServiceError(String service, String operation, Map<String, Object> context, Throwable cause) {
        super("EXTERNAL_SERVICE_ERROR",
              String.format("External service %s failed during %s", service, operation),
              createContext(service, operation, context),
              cause);
    }
    
    private static Map<String, Object> createContext(String service, String operation, Map<String, Object> context) {
        Map<String, Object> combined = new HashMap<>();
        combined.put("service", service);
        combined.put("operation", operation);
        if (context != null) combined.putAll(context);
        return combined;
    }
}
```

**C# Implementation:**
```csharp
public class ValidationError : ApplicationError
{
    public ValidationError(string field, object value, string constraint, Dictionary<string, object> context = null)
        : base("VALIDATION_ERROR",
               $"Validation failed for field '{field}': {constraint}",
               400,
               CreateContext(field, value, constraint, context))
    {
    }
    
    private static Dictionary<string, object> CreateContext(string field, object value, string constraint, Dictionary<string, object> context)
    {
        var combined = new Dictionary<string, object>
        {
            ["field"] = field,
            ["value"] = value?.ToString() ?? "null",
            ["constraint"] = constraint
        };
        
        if (context != null)
        {
            foreach (var kvp in context)
                combined[kvp.Key] = kvp.Value;
        }
        
        return combined;
    }
}

public class BusinessRuleError : DomainError
{
    public BusinessRuleError(string rule, string entity, Dictionary<string, object> context = null)
        : base("BUSINESS_RULE_VIOLATION",
               $"Business rule '{rule}' violated for {entity}",
               CreateContext(rule, entity, context))
    {
    }
    
    private static Dictionary<string, object> CreateContext(string rule, string entity, Dictionary<string, object> context)
    {
        var combined = new Dictionary<string, object>
        {
            ["rule"] = rule,
            ["entity"] = entity
        };
        
        if (context != null)
        {
            foreach (var kvp in context)
                combined[kvp.Key] = kvp.Value;
        }
        
        return combined;
    }
}

public class AuthenticationError : ApplicationError
{
    public AuthenticationError(string reason, Dictionary<string, object> context = null)
        : base("AUTHENTICATION_FAILED",
               $"Authentication failed: {reason}",
               401,
               context)
    {
    }
}

public class AuthorizationError : ApplicationError
{
    public AuthorizationError(string userId, string resource, string action, Dictionary<string, object> context = null)
        : base("AUTHORIZATION_DENIED",
               $"User {userId} not authorized to {action} on {resource}",
               403,
               CreateContext(userId, resource, action, context))
    {
    }
    
    private static Dictionary<string, object> CreateContext(string userId, string resource, string action, Dictionary<string, object> context)
    {
        var combined = new Dictionary<string, object>
        {
            ["userId"] = userId,
            ["resource"] = resource,
            ["action"] = action
        };
        
        if (context != null)
        {
            foreach (var kvp in context)
                combined[kvp.Key] = kvp.Value;
        }
        
        return combined;
    }
}

public class ExternalServiceError : InfrastructureError
{
    public ExternalServiceError(string service, string operation, Dictionary<string, object> context = null, Exception innerException = null)
        : base("EXTERNAL_SERVICE_ERROR",
               $"External service {service} failed during {operation}",
               CreateContext(service, operation, context),
               innerException)
    {
    }
    
    private static Dictionary<string, object> CreateContext(string service, string operation, Dictionary<string, object> context)
    {
        var combined = new Dictionary<string, object>
        {
            ["service"] = service,
            ["operation"] = operation
        };
        
        if (context != null)
        {
            foreach (var kvp in context)
                combined[kvp.Key] = kvp.Value;
        }
        
        return combined;
    }
}
```

## 🛡️ UNIVERSAL ERROR HANDLING MIDDLEWARE

### Web Framework Error Handling Patterns

#### 3.1. Framework-Agnostic Error Response Structure

**Universal Error Response Format:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {
      "field": "additional context",
      "trace_id": "request_identifier"
    }
  },
  "timestamp": "2024-01-13T10:30:00Z",
  "request_id": "req_12345"
}
```

#### 3.2. Multi-Framework Error Handler Implementations

**Python (FastAPI) Implementation:**
```python
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import logging
import traceback
from datetime import datetime
from typing import Dict, Any, Optional

class ErrorResponse:
    def __init__(self, code: str, message: str, details: Optional[Dict[str, Any]] = None, request_id: Optional[str] = None):
        self.success = False
        self.error = {
            "code": code,
            "message": message,
            "details": details or {}
        }
        self.timestamp = datetime.utcnow().isoformat() + "Z"
        self.request_id = request_id

    def to_dict(self) -> Dict[str, Any]:
        response = {
            "success": self.success,
            "error": self.error,
            "timestamp": self.timestamp
        }
        if self.request_id:
            response["request_id"] = self.request_id
        return response

async def base_error_handler(request: Request, exc: BaseError) -> JSONResponse:
    request_id = request.headers.get("x-request-id")
    
    # Log error with context
    logging.error(
        "Request error occurred",
        extra={
            "error": str(exc),
            "code": exc.code,
            "request_id": request_id,
            "method": request.method,
            "url": str(request.url),
            "client_host": request.client.host if request.client else None
        }
    )
    
    error_response = ErrorResponse(
        code=exc.code,
        message=exc.message,
        details=exc.context,
        request_id=request_id
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response.to_dict()
    )

async def validation_error_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    request_id = request.headers.get("x-request-id")
    
    validation_errors = []
    for error in exc.errors():
        validation_errors.append({
            "field": ".".join(str(loc) for loc in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })
    
    error_response = ErrorResponse(
        code="VALIDATION_ERROR",
        message="Input validation failed",
        details={"errors": validation_errors},
        request_id=request_id
    )
    
    return JSONResponse(
        status_code=422,
        content=error_response.to_dict()
    )

async def generic_error_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = request.headers.get("x-request-id")
    
    # Log unexpected errors with full traceback
    logging.error(
        "Unexpected error occurred",
        extra={
            "error": str(exc),
            "traceback": traceback.format_exc(),
            "request_id": request_id,
            "method": request.method,
            "url": str(request.url)
        }
    )
    
    error_response = ErrorResponse(
        code="INTERNAL_SERVER_ERROR",
        message="An unexpected error occurred",
        request_id=request_id
    )
    
    return JSONResponse(
        status_code=500,
        content=error_response.to_dict()
    )

# Register error handlers
def setup_error_handlers(app: FastAPI):
    app.add_exception_handler(BaseError, base_error_handler)
    app.add_exception_handler(RequestValidationError, validation_error_handler)
    app.add_exception_handler(Exception, generic_error_handler)
```

**Java (Spring Boot) Implementation:**
```java
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.WebRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalErrorHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalErrorHandler.class);
    
    public static class ErrorResponse {
        private final boolean success = false;
        private final Map<String, Object> error;
        private final String timestamp;
        private final String requestId;
        
        public ErrorResponse(String code, String message, Map<String, Object> details, String requestId) {
            this.error = new HashMap<>();
            this.error.put("code", code);
            this.error.put("message", message);
            if (details != null) {
                this.error.put("details", details);
            }
            this.timestamp = Instant.now().toString();
            this.requestId = requestId;
        }
        
        // Getters
        public boolean isSuccess() { return success; }
        public Map<String, Object> getError() { return error; }
        public String getTimestamp() { return timestamp; }
        public String getRequestId() { return requestId; }
    }
    
    @ExceptionHandler(BaseError.class)
    public ResponseEntity<ErrorResponse> handleBaseError(BaseError ex, HttpServletRequest request) {
        String requestId = request.getHeader("x-request-id");
        
        // Log error with context
        logger.error("Request error occurred: {} - {}", ex.getCode(), ex.getMessage(), 
            Map.of(
                "code", ex.getCode(),
                "requestId", requestId != null ? requestId : "unknown",
                "method", request.getMethod(),
                "path", request.getRequestURI(),
                "remoteAddr", request.getRemoteAddr()
            ));
        
        ErrorResponse errorResponse = new ErrorResponse(
            ex.getCode(),
            ex.getMessage(),
            ex.getContext(),
            requestId
        );
        
        return ResponseEntity.status(ex.getStatusCode()).body(errorResponse);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationError(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String requestId = request.getHeader("x-request-id");
        
        List<Map<String, String>> validationErrors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> {
                Map<String, String> errorMap = new HashMap<>();
                errorMap.put("field", error.getField());
                errorMap.put("message", error.getDefaultMessage());
                errorMap.put("rejectedValue", String.valueOf(error.getRejectedValue()));
                return errorMap;
            })
            .collect(Collectors.toList());
        
        Map<String, Object> details = new HashMap<>();
        details.put("errors", validationErrors);
        
        ErrorResponse errorResponse = new ErrorResponse(
            "VALIDATION_ERROR",
            "Input validation failed",
            details,
            requestId
        );
        
        return ResponseEntity.badRequest().body(errorResponse);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericError(Exception ex, HttpServletRequest request) {
        String requestId = request.getHeader("x-request-id");
        
        // Log unexpected errors
        logger.error("Unexpected error occurred", ex, 
            Map.of(
                "requestId", requestId != null ? requestId : "unknown",
                "method", request.getMethod(),
                "path", request.getRequestURI()
            ));
        
        ErrorResponse errorResponse = new ErrorResponse(
            "INTERNAL_SERVER_ERROR",
            "An unexpected error occurred",
            null,
            requestId
        );
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
```

**C# (ASP.NET Core) Implementation:**
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;

public class ErrorResponse
{
    public bool Success { get; } = false;
    public ErrorDetail Error { get; set; }
    public string Timestamp { get; set; }
    public string RequestId { get; set; }
    
    public ErrorResponse(string code, string message, object details = null, string requestId = null)
    {
        Error = new ErrorDetail
        {
            Code = code,
            Message = message,
            Details = details
        };
        Timestamp = DateTime.UtcNow.ToString("O");
        RequestId = requestId;
    }
}

public class ErrorDetail
{
    public string Code { get; set; }
    public string Message { get; set; }
    public object Details { get; set; }
}

public class GlobalErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalErrorHandlingMiddleware> _logger;
    
    public GlobalErrorHandlingMiddleware(RequestDelegate next, ILogger<GlobalErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleErrorAsync(context, ex);
        }
    }
    
    private async Task HandleErrorAsync(HttpContext context, Exception exception)
    {
        var requestId = context.Request.Headers["x-request-id"].FirstOrDefault();
        
        ErrorResponse response;
        int statusCode;
        
        switch (exception)
        {
            case BaseError baseError:
                _logger.LogError(baseError, 
                    "Request error occurred: {Code} - {Message} RequestId: {RequestId} Path: {Path}",
                    baseError.Code, baseError.Message, requestId, context.Request.Path);
                
                response = new ErrorResponse(
                    baseError.Code,
                    baseError.Message,
                    baseError.Context,
                    requestId
                );
                statusCode = baseError.StatusCode;
                break;
                
            case ValidationException validationEx:
                response = new ErrorResponse(
                    "VALIDATION_ERROR",
                    "Input validation failed",
                    new { field = "unknown", message = validationEx.Message },
                    requestId
                );
                statusCode = 400;
                break;
                
            default:
                _logger.LogError(exception, 
                    "Unexpected error occurred RequestId: {RequestId} Path: {Path}",
                    requestId, context.Request.Path);
                
                response = new ErrorResponse(
                    "INTERNAL_SERVER_ERROR",
                    "An unexpected error occurred",
                    requestId: requestId
                );
                statusCode = 500;
                break;
        }
        
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";
        
        var jsonResponse = JsonSerializer.Serialize(response);
        await context.Response.WriteAsync(jsonResponse);
    }
}

// Extension method for easy registration
public static class ErrorHandlingMiddlewareExtensions
{
    public static IApplicationBuilder UseGlobalErrorHandling(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<GlobalErrorHandlingMiddleware>();
    }
}
```

## 🔄 UNIVERSAL RETRY PATTERNS

### Exponential Backoff with Jitter

**Python Implementation:**
```python
import asyncio
import random
import logging
from typing import Callable, Optional, Any
from functools import wraps

class RetryConfig:
    def __init__(self, 
                 max_attempts: int = 3,
                 base_delay: float = 1.0,
                 max_delay: float = 60.0,
                 exponential_base: float = 2.0,
                 jitter: bool = True,
                 retryable_exceptions: tuple = None):
        self.max_attempts = max_attempts
        self.base_delay = base_delay
        self.max_delay = max_delay
        self.exponential_base = exponential_base
        self.jitter = jitter
        self.retryable_exceptions = retryable_exceptions or (Exception,)

def retry_with_backoff(config: RetryConfig):
    def decorator(func: Callable):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            last_exception = None
            
            for attempt in range(config.max_attempts):
                try:
                    return await func(*args, **kwargs)
                except config.retryable_exceptions as e:
                    last_exception = e
                    
                    if attempt == config.max_attempts - 1:
                        logging.error(f"Final attempt failed for {func.__name__}: {str(e)}")
                        raise e
                    
                    # Calculate delay with exponential backoff
                    delay = min(
                        config.base_delay * (config.exponential_base ** attempt),
                        config.max_delay
                    )
                    
                    # Add jitter to prevent thundering herd
                    if config.jitter:
                        delay = delay * (0.5 + random.random() * 0.5)
                    
                    logging.warning(f"Attempt {attempt + 1} failed for {func.__name__}: {str(e)}. Retrying in {delay:.2f}s")
                    await asyncio.sleep(delay)
            
            raise last_exception
        
        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            last_exception = None
            
            for attempt in range(config.max_attempts):
                try:
                    return func(*args, **kwargs)
                except config.retryable_exceptions as e:
                    last_exception = e
                    
                    if attempt == config.max_attempts - 1:
                        logging.error(f"Final attempt failed for {func.__name__}: {str(e)}")
                        raise e
                    
                    # Calculate delay with exponential backoff
                    delay = min(
                        config.base_delay * (config.exponential_base ** attempt),
                        config.max_delay
                    )
                    
                    # Add jitter to prevent thundering herd
                    if config.jitter:
                        delay = delay * (0.5 + random.random() * 0.5)
                    
                    logging.warning(f"Attempt {attempt + 1} failed for {func.__name__}: {str(e)}. Retrying in {delay:.2f}s")
                    time.sleep(delay)
            
            raise last_exception
        
        # Return appropriate wrapper based on function type
        return async_wrapper if asyncio.iscoroutinefunction(func) else sync_wrapper
    return decorator

# Usage example
@retry_with_backoff(RetryConfig(
    max_attempts=3,
    base_delay=1.0,
    retryable_exceptions=(ExternalServiceError, InfrastructureError)
))
async def call_external_service(data: dict) -> dict:
    # External service call logic
    pass
```

**Java Implementation:**
```java
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;
import java.util.Set;
import java.util.HashSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RetryConfig {
    private int maxAttempts = 3;
    private long baseDelayMs = 1000;
    private long maxDelayMs = 60000;
    private double exponentialBase = 2.0;
    private boolean jitter = true;
    private Set<Class<? extends Exception>> retryableExceptions = new HashSet<>();
    
    // Constructor and getters/setters
    public RetryConfig maxAttempts(int attempts) {
        this.maxAttempts = attempts;
        return this;
    }
    
    public RetryConfig baseDelay(long delayMs) {
        this.baseDelayMs = delayMs;
        return this;
    }
    
    public RetryConfig retryOn(Class<? extends Exception>... exceptions) {
        this.retryableExceptions.addAll(Set.of(exceptions));
        return this;
    }
    
    // Getters
    public int getMaxAttempts() { return maxAttempts; }
    public long getBaseDelayMs() { return baseDelayMs; }
    public long getMaxDelayMs() { return maxDelayMs; }
    public double getExponentialBase() { return exponentialBase; }
    public boolean hasJitter() { return jitter; }
    public Set<Class<? extends Exception>> getRetryableExceptions() { return retryableExceptions; }
}

public class RetryExecutor {
    private static final Logger logger = LoggerFactory.getLogger(RetryExecutor.class);
    
    public static <T> T executeWithRetry(Supplier<T> operation, RetryConfig config) throws Exception {
        Exception lastException = null;
        
        for (int attempt = 0; attempt < config.getMaxAttempts(); attempt++) {
            try {
                return operation.get();
            } catch (Exception e) {
                if (!isRetryableException(e, config.getRetryableExceptions())) {
                    throw e;
                }
                
                lastException = e;
                
                if (attempt == config.getMaxAttempts() - 1) {
                    logger.error("Final attempt failed: {}", e.getMessage());
                    throw e;
                }
                
                // Calculate delay with exponential backoff
                long delay = Math.min(
                    (long) (config.getBaseDelayMs() * Math.pow(config.getExponentialBase(), attempt)),
                    config.getMaxDelayMs()
                );
                
                // Add jitter
                if (config.hasJitter()) {
                    delay = (long) (delay * (0.5 + ThreadLocalRandom.current().nextDouble() * 0.5));
                }
                
                logger.warn("Attempt {} failed: {}. Retrying in {}ms", 
                    attempt + 1, e.getMessage(), delay);
                
                try {
                    TimeUnit.MILLISECONDS.sleep(delay);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Retry interrupted", ie);
                }
            }
        }
        
        throw lastException;
    }
    
    private static boolean isRetryableException(Exception e, Set<Class<? extends Exception>> retryableExceptions) {
        return retryableExceptions.stream()
            .anyMatch(exceptionClass -> exceptionClass.isInstance(e));
    }
}

// Usage example
public class ExternalServiceClient {
    public String callService(String data) throws Exception {
        return RetryExecutor.executeWithRetry(
            () -> {
                // External service call logic
                return performServiceCall(data);
            },
            new RetryConfig()
                .maxAttempts(3)
                .baseDelay(1000)
                .retryOn(ExternalServiceError.class, InfrastructureError.class)
        );
    }
}
```

**C# Implementation:**
```csharp
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

public class RetryConfig
{
    public int MaxAttempts { get; set; } = 3;
    public TimeSpan BaseDelay { get; set; } = TimeSpan.FromSeconds(1);
    public TimeSpan MaxDelay { get; set; } = TimeSpan.FromMinutes(1);
    public double ExponentialBase { get; set; } = 2.0;
    public bool Jitter { get; set; } = true;
    public Type[] RetryableExceptions { get; set; } = { typeof(Exception) };
}

public static class RetryExecutor
{
    private static readonly Random _random = new Random();
    
    public static async Task<T> ExecuteWithRetryAsync<T>(
        Func<Task<T>> operation, 
        RetryConfig config, 
        ILogger logger = null,
        CancellationToken cancellationToken = default)
    {
        Exception lastException = null;
        
        for (int attempt = 0; attempt < config.MaxAttempts; attempt++)
        {
            try
            {
                return await operation();
            }
            catch (Exception e) when (IsRetryableException(e, config.RetryableExceptions))
            {
                lastException = e;
                
                if (attempt == config.MaxAttempts - 1)
                {
                    logger?.LogError(e, "Final attempt failed");
                    throw;
                }
                
                // Calculate delay with exponential backoff
                var delay = TimeSpan.FromMilliseconds(
                    Math.Min(
                        config.BaseDelay.TotalMilliseconds * Math.Pow(config.ExponentialBase, attempt),
                        config.MaxDelay.TotalMilliseconds
                    )
                );
                
                // Add jitter
                if (config.Jitter)
                {
                    delay = TimeSpan.FromMilliseconds(
                        delay.TotalMilliseconds * (0.5 + _random.NextDouble() * 0.5)
                    );
                }
                
                logger?.LogWarning("Attempt {Attempt} failed: {Error}. Retrying in {Delay}ms", 
                    attempt + 1, e.Message, delay.TotalMilliseconds);
                
                await Task.Delay(delay, cancellationToken);
            }
        }
        
        throw lastException ?? new InvalidOperationException("Retry logic failed unexpectedly");
    }
    
    public static T ExecuteWithRetry<T>(
        Func<T> operation, 
        RetryConfig config, 
        ILogger logger = null)
    {
        Exception lastException = null;
        
        for (int attempt = 0; attempt < config.MaxAttempts; attempt++)
        {
            try
            {
                return operation();
            }
            catch (Exception e) when (IsRetryableException(e, config.RetryableExceptions))
            {
                lastException = e;
                
                if (attempt == config.MaxAttempts - 1)
                {
                    logger?.LogError(e, "Final attempt failed");
                    throw;
                }
                
                // Calculate delay with exponential backoff
                var delay = TimeSpan.FromMilliseconds(
                    Math.Min(
                        config.BaseDelay.TotalMilliseconds * Math.Pow(config.ExponentialBase, attempt),
                        config.MaxDelay.TotalMilliseconds
                    )
                );
                
                // Add jitter
                if (config.Jitter)
                {
                    delay = TimeSpan.FromMilliseconds(
                        delay.TotalMilliseconds * (0.5 + _random.NextDouble() * 0.5)
                    );
                }
                
                logger?.LogWarning("Attempt {Attempt} failed: {Error}. Retrying in {Delay}ms", 
                    attempt + 1, e.Message, delay.TotalMilliseconds);
                
                Thread.Sleep(delay);
            }
        }
        
        throw lastException ?? new InvalidOperationException("Retry logic failed unexpectedly");
    }
    
    private static bool IsRetryableException(Exception exception, Type[] retryableExceptions)
    {
        foreach (var exceptionType in retryableExceptions)
        {
            if (exceptionType.IsInstanceOfType(exception))
                return true;
        }
        return false;
    }
}

// Usage example
public class ExternalServiceClient
{
    private readonly ILogger<ExternalServiceClient> _logger;
    
    public ExternalServiceClient(ILogger<ExternalServiceClient> logger)
    {
        _logger = logger;
    }
    
    public async Task<string> CallServiceAsync(string data)
    {
        var retryConfig = new RetryConfig
        {
            MaxAttempts = 3,
            BaseDelay = TimeSpan.FromSeconds(1),
            RetryableExceptions = new[] { typeof(ExternalServiceError), typeof(InfrastructureError) }
        };
        
        return await RetryExecutor.ExecuteWithRetryAsync(
            () => PerformServiceCallAsync(data),
            retryConfig,
            _logger
        );
    }
}
```

## 📊 UNIVERSAL STRUCTURED LOGGING

### Structured Error Logging Standards

**Universal Log Entry Format:**
```json
{
  "timestamp": "2024-01-13T10:30:00.123Z",
  "level": "ERROR",
  "message": "User authentication failed",
  "error": {
    "code": "AUTHENTICATION_FAILED",
    "type": "AuthenticationError",
    "stack": "AuthenticationError: Invalid credentials\n    at validateUser...",
    "cause": "Invalid password provided"
  },
  "context": {
    "user_id": "user_12345",
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0...",
    "request_id": "req_abcd1234",
    "session_id": "sess_xyz789"
  },
  "service": "authentication-service",
  "version": "1.2.3",
  "environment": "production"
}
```

**Python Structured Logging:**
```python
import json
import logging
import traceback
from datetime import datetime
from typing import Dict, Any, Optional

class StructuredFormatter(logging.Formatter):
    def __init__(self, service_name: str, version: str, environment: str):
        super().__init__()
        self.service_name = service_name
        self.version = version
        self.environment = environment
    
    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "message": record.getMessage(),
            "service": self.service_name,
            "version": self.version,
            "environment": self.environment
        }
        
        # Add error details if present
        if record.exc_info:
            exc_type, exc_value, exc_traceback = record.exc_info
            log_entry["error"] = {
                "type": exc_type.__name__,
                "message": str(exc_value),
                "stack": traceback.format_exception(exc_type, exc_value, exc_traceback)
            }
            
            # Add error code if it's a BaseError
            if hasattr(exc_value, 'code'):
                log_entry["error"]["code"] = exc_value.code
        
        # Add context if present
        if hasattr(record, 'context'):
            log_entry["context"] = record.context
        
        return json.dumps(log_entry)

# Usage
def setup_logging(service_name: str, version: str, environment: str):
    logger = logging.getLogger()
    handler = logging.StreamHandler()
    formatter = StructuredFormatter(service_name, version, environment)
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    return logger

# Error logging utility
def log_error(logger: logging.Logger, error: Exception, context: Optional[Dict[str, Any]] = None):
    logger.error(
        "Operation failed",
        exc_info=error,
        extra={"context": context or {}}
    )
```

**Java Structured Logging (with Logback/SLF4J):**
```java
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

public class StructuredLogger {
    private static final Logger logger = LoggerFactory.getLogger(StructuredLogger.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    public static void logError(BaseError error, Map<String, Object> context) {
        try {
            // Set MDC for structured context
            MDC.put("error_code", error.getCode());
            MDC.put("error_type", error.getClass().getSimpleName());
            MDC.put("context", objectMapper.writeValueAsString(context));
            
            logger.error("Operation failed: {}", error.getMessage(), error);
            
        } catch (Exception e) {
            logger.error("Failed to log structured error", e);
        } finally {
            MDC.clear();
        }
    }
    
    public static void logError(String message, Exception error, Map<String, Object> context) {
        try {
            MDC.put("error_type", error.getClass().getSimpleName());
            MDC.put("context", objectMapper.writeValueAsString(context));
            
            logger.error(message, error);
            
        } catch (Exception e) {
            logger.error("Failed to log structured error", e);
        } finally {
            MDC.clear();
        }
    }
}
```

**C# Structured Logging (with Serilog):**
```csharp
using Serilog;
using Serilog.Context;
using System;
using System.Collections.Generic;

public static class StructuredLogger
{
    private static ILogger _logger = Log.Logger;
    
    public static void LogError(BaseError error, Dictionary<string, object> context = null)
    {
        using (LogContext.PushProperty("ErrorCode", error.Code))
        using (LogContext.PushProperty("ErrorType", error.GetType().Name))
        using (LogContext.PushProperty("Context", context, destructureObjects: true))
        {
            _logger.Error(error, "Operation failed: {Message}", error.Message);
        }
    }
    
    public static void LogError(string message, Exception error, Dictionary<string, object> context = null)
    {
        using (LogContext.PushProperty("ErrorType", error.GetType().Name))
        using (LogContext.PushProperty("Context", context, destructureObjects: true))
        {
            _logger.Error(error, message);
        }
    }
    
    public static void ConfigureStructuredLogging(string serviceName, string version, string environment)
    {
        Log.Logger = new LoggerConfiguration()
            .Enrich.WithProperty("Service", serviceName)
            .Enrich.WithProperty("Version", version)
            .Enrich.WithProperty("Environment", environment)
            .Enrich.FromLogContext()
            .WriteTo.Console(outputTemplate: 
                "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Service}-{Version} {Message:lj} " +
                "{@Context} {ErrorCode} {ErrorType} {NewLine}{Exception}")
            .CreateLogger();
    }
}
```

## 💡 UNIVERSAL ERROR HANDLING BEST PRACTICES

### Key Principles Summary

**1. Universal Error Classification:**
- Domain errors (business logic violations) 
- Application errors (validation, authentication)
- Infrastructure errors (external services, database)

**2. Consistent Error Response Format:**
- Standard JSON structure across all languages/frameworks
- Include error code, message, timestamp, context
- Maintain request traceability with request IDs

**3. Retry Strategy Guidelines:**
- Exponential backoff with jitter for transient errors
- Circuit breaker pattern for cascading failures  
- Configure retry policies per error type and service

**4. Structured Logging Requirements:**
- JSON-formatted error logs with full context
- Include stack traces for debugging
- Filter sensitive data from logs
- Correlate errors across distributed systems

**5. Language-Agnostic Implementation:**
- Define error hierarchies using inheritance/composition
- Implement middleware/interceptors for centralized error handling
- Use appropriate logging frameworks for structured output
- Apply retry patterns with framework-specific tools

### Production Readiness Checklist

- [ ] Error classes implement universal base pattern
- [ ] All errors include proper context and codes
- [ ] Middleware handles errors consistently across endpoints
- [ ] Retry logic configured for external dependencies
- [ ] Structured logging captures full error context
- [ ] Sensitive data excluded from error responses
- [ ] Error monitoring and alerting configured
- [ ] Error handling tested for all failure scenarios

---
**Última atualização**: 2025-01-13  
**Versão**: 2.0 - Universal Language-Agnostic Error Handling
export class Result<T, E = Error> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: E
  ) {}

  static success<T, E = Error>(value: T): Result<T, E> {
    return new Result<T, E>(true, value);
  }

  static failure<T, E = Error>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  static async fromPromise<T, E = Error>(
    promise: Promise<T>,
    errorHandler?: (error: any) => E
  ): Promise<Result<T, E>> {
    try {
      const value = await promise;
      return Result.success<T, E>(value);
    } catch (error) {
      const handledError = errorHandler ? errorHandler(error) : error as E;
      return Result.failure<T, E>(handledError);
    }
  }

  get isSuccess(): boolean {
    return this._isSuccess;
  }

  get isFailure(): boolean {
    return !this._isSuccess;
  }

  getValue(): T {
    if (!this._isSuccess) {
      throw new Error('Cannot get value from failed result');
    }
    return this._value!;
  }

  getError(): E {
    if (this._isSuccess) {
      throw new Error('Cannot get error from successful result');
    }
    return this._error!;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this._isSuccess) {
      return Result.success<U, E>(fn(this._value!));
    }
    return Result.failure<U, E>(this._error!);
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (this._isSuccess) {
      return fn(this._value!);
    }
    return Result.failure<U, E>(this._error!);
  }

  mapError<F>(fn: (error: E) => F): Result<T, F> {
    if (this._isSuccess) {
      return Result.success<T, F>(this._value!);
    }
    return Result.failure<T, F>(fn(this._error!));
  }

  match<U>(
    onSuccess: (value: T) => U,
    onFailure: (error: E) => U
  ): U {
    if (this._isSuccess) {
      return onSuccess(this._value!);
    }
    return onFailure(this._error!);
  }
}

// Usage example
export class UserService {
  async getUserById(id: string): Promise<Result<User, ApplicationError>> {
    return Result.fromPromise(
      this.userRepository.findById(id),
      (error) => new ApplicationError(
        'GET_USER_FAILED',
        'Failed to get user',
        500,
        { userId: id, originalError: error.message }
      )
    );
  }

  async createUser(data: CreateUserData): Promise<Result<User, ValidationError | ApplicationError>> {
    // Validation
    if (!data.email) {
      return Result.failure(new ValidationError('email', data.email, 'Email is required'));
    }

    // Business logic
    const userResult = await this.getUserByEmail(data.email);
    if (userResult.isSuccess) {
      return Result.failure(new ApplicationError(
        'USER_ALREADY_EXISTS',
        'User with this email already exists',
        409
      ));
    }

    // Create user
    return Result.fromPromise(
      this.userRepository.create(data),
      (error) => new ApplicationError(
        'CREATE_USER_FAILED',
        'Failed to create user',
        500,
        { userData: data, originalError: error.message }
      )
    );
  }
}
```

## 📊 STRUCTURED ERROR LOGGING

### Error Context Collection
```typescript
// utils/error-context.ts
interface ErrorContext {
  requestId?: string;
  userId?: string;
  operation: string;
  metadata: Record<string, any>;
  timestamp: Date;
  environment: string;
}

export class ErrorCollector {
  private context: Partial<ErrorContext> = {};

  setContext(context: Partial<ErrorContext>): this {
    this.context = { ...this.context, ...context };
    return this;
  }

  addMetadata(key: string, value: any): this {
    this.context.metadata = { ...this.context.metadata, [key]: value };
    return this;
  }

  logError(error: Error): void {
    const enrichedError = {
      ...error,
      context: this.context,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };

    logger.error('Error occurred', enrichedError);

    // Send to external monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(enrichedError);
    }
  }

  private sendToMonitoring(error: any): void {
    // Integration with Sentry, DataDog, etc.
    // Sentry.captureException(error);
  }
}

// Usage in middleware
export const errorContextMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errorCollector = new ErrorCollector()
    .setContext({
      requestId: req.headers['x-request-id'] as string,
      operation: `${req.method} ${req.path}`,
      metadata: {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        body: req.body,
        query: req.query
      }
    });

  req.errorCollector = errorCollector;
  next();
};
```

## 🧪 ERROR TESTING PATTERNS

### Error Testing Templates
```typescript
// tests/unit/services/user.service.test.ts
describe('UserService Error Handling', () => {
  describe('createUser', () => {
    it('should return ValidationError for invalid email', async () => {
      const result = await userService.createUser({
        email: 'invalid-email',
        name: 'Test User'
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBeInstanceOf(ValidationError);
      expect(result.getError().code).toBe('VALIDATION_ERROR');
    });

    it('should return ApplicationError when user already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      const result = await userService.createUser({
        email: 'existing@test.com',
        name: 'Test User'
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBeInstanceOf(ApplicationError);
      expect(result.getError().code).toBe('USER_ALREADY_EXISTS');
    });

    it('should handle database connection errors', async () => {
      const dbError = new Error('Connection timeout');
      mockUserRepository.create.mockRejectedValue(dbError);

      const result = await userService.createUser({
        email: 'test@test.com',
        name: 'Test User'
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBeInstanceOf(ApplicationError);
      expect(result.getError().context?.originalError).toBe(dbError.message);
    });
  });

  describe('retry mechanism', () => {
    it('should retry on RetryableError', async () => {
      let attempts = 0;
      const operation = jest.fn().mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          throw new RetryableError('Service temporarily unavailable');
        }
        return 'success';
      });

      const result = await withRetry(operation, { maxAttempts: 3 });

      expect(result).toBe('success');
      expect(attempts).toBe(3);
    });

    it('should not retry on non-retryable errors', async () => {
      const operation = jest.fn().mockRejectedValue(
        new ValidationError('email', 'invalid', 'Invalid format')
      );

      await expect(withRetry(operation, { maxAttempts: 3 }))
        .rejects
        .toThrow(ValidationError);
      
      expect(operation).toHaveBeenCalledTimes(1);
    });
  });
});
```

## 🔍 ERROR MONITORING & ALERTING

### Health Check Implementation
```typescript
// infrastructure/web/controllers/health.controller.ts
interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  services: Record<string, ServiceHealth>;
  uptime: number;
}

interface ServiceHealth {
  status: 'up' | 'down';
  responseTime?: number;
  error?: string;
}

export class HealthController {
  constructor(
    private databaseService: DatabaseService,
    private redisService: RedisService,
    private externalApiService: ExternalApiService
  ) {}

  async getHealth(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    const services: Record<string, ServiceHealth> = {};

    // Check database
    try {
      const dbStart = Date.now();
      await this.databaseService.ping();
      services.database = {
        status: 'up',
        responseTime: Date.now() - dbStart
      };
    } catch (error) {
      services.database = {
        status: 'down',
        error: error.message
      };
    }

    // Check Redis
    try {
      const redisStart = Date.now();
      await this.redisService.ping();
      services.redis = {
        status: 'up',
        responseTime: Date.now() - redisStart
      };
    } catch (error) {
      services.redis = {
        status: 'down',
        error: error.message
      };
    }

    // Determine overall status
    const allUp = Object.values(services).every(s => s.status === 'up');
    const anyDown = Object.values(services).some(s => s.status === 'down');
    
    const status: HealthStatus['status'] = allUp ? 'healthy' : anyDown ? 'unhealthy' : 'degraded';

    const healthStatus: HealthStatus = {
      status,
      timestamp: new Date().toISOString(),
      services,
      uptime: process.uptime()
    };

    const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  }
}
```

## ✅ ERROR HANDLING CHECKLIST

### Development Checklist
- [ ] Custom error classes definidas para cada domínio?
- [ ] Error hierarchy seguindo BaseError?
- [ ] Middleware de error handling configurado?
- [ ] Retry pattern implementado onde necessário?
- [ ] Result pattern usado para operações que podem falhar?
- [ ] Context collection implementado para debugging?
- [ ] Structured logging configurado?
- [ ] Health checks implementados?

### Testing Checklist
- [ ] Testes para cada tipo de erro?
- [ ] Testes de retry mechanism?
- [ ] Testes de error boundaries?
- [ ] Testes de error propagation?
- [ ] Testes de health checks?
- [ ] Error monitoring testado?

## 🎯 EXEMPLO COMPLETO

### Service com Error Handling Completo
```typescript
// services/payment.service.ts
export class PaymentService {
  constructor(
    private stripeService: StripeService,
    private paymentRepository: PaymentRepository,
    private logger: Logger
  ) {}

  async processPayment(request: ProcessPaymentRequest): Promise<Result<Payment, PaymentError>> {
    const errorCollector = new ErrorCollector()
      .setContext({
        operation: 'processPayment',
        metadata: { amount: request.amount, currency: request.currency }
      });

    try {
      // Validate input
      const validationResult = this.validatePaymentRequest(request);
      if (validationResult.isFailure) {
        return validationResult;
      }

      // Create payment intent with retry
      const stripeResult = await withRetry(
        () => this.createStripePaymentIntent(request),
        {
          maxAttempts: 3,
          retryCondition: (error) => error instanceof ExternalServiceError
        }
      );

      // Save payment record
      const payment = await this.paymentRepository.create({
        id: stripeResult.id,
        amount: request.amount,
        currency: request.currency,
        status: 'pending'
      });

      this.logger.info('Payment processed successfully', {
        paymentId: payment.id,
        amount: request.amount
      });

      return Result.success(payment);

    } catch (error) {
      errorCollector.addMetadata('error', error.message).logError(error);

      if (error instanceof ValidationError) {
        return Result.failure(error);
      }

      if (error instanceof ExternalServiceError) {
        return Result.failure(new PaymentError(
          'PAYMENT_PROCESSING_FAILED',
          'Payment processing temporarily unavailable',
          { originalError: error.message }
        ));
      }

      return Result.failure(new PaymentError(
        'INTERNAL_ERROR',
        'An unexpected error occurred during payment processing',
        { originalError: error.message }
      ));
    }
  }

  private validatePaymentRequest(request: ProcessPaymentRequest): Result<void, ValidationError> {
    if (!request.amount || request.amount <= 0) {
      return Result.failure(new ValidationError('amount', request.amount, 'Amount must be positive'));
    }

    if (!request.currency || request.currency.length !== 3) {
      return Result.failure(new ValidationError('currency', request.currency, 'Currency must be 3 characters'));
    }

    return Result.success(undefined);
  }

  private async createStripePaymentIntent(request: ProcessPaymentRequest): Promise<PaymentIntent> {
    try {
      return await this.stripeService.createPaymentIntent({
        amount: request.amount,
        currency: request.currency,
        metadata: { source: 'api' }
      });
    } catch (error) {
      throw new ExternalServiceError(
        'stripe',
        'createPaymentIntent',
        error,
        { amount: request.amount, currency: request.currency }
      );
    }
  }
}
```

## 📐 RESUMO EXECUTIVO - ERROR HANDLING

### Regras de Ouro para Error Handling Universal
```text
1. 🚨 ALWAYS fail fast and fail safe
2. 📊 Classify errors by type and severity level
3. 🔄 Use retry patterns only for transient failures
4. 📝 Log all errors with sufficient context
5. 🎯 Handle errors at appropriate layer boundaries
6. 🛡️ Never expose sensitive information in error messages
7. 🔧 Use Result pattern for predictable failure operations
8. 📈 Implement proper monitoring and alerting
9. 🧪 Test all error scenarios thoroughly
10. 🌐 Provide consistent error responses across APIs
```

---
**Última atualização**: 2025-01-13
**Versão**: 2.0 - Universal Language-Agnostic Error Handling
