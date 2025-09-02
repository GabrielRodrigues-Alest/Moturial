# 03 - Security Guidelines (Diretrizes de Segurança)

## 🎯 OBJETIVO
Garantir que todo código gerado pela IA implemente segurança desde o design, seguindo princípios de Security by Design, independente da linguagem ou stack utilizada.

## 🔐 PRINCÍPIOS FUNDAMENTAIS UNIVERSAIS

### 1. Zero Trust Architecture
- **NUNCA** confie em dados de entrada (qualquer fonte)
- **SEMPRE** valide, sanitize e authorize em todas as camadas
- **JAMAIS** confie apenas em validação client-side

### 2. Defense in Depth
- Múltiplas camadas de segurança independentes
- Redundância de controles de segurança
- Fail securely (falhar de forma segura sempre)

### 3. Least Privilege Principle
- Acesso mínimo necessário para operação
- Permissões específicas por contexto
- Revogação automática quando não necessário

## 🛡️ OWASP TOP 10 - PRINCÍPIOS UNIVERSAIS

### 1. Broken Access Control
```text
// ✅ Princípios obrigatórios para qualquer linguagem

AUTHENTICATION & AUTHORIZATION:
- Implementar autenticação robusta em TODAS as operações sensíveis
- Validar permissões em CADA request/operação
- Usar princípio de menor privilégio
- Session management seguro
- Logout adequado em todas as sessões

ACCESS CONTROL PATTERNS:
- Role-Based Access Control (RBAC)
- Attribute-Based Access Control (ABAC) 
- Permission-based authorization
- Resource-level access control
- Context-aware permissions

VALIDATION RULES:
- Verificar ownership de recursos
- Validar hierarquias de acesso
- Implementar rate limiting
- Log de tentativas de acesso negado
- Fail secure (negar por padrão)
```

### Exemplos Multi-linguagem
```python
# Python - Decorator pattern
from functools import wraps
from flask import request, jsonify, g

def require_auth(required_permissions):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header or not validate_token(auth_header):
                return jsonify({'error': 'Authentication required'}), 401
            
            user_permissions = get_user_permissions(g.user_id)
            if not all(perm in user_permissions for perm in required_permissions):
                log_access_denied(g.user_id, required_permissions)
                return jsonify({'error': 'Insufficient permissions'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.route('/admin/users')
@require_auth(['admin:read'])
def get_users():
    return get_users_handler()
```

```java
// Java - Annotation-based security
@RestController
public class UserController {
    
    @PreAuthorize("hasPermission('admin:read')")
    @GetMapping("/admin/users")
    public ResponseEntity<List<User>> getUsers(Authentication auth) {
        if (!isAuthenticated(auth)) {
            throw new AuthenticationException("Authentication required");
        }
        
        if (!hasRequiredPermissions(auth, "admin:read")) {
            logAccessDenied(auth.getName(), "admin:read");
            throw new AccessDeniedException("Insufficient permissions");
        }
        
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
```
```

### 2. Cryptographic Failures
```text
// ✅ Princípios criptográficos universais

PASSWORD SECURITY:
- SEMPRE hash senhas com salt
- Usar algoritmos seguros (bcrypt, scrypt, argon2)
- Mínimo 12 rounds/iterations
- NUNCA armazenar senhas em plain text
- Implementar política de senhas fortes

ENCRYPTION STANDARDS:
- AES-256 para encryption simétrica
- RSA-2048+ ou ECC para asymétrica
- TLS 1.3 para transport
- Proper key management
- Rotate keys periodically

DATA PROTECTION:
- Encrypt data at rest
- Encrypt data in transit  
- Proper random number generation
- Secure key storage (HSM/Key Vault)
- NEVER hardcode keys/secrets
```

### Exemplos Multi-linguagem
```python
# Python - Password hashing with bcrypt
import bcrypt
import secrets
from cryptography.fernet import Fernet

def hash_password(password: str) -> str:
    # Generate salt and hash password
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def encrypt_sensitive_data(data: str, key: bytes) -> str:
    f = Fernet(key)
    encrypted = f.encrypt(data.encode('utf-8'))
    return encrypted.decode('utf-8')

def generate_secure_key() -> bytes:
    return Fernet.generate_key()
```

```java
// Java - Spring Security password encoding
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

@Service
public class CryptoService {
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);
    
    public String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }
    
    public boolean verifyPassword(String password, String hash) {
        return passwordEncoder.matches(password, hash);
    }
    
    public String encryptData(String data, SecretKey key) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.ENCRYPT_MODE, key);
        byte[] encrypted = cipher.doFinal(data.getBytes("UTF-8"));
        return Base64.getEncoder().encodeToString(encrypted);
    }
}
```

```csharp
// C# - ASP.NET Core Identity
using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;

public class CryptoService
{
    private readonly IPasswordHasher<User> _passwordHasher;
    
    public string HashPassword(User user, string password)
    {
        return _passwordHasher.HashPassword(user, password);
    }
    
    public bool VerifyPassword(User user, string hashedPassword, string password)
    {
        var result = _passwordHasher.VerifyHashedPassword(user, hashedPassword, password);
        return result == PasswordVerificationResult.Success;
    }
    
    public string EncryptData(string data, byte[] key)
    {
        using (var aes = Aes.Create())
        {
            aes.Key = key;
            aes.GenerateIV();
            
            using (var encryptor = aes.CreateEncryptor())
            {
                var dataBytes = Encoding.UTF8.GetBytes(data);
                var encrypted = encryptor.TransformFinalBlock(dataBytes, 0, dataBytes.Length);
                return Convert.ToBase64String(aes.IV.Concat(encrypted).ToArray());
            }
        }
    }
}
```
```

### 3. Injection Prevention
```text
// ✅ Princípios universais de prevenção de injeção

SQL INJECTION PREVENTION:
- SEMPRE usar parameterized queries/prepared statements
- NUNCA concatenar strings para queries
- Usar ORMs que implementam proteção automática
- Validar e sanitizar TODOS os inputs
- Implementar whitelist de caracteres permitidos

COMMAND INJECTION PREVENTION:
- NUNCA executar comandos diretamente com input do usuário
- Usar bibliotecas específicas ao invés de shell commands
- Implementar whitelist de comandos permitidos
- Sanitizar todos os parâmetros
- Usar sandboxing quando possível

INPUT VALIDATION RULES:
- Validar tipo, tamanho, formato e range
- Rejeitar caracteres especiais desnecessários
- Implementar encoding adequado (HTML, URL, etc)
- Usar libraries de validação robustas
- Log tentativas de injection
```

### 4. Insecure Design Prevention
```text
// ✅ Princípios de Design Seguro Universal

SECURE BY DESIGN PRINCIPLES:
- Implementar segurança desde o design inicial
- Princípio de falha segura (fail securely)
- Defense in depth com múltiplas camadas
- Least privilege em todas as operações
- Assume breach - planejar para falhas

RESILIENCE PATTERNS:
- Rate limiting em todas as APIs públicas
- Circuit breaker para dependências externas
- Retry logic com exponential backoff
- Timeout adequado em todas as operações
- Graceful degradation quando possível

SECURITY CONTROLS:
- Input validation em todas as camadas
- Output encoding baseado no contexto
- Secure session management
- Proper error handling (não vazar informações)
- Comprehensive logging e monitoring
```

### Exemplos Multi-linguagem
```python
# Python - Rate Limiting e Session Security
from functools import wraps
from flask import request, session, jsonify
from datetime import datetime, timedelta
import redis
import secrets

class RateLimiter:
    def __init__(self, redis_client, max_attempts=5, window_minutes=15):
        self.redis = redis_client
        self.max_attempts = max_attempts
        self.window_minutes = window_minutes
    
    def is_rate_limited(self, identifier: str) -> bool:
        key = f"rate_limit:{identifier}"
        current_count = self.redis.get(key)
        
        if current_count is None:
            self.redis.setex(key, self.window_minutes * 60, 1)
            return False
        
        if int(current_count) >= self.max_attempts:
            return True
        
        self.redis.incr(key)
        return False

def require_rate_limit(limiter: RateLimiter):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            identifier = request.remote_addr
            
            if limiter.is_rate_limited(identifier):
                return jsonify({
                    'error': 'Rate limit exceeded',
                    'retry_after': f'{limiter.window_minutes} minutes'
                }), 429
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Session configuration
class SecureSession:
    def __init__(self, app):
        app.config['SECRET_KEY'] = os.environ.get('SESSION_SECRET')
        app.config['SESSION_COOKIE_SECURE'] = os.environ.get('ENV') == 'production'
        app.config['SESSION_COOKIE_HTTPONLY'] = True
        app.config['SESSION_COOKIE_SAMESITE'] = 'Strict'
        app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)
```

### 5. Security Misconfiguration Prevention
```text
// ✅ Princípios de Configuração Segura Universal

SECURE HEADERS (aplicar em qualquer stack):
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options (clickjacking protection)
- X-Content-Type-Options (MIME sniffing protection)
- Referrer-Policy (controlar informações de referência)

CORS CONFIGURATION:
- Definir origins específicos (nunca usar wildcard em produção)
- Limitar métodos HTTP permitidos
- Configurar headers permitidos adequadamente
- Credentials apenas quando necessário
- Preflight caching adequado

ENVIRONMENT SECURITY:
- Secrets NUNCA em código/repositories
- Validation de variáveis de ambiente obrigatória
- Separate configs por ambiente (dev/staging/prod)
- Rotate secrets periodically
- Use dedicated secret management tools
```

## 🔑 AUTENTICAÇÃO E AUTORIZAÇÃO UNIVERSAIS

### Princípios de Autenticação Segura
```text
// ✅ Princípios universais de autenticação

JWT/TOKEN SECURITY:
- Secret key com mínimo 32 caracteres
- Algoritmo seguro (HS256, RS256)
- Expiration time adequado (não muito longo)
- Proper token validation em TODOS os requests
- Refresh token strategy para sessões longas

SESSION MANAGEMENT:
- Secure session storage
- Session timeout adequado
- Proper logout (invalidate em todas as sessões)
- Session fixation protection
- Concurrent session control

PASSWORD POLICIES:
- Minimum length requirements
- Complexity requirements when appropriate
- Account lockout após tentativas falhadas
- Password history para evitar reutilização
- Secure password reset process
```

### 6. Vulnerable Components Management
```text
// ✅ Princípios de Gestão de Dependências Universal

DEPENDENCY MANAGEMENT:
- Manter todas as dependências atualizadas
- Usar versões específicas (evitar wildcards)
- Audit regular de vulnerabilidades
- Automated security scanning no CI/CD
- Dependency pinning em produção

SECURITY SCANNING:
- Integrar ferramentas de scan no pipeline
- Monitor CVE databases continuamente
- Set up alerts para novas vulnerabilidades
- Implement automated patching quando seguro
- Quarantine vulnerable dependencies

VULNERABILITY RESPONSE:
- Response plan para zero-day vulnerabilities
- Emergency patch process
- Rollback strategy preparada
- Communication plan para stakeholders
- Post-incident review obrigatório
```

### 7-10. Demais Vulnerabilidades OWASP
```text
// ✅ Princípios para demais vulnerabilidades OWASP Top 10

7. IDENTIFICATION & AUTHENTICATION FAILURES:
- Implement strong session management
- Prevent session fixation attacks
- Secure password recovery processes
- Multi-factor authentication quando apropriado
- Account enumeration protection

8. SOFTWARE & DATA INTEGRITY FAILURES:
- Verify integrity de software updates
- Use signed packages quando possível
- Implement CI/CD pipeline security
- Code signing para releases
- Supply chain security validation

9. SECURITY LOGGING & MONITORING FAILURES:
- Log ALL security-relevant events
- Implement real-time monitoring
- Set up alerting para suspicious activities
- Regular log analysis e review
- Correlation de events across systems

10. SERVER-SIDE REQUEST FORGERY (SSRF):
- Validate e sanitize ALL URLs
- Use allowlist para domains permitidos
- Disable redirects em requests externos
- Network segmentation para internal services
- Monitor e log outbound requests
```

## 📊 MONITORAMENTO DE SEGURANÇA UNIVERSAL

### Security Logging Principles
```text
// ✅ Princípios de logging de segurança

SECURITY EVENTS TO LOG (OBRIGATÓRIO):
- Authentication attempts (success/failure)
- Authorization failures
- Input validation failures
- Output validation failures
- Application errors e exceptions
- Administrative privilege usage
- TLS failures e protocol violations
- Network connection failures

LOG DATA REQUIREMENTS:
- Timestamp preciso
- Source IP address
- User identifier (quando disponível)
- Event type e severity
- Request details (sanitized)
- Response status
- Session identifier
- Correlation ID para tracking

LOG PROTECTION:
- Logs devem ser imutáveis
- Centralized logging system
- Log integrity verification
- Secure log storage com retention policy
- Regular log backup
```

### Incident Response Universal
```text
// ✅ Princípios de resposta a incidentes

INCIDENT CLASSIFICATION:
- LOW: Suspicious activity, não confirmed threat
- MEDIUM: Confirmed threat, limited impact
- HIGH: Confirmed threat, significant impact  
- CRITICAL: Confirmed threat, severe impact/data breach

RESPONSE PROCEDURES:
1. DETECTION - Identify e classify incident
2. CONTAINMENT - Isolate affected systems
3. ERADICATION - Remove threat completely
4. RECOVERY - Restore systems safely
5. LESSONS LEARNED - Post-incident analysis

AUTOMATED RESPONSES:
- Auto-block suspicious IP addresses
- Rate limiting escalation
- Account lockout após multiple failures
- System isolation em case of compromise
- Alert escalation baseado em severity

FORENSIC REQUIREMENTS:
- Preserve evidence antes de containment
- Maintain chain of custody
- Document ALL actions taken
- Timeline reconstruction
- Root cause analysis
```

## 🚨 IMPLEMENTAÇÃO OBRIGATÓRIA

### Security Checklist Universal
```text
// ✅ Checklist obrigatório antes de produção

AUTHENTICATION & AUTHORIZATION:
☐ Strong password policies implemented
☐ MFA available para privileged accounts
☐ Session management secure
☐ Proper access controls em all resources
☐ Regular access reviews

DATA PROTECTION:
☐ Encryption em rest para sensitive data
☐ Encryption em transit (TLS 1.3)
☐ Proper key management
☐ Data classification implemented
☐ Backup encryption verified

INPUT VALIDATION:
☐ All inputs validated server-side
☐ Parameterized queries used
☐ Output encoding implemented
☐ File upload restrictions
☐ API input validation

MONITORING & LOGGING:
☐ Security events logged
☐ Log integrity protected
☐ Real-time monitoring active
☐ Incident response plan tested
☐ Regular security assessments
```

## 🚫 SECURITY ANTI-PATTERNS UNIVERSAIS

### ❌ Práticas Proibidas em Qualquer Linguagem
```text
// NUNCA fazer essas práticas:

SQL INJECTION VULNERABILITIES:
// ❌ String concatenation para queries
query = "SELECT * FROM users WHERE id = " + userId

// ❌ Não usar prepared statements
query = f"SELECT * FROM users WHERE name = '{username}'"

WEAK AUTHENTICATION:
// ❌ Senhas fracas hardcoded
password = "123456" ou "password"

// ❌ Não hash senhas
user.password = plainTextPassword

// ❌ JWT secrets fracos
jwtSecret = "secret" ou "mykey"

INSECURE DATA HANDLING:
// ❌ Logs com dados sensíveis
log.info(f"User login: {username} with password {password}")

// ❌ Não validar inputs
processUserData(request.body) // sem validation

// ❌ Error messages que vazam informação
throw new Error("User john@example.com not found in database")

INSECURE COMMUNICATION:
// ❌ HTTP em produção
http://api.example.com/sensitive-data

// ❌ Não validar SSL certificates
verify_ssl = False

// ❌ CORS muito permissivo
AllowedOrigins = "*"
```

### ✅ Práticas Recomendadas Universais
```text
// Sempre implementar essas práticas:

SECURE SQL QUERIES:
// ✅ Sempre usar parameterized queries
query = "SELECT * FROM users WHERE id = ?"
params = [userId]

// ✅ Use ORMs com proteção automática
user = User.findById(userId)  // ORM protegido

STRONG AUTHENTICATION:
// ✅ Hash senhas com salt
hashedPassword = bcrypt.hash(password, rounds=12)

// ✅ JWT secrets fortes (32+ caracteres)
jwtSecret = generateSecureSecret(32)

// ✅ Token expiration adequado
token_expiry = datetime.now() + timedelta(hours=1)

SECURE DATA HANDLING:
// ✅ Input validation obrigatória
validated_data = validate_schema(request_data)

// ✅ Output sanitization
clean_output = sanitize_output(data)

// ✅ Error handling seguro
if not user_found:
    return "Invalid credentials"  // Não vaza informação

SECURE COMMUNICATION:
// ✅ HTTPS sempre em produção
https://api.example.com/data

// ✅ Certificate validation
verify_ssl = True

// ✅ CORS específico
allowed_origins = ["https://myapp.com"]

SECURE LOGGING:
// ✅ Log apenas dados necessários
log.info(f"User {user_id} performed {action}")

// ✅ Sanitize sensitive data
log_data = sanitize_for_logging(request_data)
```

## 📋 RESUMO EXECUTIVO

### Regras de Ouro para Segurança Universal
```text
1. 🔐 NUNCA confiar em input do usuário - validar SEMPRE
2. 🛡️ Implementar defense in depth - múltiplas camadas
3. 🔑 Princípio de menor privilégio - acesso mínimo necessário
4. 📊 Log ALL security events - monitoramento contínuo
5. 🚫 Fail securely - falhar de forma segura sempre
6. 🔄 Keep dependencies updated - scan regularmente
7. 🎯 Security by design - não como afterthought
8. 📝 Document security decisions - rastreabilidade
9. 🧪 Test security controls - validate regularmente
10. 📚 Stay updated - OWASP, CVE databases
```
- [ ] Authentication/Authorization implementados?
- [ ] Incident response plan?

## 🎯 EXEMPLO COMPLETO SEGURO

### API Endpoint com Todas as Práticas
```typescript
import rateLimit from 'express-rate-limit';

const updateUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many update attempts'
});

const UpdateUserSchema = z.object({
  name: z.string().max(100).transform(sanitizeHTML),
  email: EmailSchema,
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/).optional()
}).strict();

export const updateUser = [
  updateUserLimiter,
  requireAuth(['user:update']),
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.params.id;
      
      // Verify user can only update their own data (or admin)
      if (req.auth.userId !== userId && req.auth.role !== 'admin') {
        logSecurityEvent({
          type: 'ACCESS_DENIED',
          userId: req.auth.userId,
          ip: req.ip,
          userAgent: req.headers['user-agent'] || '',
          details: { attemptedUserId: userId },
          timestamp: new Date().toISOString()
        });
        return res.status(403).json({ error: 'Access denied' });
      }

      const validatedData = validateInput(UpdateUserSchema, req.body);
      
      const updatedUser = await userService.updateUser(userId, validatedData);
      
      logger.info('User updated', { userId, updatedBy: req.auth.userId });
      
      res.json({
        success: true,
        data: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email
          // NUNCA retornar senha ou dados sensíveis
        }
      });
      
    } catch (error) {
      logger.error('Error updating user', { error, userId: req.auth.userId });
      res.status(500).json({ error: 'Internal server error' });
    }
  }
];
```

---
**Última atualização**: 2025-08-15
**Versão**: 1.0
