# Sistema de Pagamento Moturial

Sistema de pagamento robusto e seguro desenvolvido em Java com integração completa à API da Stripe, seguindo os mais altos padrões de qualidade, segurança e arquitetura.

## 🚀 Características

- **Segurança OWASP**: Implementa todas as diretrizes de segurança OWASP
- **Integração Stripe**: Processamento completo de pagamentos via Stripe
- **Validação Rigorosa**: Validação e sanitização de todos os inputs
- **Tratamento de Erros**: Sistema abrangente de tratamento de exceções
- **Retry Logic**: Lógica de retry automático para operações críticas
- **Testes Abrangentes**: Cobertura completa de testes unitários e de integração
- **Arquitetura Limpa**: Seguindo princípios SOLID e Clean Code
- **Injeção de Dependência**: Arquitetura modular e testável

## 🛠️ Tecnologias

- **Java 17**: Linguagem principal
- **Spring Boot 3.2.0**: Framework de aplicação
- **Spring Security**: Segurança e autenticação
- **Spring Data JPA**: Persistência de dados
- **Stripe Java SDK**: Integração com Stripe
- **Hibernate Validator**: Validação de dados
- **JUnit 5**: Testes unitários
- **Mockito**: Mocking para testes
- **TestContainers**: Testes de integração
- **Maven**: Gerenciamento de dependências

## 📋 Pré-requisitos

- Java 17 ou superior
- Maven 3.6+
- PostgreSQL (opcional, H2 para desenvolvimento)
- Conta Stripe com chaves de API

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd backend
```

2. **Configure as variáveis de ambiente**
```bash
# Stripe Configuration
export STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
export STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
export STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Database Configuration
export DATABASE_URL=jdbc:postgresql://localhost:5432/moturial_payments
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=your_password

# Security Configuration
export JWT_SECRET=your-256-bit-secret-key-here-change-in-production
export SECURITY_USER_NAME=admin
export SECURITY_USER_PASSWORD=admin123
```

3. **Compile o projeto**
```bash
mvn clean compile
```

4. **Execute os testes**
```bash
mvn test
```

5. **Execute a aplicação**
```bash
mvn spring-boot:run
```

## 🎯 Uso

### Endpoints Disponíveis

#### Processar Pagamento com Cartão
```http
POST /api/v1/payments/card
Content-Type: application/json
Authorization: Bearer <token>

{
  "userId": "user123",
  "amount": 100.00,
  "currency": "BRL",
  "paymentMethod": "CARD",
  "installments": 1,
  "description": "Aluguel de moto",
  "customer": {
    "name": "João Silva",
    "email": "joao@email.com",
    "document": "12345678901",
    "phone": "+5511999999999"
  },
  "card": {
    "number": "4242424242424242",
    "holderName": "João Silva",
    "expiryDate": "12/25",
    "cvv": "123"
  }
}
```

#### Processar Pagamento PIX
```http
POST /api/v1/payments/pix
Content-Type: application/json
Authorization: Bearer <token>

{
  "userId": "user123",
  "amount": 100.00,
  "currency": "BRL",
  "paymentMethod": "PIX",
  "description": "Aluguel de moto",
  "customer": {
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

#### Consultar Status do Pagamento
```http
GET /api/v1/payments/{externalId}/status
Authorization: Bearer <token>
```

#### Cancelar Pagamento
```http
POST /api/v1/payments/{externalId}/cancel
Authorization: Bearer <token>
```

#### Listar Pagamentos do Usuário
```http
GET /api/v1/payments/user/{userId}
Authorization: Bearer <token>
```

## 🧪 Testes

### Executar Todos os Testes
```bash
mvn test
```

### Executar Testes com Cobertura
```bash
mvn clean test jacoco:report
```

### Executar Testes de Integração
```bash
mvn test -Dtest=*IntegrationTest
```

## 🔒 Segurança

### Cartões de Teste Stripe

Para testes, utilize os seguintes cartões:

- **Visa**: `4242424242424242`
- **Mastercard**: `5555555555554444`
- **American Express**: `378282246310005`
- **Cartão com erro**: `4000000000000002`
- **Cartão insuficiente**: `4000000000009995`

### Validações Implementadas

- ✅ Validação de número de cartão (algoritmo de Luhn)
- ✅ Validação de data de expiração
- ✅ Validação de CVV
- ✅ Sanitização de inputs
- ✅ Validação de valores monetários
- ✅ Validação de emails
- ✅ Validação de CPF
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Headers de segurança

## 📊 Monitoramento

### Health Check
```http
GET /api/v1/payments/health
```

### Métricas
```http
GET /actuator/metrics
GET /actuator/health
```

## 🚀 Deploy

### Docker
```bash
# Build da imagem
docker build -t moturial-payment-service .

# Executar container
docker run -p 8080:8080 \
  -e STRIPE_SECRET_KEY=sk_test_... \
  -e DATABASE_URL=jdbc:postgresql://... \
  moturial-payment-service
```

### Produção
```bash
# Build para produção
mvn clean package -Pprod

# Executar JAR
java -jar target/payment-service-1.0.0.jar
```

## 📝 Logs

Os logs são configurados para diferentes níveis:

- **INFO**: Operações normais
- **WARN**: Avisos e validações
- **ERROR**: Erros de processamento
- **DEBUG**: Informações detalhadas (desenvolvimento)

## 🔧 Configuração

### application.yml
```yaml
spring:
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}
  
  datasource:
    url: ${DATABASE_URL:jdbc:h2:mem:testdb}
    username: ${DATABASE_USERNAME:sa}
    password: ${DATABASE_PASSWORD:}

stripe:
  secret-key: ${STRIPE_SECRET_KEY}
  publishable-key: ${STRIPE_PUBLISHABLE_KEY}
  webhook-secret: ${STRIPE_WEBHOOK_SECRET}
  currency: ${STRIPE_CURRENCY:BRL}

payment:
  validation:
    card-number-pattern: "^[0-9]{13,19}$"
    cvv-pattern: "^[0-9]{3,4}$"
    expiry-pattern: "^(0[1-9]|1[0-2])/([0-9]{2})$"
  limits:
    max-amount: ${MAX_PAYMENT_AMOUNT:1000000}
    min-amount: ${MIN_PAYMENT_AMOUNT:100}
    max-installments: ${MAX_INSTALLMENTS:12}
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte, entre em contato:
- Email: suporte@moturial.com
- Documentação: [docs.moturial.com](https://docs.moturial.com)

---

**Desenvolvido com ❤️ pela equipe Moturial**
