# 06 - Prompt Engineering (Engenharia de Prompts)

## 🎯 OBJETIVO
Otimizar a comunicação com IA para obter código production-ready, eliminar alucinações e manter precisão técnica.

## ⚡ PRINCÍPIOS DE PROMPT ENGINEERING

### 1. Especificidade Máxima
- **SEMPRE** forneça contexto técnico completo
- **NUNCA** assuma que a IA inferirá detalhes
- **JAMAIS** use termos vagos ou genéricos

### 2. Estrutura Hierárquica
- Organize informações em níveis de prioridade
- Use marcadores e seções claramente definidas
- Separe requisitos funcionais de não-funcionais

## 🎪 TEMPLATES DE PROMPT PROFISSIONAIS

### Template 1: Feature Implementation
```markdown
## 🎯 OBJETIVO
Implementar [funcionalidade específica] para [contexto do negócio]

## 📊 CONTEXTO TÉCNICO
- **Projeto**: [Nome e descrição]
- **Stack**: [Tecnologias específicas com versões]
- **Arquitetura**: [Padrão arquitetural usado]
- **Database**: [PostgreSQL 15.2 com Prisma ORM]
- **Deploy**: [Docker + AWS ECS]

## 🔧 REQUISITOS FUNCIONAIS
- [ ] [Requisito 1 com critério de aceite]
- [ ] [Requisito 2 com critério de aceite]
- [ ] [Requisito 3 com critério de aceite]

## ⚡ REQUISITOS NÃO-FUNCIONAIS
- **Performance**: [<200ms response time]
- **Segurança**: [OWASP compliance]
- **Escalabilidade**: [Suporta 1000 req/min]
- **Monitoramento**: [Logs estruturados + métricas]

## 🏗️ IMPLEMENTAÇÃO OBRIGATÓRIA
- TypeScript strict mode
- Error handling completo
- Testes unitários (90% coverage)
- Validation com Zod
- Logs estruturados
- Documentation

## 🚫 RESTRIÇÕES
- NUNCA usar dados fictícios
- NUNCA hardcoded values
- NUNCA skip error handling
- NUNCA mock em produção

## 📋 CRITÉRIOS DE ACEITE
- [ ] Código roda sem modificações
- [ ] Todos os imports incluídos
- [ ] Testes passam
- [ ] Performance dentro do SLA
- [ ] Segurança validada

## 💡 EXEMPLOS DE REFERÊNCIA
[Cole código existente que serve como padrão]
```

### Template 2: Bug Fix
```markdown
## 🐛 BUG REPORT
**Título**: [Descrição clara do problema]
**Severidade**: [Critical/High/Medium/Low]
**Ambiente**: [Production/Staging/Development]

## 🔍 PROBLEMA ATUAL
**Comportamento observado**:
[Descrição detalhada do que está acontecendo]

**Comportamento esperado**:
[Descrição do que deveria acontecer]

**Steps to reproduce**:
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

## 📊 CONTEXTO TÉCNICO
- **Arquivo afetado**: [path/to/file.ts]
- **Função/Método**: [nomeDaFuncao()]
- **Stack trace**: [se disponível]
- **Logs de erro**: [logs relevantes]

## 🎯 SOLUÇÃO ESPERADA
- [ ] Corrigir lógica de [específico]
- [ ] Adicionar validação para [caso específico]
- [ ] Implementar error handling para [cenário]
- [ ] Adicionar testes para prevenir regressão

## 🧪 VALIDAÇÃO
- [ ] Testes unitários que reproduzem o bug
- [ ] Testes que validam a correção
- [ ] Teste de regressão
- [ ] Verificação de performance
```

### Template 3: Code Review & Refactoring
```markdown
## 🔄 REFACTORING REQUEST

## 📂 CÓDIGO ATUAL
```typescript
[Cole o código que precisa ser refatorado]
```

## 🎯 OBJETIVOS DO REFACTORING
- [ ] Melhorar performance em [métrica específica]
- [ ] Reduzir complexidade ciclomática
- [ ] Aumentar testabilidade
- [ ] Aplicar padrão [nome do padrão]
- [ ] Eliminar code smells: [específicos]

## 📏 MÉTRICAS ATUAIS
- **Complexidade ciclomática**: [número]
- **Linhas de código**: [número]
- **Coverage de testes**: [percentual]
- **Performance**: [baseline atual]

## 🎯 MÉTRICAS ALVO
- **Complexidade ciclomática**: [alvo]
- **Coverage de testes**: [alvo]
- **Performance**: [melhoria esperada]

## 🏗️ PADRÕES A APLICAR
- [Padrão específico 1]
- [Padrão específico 2]
- [Princípio SOLID específico]

## 🚫 RESTRIÇÕES
- Manter backward compatibility
- Zero breaking changes
- Manter funcionalidade idêntica
- Não alterar interface pública
```

## 🧠 TÉCNICAS AVANÇADAS DE PROMPT

### Chain of Thought (Cadeia de Pensamento)
```markdown
Resolva este problema seguindo esta sequência:

**Passo 1 - Análise**:
Analise o código atual e identifique:
- Pontos de falha
- Dependencies
- Performance bottlenecks

**Passo 2 - Design**:
Projete a solução considerando:
- Arquitetura atual
- Padrões estabelecidos
- Restrições técnicas

**Passo 3 - Implementação**:
Implemente seguindo:
- Ordem de desenvolvimento
- Testes primeiro (TDD)
- Validação contínua

**Passo 4 - Validação**:
Verifique se a solução:
- Atende todos os requisitos
- Mantém performance
- Não quebra funcionalidades existentes

Explique seu raciocínio em cada passo.
```

### Few-Shot Learning
```markdown
## EXEMPLOS DE IMPLEMENTAÇÃO

### Exemplo 1: Controller Pattern
```typescript
// Padrão correto para controllers
export class UserController {
  constructor(
    private useCase: CreateUserUseCase,
    private logger: Logger
  ) {}

  async create(req: Request, res: Response) {
    // Implementation
  }
}
```

### Exemplo 2: Service Pattern
```typescript
// Padrão correto para services
export class UserService {
  constructor(
    private repository: UserRepository,
    private validator: UserValidator
  ) {}

  async createUser(data: CreateUserData) {
    // Implementation
  }
}
```

**Seguindo estes padrões exatos, implemente um [ComponenteAlvo] para [funcionalidade]**
```

### Constraint-Based Prompting
```markdown
## RESTRIÇÕES OBRIGATÓRIAS

### Técnicas
- ✅ DEVE usar TypeScript strict mode
- ✅ DEVE implementar error handling completo
- ✅ DEVE ter 90%+ test coverage
- ✅ DEVE seguir padrão Repository
- ❌ NÃO PODE usar any types
- ❌ NÃO PODE ter console.log
- ❌ NÃO PODE skip validation

### Performance
- ✅ DEVE responder em <200ms
- ✅ DEVE usar connection pooling
- ✅ DEVE implementar caching
- ❌ NÃO PODE fazer N+1 queries
- ❌ NÃO PODE fazer sync operations

### Segurança
- ✅ DEVE validar todos os inputs
- ✅ DEVE sanitizar outputs
- ✅ DEVE usar parameterized queries
- ❌ NÃO PODE ter SQL injection
- ❌ NÃO PODE expor dados sensíveis

**Implemente [funcionalidade] respeitando TODAS as restrições**
```

## 🎛️ CONTEXTO CONTROL PATTERNS

### Gradual Context Building
```markdown
## CONTEXTO LEVEL 1 - BASIC
Projeto: E-commerce API
Stack: Node.js + TypeScript + PostgreSQL

## CONTEXTO LEVEL 2 - DETAILED
- Node.js 18.17.0
- TypeScript 5.1.6 strict mode
- Express 4.18.2
- PostgreSQL 15.2 + Prisma ORM 4.15.0
- Redis 7.0 para cache
- AWS ECS deployment

## CONTEXTO LEVEL 3 - SPECIFIC
- Clean Architecture pattern
- Repository + UseCase layers
- JWT authentication
- Rate limiting: 100 req/min
- CORS: apenas domínios específicos
- Logs: Winston + JSON format
- Monitoring: DataDog APM
- Error handling: AppError classes

**Use o CONTEXTO LEVEL 3 para implementar [funcionalidade]**
```

### Role-Based Prompting
```markdown
## PERSONA: SENIOR BACKEND ARCHITECT

Você é um arquiteto sênior com 10+ anos experiência em:
- Sistemas distribuídos de alto volume
- Clean Architecture + DDD
- Performance optimization
- Security best practices
- Production debugging

**Contexto atual**:
Sistema de pagamentos processando 50k+ transações/hora
Stack: Node.js + TypeScript + PostgreSQL + Redis
Arquitetura: Clean Architecture + CQRS
Deploy: Kubernetes + AWS

**Sua tarefa**:
Implemente um sistema de retry para falhas de pagamento que:
- Seja resiliente a falhas em cascata
- Mantenha idempotência
- Tenha observabilidade completa
- Suporte backpressure

**Aplique toda sua experiência para esta implementação production-ready**
```

## 🔄 FEEDBACK LOOPS

### Iterative Refinement Pattern
```markdown
## ITERATION 1 - BASE IMPLEMENTATION
Implemente [funcionalidade] com requirements básicos:
- [Requisito 1]
- [Requisito 2]
- [Requisito 3]

## ITERATION 2 - QUALITY IMPROVEMENTS
Refine a implementação da Iteration 1 adicionando:
- Error handling completo
- Validation robusta
- Logs estruturados
- Testes unitários

## ITERATION 3 - PRODUCTION HARDENING
Otimize a implementação da Iteration 2 para produção:
- Performance tuning
- Security hardening
- Monitoring e alerting
- Documentation

**Execute uma iteration por vez, validando antes de prosseguir**
```

### Error-Driven Refinement
```markdown
## IMPLEMENTAÇÃO BASE
[Forneça código atual]

## PROBLEMAS IDENTIFICADOS
1. **Erro X**: [Descrição específica]
   - **Causa raiz**: [Análise]
   - **Fix esperado**: [Solução específica]

2. **Problema Y**: [Descrição específica]
   - **Impacto**: [Consequências]
   - **Fix esperado**: [Solução específica]

## VERSÃO CORRIGIDA ESPERADA
Corrija TODOS os problemas identificados mantendo:
- Funcionalidade existente
- Performance atual ou melhor
- Backward compatibility
- Code style consistente

**Explique cada correção implementada**
```

## 📊 PROMPT QUALITY METRICS

### Checklist de Qualidade do Prompt
```markdown
## PRE-PROMPT CHECKLIST
- [ ] Objetivo claramente definido?
- [ ] Contexto técnico completo?
- [ ] Stack especificado com versões?
- [ ] Arquitetura pattern mencionado?
- [ ] Requirements funcionais listados?
- [ ] Requirements não-funcionais especificados?
- [ ] Restrições claramente definidas?
- [ ] Critérios de aceite mencionados?
- [ ] Exemplos de referência incluídos?
- [ ] Formato de output especificado?

## POST-RESPONSE CHECKLIST
- [ ] Resposta atende todos os requisitos?
- [ ] Código é production-ready?
- [ ] Todos os imports incluídos?
- [ ] Error handling implementado?
- [ ] Testes sugeridos/incluídos?
- [ ] Performance considerada?
- [ ] Segurança aplicada?
- [ ] Documentation adequada?
```

## 🚫 PROMPT ANTI-PATTERNS

### ❌ Prompts Vagos
```markdown
// RUIM - Muito genérico
"Crie um sistema de autenticação"

// BOM - Específico e contextualizado
"Implemente autenticação JWT para API Node.js usando:
- Express 4.18.2 + TypeScript strict
- PostgreSQL + Prisma ORM
- Rate limiting: 5 tentativas/15min por IP
- Refresh token rotation
- RBAC com roles: admin, user, guest
- Logging de tentativas com Winston
- Testes com Vitest (90% coverage)
- Error handling com AppError classes"
```

### ❌ Context Overload
```markdown
// RUIM - Informação demais sem estrutura
"Preciso de um sistema completo de e-commerce com produtos, carrinho, pagamento, usuários, admin, relatórios, notificações, email, SMS, integração com APIs externas, cache, logging, monitoramento, deploy automatizado..."

// BOM - Foco específico com contexto relevante
"Implemente o módulo de carrinho de compras considerando:
- Integração com sistema de produtos existente
- Persistência em Redis para performance  
- Sincronização com PostgreSQL para durabilidade
- API REST seguindo padrão OpenAPI 3.0"
```

### ❌ Ambiguous Requirements
```markdown
// RUIM - Requisitos ambíguos
"Faça com que seja rápido e seguro"

// BOM - Métricas específicas
"Otimize para:
- Response time: <200ms p95
- Throughput: 1000 req/s
- Security: OWASP Top 10 compliance
- Availability: 99.9% uptime"
```

## ✅ PROMPT SUCCESS PATTERNS

### ✅ Progressive Disclosure
```markdown
## FASE 1: DESIGN
Projete a arquitetura para [funcionalidade] considerando:
- Clean Architecture layers
- Dependency injection
- Event-driven communication
- Error boundaries

## FASE 2: IMPLEMENTATION
Implemente usando o design da FASE 1:
- Domain entities com business rules
- Use cases com application logic
- Infrastructure adapters
- Tests para cada layer

## FASE 3: OPTIMIZATION
Otimize a implementação da FASE 2:
- Performance profiling
- Memory usage analysis
- Database query optimization
- Caching strategy
```

### ✅ Validation-Driven Development
```markdown
Implemente [funcionalidade] seguindo este ciclo:

1. **Define validation rules**
   - Input validation schema
   - Business rules validation
   - Output format validation

2. **Implement with validation first**
   - Validate inputs na entrada
   - Validate business rules durante processo
   - Validate outputs na saída

3. **Test validation scenarios**
   - Valid inputs → expected outputs
   - Invalid inputs → proper errors
   - Edge cases → graceful handling

**Cada step deve ser completamente validado antes do próximo**
```

## 🎯 EXEMPLO COMPLETO DE PROMPT OTIMIZADO

```markdown
# 🎯 IMPLEMENTAR SISTEMA DE PAGAMENTOS

## 📊 CONTEXTO DO PROJETO
- **Domínio**: E-commerce B2C, 10k+ pedidos/dia
- **Stack**: Node.js 18 + TypeScript 5.1 + Express 4.18
- **Database**: PostgreSQL 15 + Prisma ORM 4.15
- **Architecture**: Clean Architecture + DDD
- **Deploy**: Docker + AWS ECS + Load Balancer
- **Monitoring**: DataDog + CloudWatch

## 🔧 INTEGRAÇÃO STRIPE
- **SDK**: stripe@12.9.0
- **Webhook**: /api/v1/webhooks/stripe
- **Idempotency**: Required para todos os endpoints
- **Retry Logic**: Exponential backoff 3x
- **Error Handling**: AppError classes

## 📋 REQUISITOS FUNCIONAIS
1. **Processar pagamento com cartão**
   - Validar dados do cartão (client-side tokenization)
   - Criar charge no Stripe
   - Salvar transação no DB
   - Enviar confirmação por email

2. **Webhook handling**
   - Validar signature do Stripe
   - Processar eventos: payment_intent.succeeded/failed
   - Atualizar status do pedido
   - Trigger business events

3. **Refund management**
   - Partial/full refunds
   - Reason tracking
   - Status synchronization

## ⚡ REQUISITOS NÃO-FUNCIONAIS
- **Performance**: <300ms p95 para payment processing
- **Reliability**: 99.9% success rate
- **Security**: PCI DSS compliance
- **Observability**: Structured logs + metrics
- **Idempotency**: Prevent duplicate charges

## 🏗️ IMPLEMENTAÇÃO OBRIGATÓRIA
```typescript
// Domain entities
interface Payment {
  id: string;
  amount: Money;
  status: PaymentStatus;
  customerId: string;
}

// Use cases
class ProcessPaymentUseCase {
  async execute(command: ProcessPaymentCommand): Promise<PaymentResult>;
}

// Infrastructure
class StripePaymentGateway implements PaymentGateway {
  async charge(request: ChargeRequest): Promise<ChargeResult>;
}
```

## 🧪 CRITÉRIOS DE ACEITE
- [ ] Payment processing funciona end-to-end
- [ ] Webhook handling é resiliente a falhas
- [ ] Idempotency previne duplicate charges
- [ ] Error handling cobre todos os cenários
- [ ] Logs permitem debugging completo
- [ ] Testes unitários >= 90% coverage
- [ ] Integration tests com Stripe sandbox

## 🚫 RESTRIÇÕES CRÍTICAS
- NUNCA armazenar dados de cartão
- NUNCA processar pagamento sem validação
- NUNCA skip webhook signature validation
- NUNCA permitir double charging
- SEMPRE usar environment variables para API keys

**Implemente solução production-ready seguindo TODOS os requisitos**
```

---
**Última atualização**: 2025-08-15
**Versão**: 1.0
