# 01 - Context Management (Gestão de Contexto)

## 🎯 OBJETIVO
Maximizar a compreensão de contexto da IA para obter código production-ready e eliminar alucinações.

## 📋 PRINCÍPIOS FUNDAMENTAIS

### 1. Contexto Sempre Completo
- **NUNCA** assuma que a IA sabe o contexto do projeto
- **SEMPRE** forneça informações sobre domínio, stack e arquitetura
- **JAMAIS** deixe detalhes críticos implícitos

### 2. Estrutura de Contexto Obrigatória
```markdown
## 🎯 Objetivo: [O que quero alcançar]
## 📊 Projeto: [Domínio, Stack, Fase, Usuários]
## 🔧 Técnico: [Arquitetura, DB, Infra, Padrões]
## 📋 Requisitos: [Funcionais, Não-funcionais, SLA]
## 🚫 Evitar: [O que NÃO fazer]
```

## 🗂️ TEMPLATE DE ARQUIVOS DE CONTEXTO

### Arquivo: project-overview.md
```markdown
# Visão Geral do Projeto

## Domínio
[E-commerce, FinTech, Healthcare, etc.]

## Objetivo Principal
[Descrição clara do objetivo]

## Usuários-alvo
[Perfil detalhado dos usuários]

## Fase Atual
[MVP, Scale, Maintenance]

## Stack Principal
- Frontend: [React, Vue, Angular]
- Backend: [Node.js, Python, Java]
- Database: [PostgreSQL, MongoDB]
- Cloud: [AWS, GCP, Azure]
```

### Arquivo: tech-stack.md
```markdown
# Stack Tecnológico

## Frontend
- Framework: [Específico]
- State Management: [Redux, Zustand]
- UI Library: [Material-UI, Tailwind]
- Build Tool: [Vite, Webpack]

## Backend
- Runtime: [Node.js 18+]
- Framework: [Express, Fastify]
- Database: [PostgreSQL 15+]
- ORM: [Prisma, TypeORM]
- Cache: [Redis]

## Infrastructure
- Cloud: [AWS/GCP/Azure]
- Container: [Docker]
- Orchestration: [Kubernetes]
- CI/CD: [GitHub Actions]
```

## 🎪 PADRÕES DE PROMPT INTELIGENTE

### Padrão 1: Cadeia de Pensamento
```
Implemente [funcionalidade] seguindo estes passos:
1. Primeiro, [etapa 1]
2. Depois, [etapa 2]
3. Por último, [etapa 3]
4. Explique cada decisão tomada
```

### Padrão 2: Baseado em Exemplos
```
Seguindo este padrão de [componente]:
[exemplo existente]
Crie um [componente] similar para [nova funcionalidade]
```

### Padrão 3: Baseado em Restrições
```
Crie [funcionalidade] que DEVE:
- [restrição técnica 1]
- [restrição de performance 2]
- [restrição de segurança 3]
- [restrição de qualidade 4]
```

## 🚫 ANTI-PADRÕES A EVITAR

### ❌ Contexto Vago
```
"Crie um login" // RUIM
```

### ✅ Contexto Específico
```
"Crie um sistema de autenticação JWT com:
- TypeScript strict mode
- Rate limiting (100 req/min)
- Refresh token rotation
- RBAC com roles [admin, user, guest]
- Integração com PostgreSQL
- Testes unitários com 95% cobertura"
```

### ❌ Requisitos Implícitos
```
"Adicione validação" // RUIM
```

### ✅ Requisitos Explícitos
```
"Adicione validação usando Zod que:
- Valide email com regex RFC 5322
- Senha: 8+ chars, 1 maiúscula, 1 número, 1 especial
- Retorne mensagens específicas em português
- Log tentativas de validação falha"
```

## 🔄 LOOP DE FEEDBACK ESTRUTURADO

### Template de Revisão
```typescript
interface FeedbackIA {
  funcionou: string[];          // O que deu certo
  falhou: string[];            // O que não funcionou
  melhorias: string[];         // O que precisa melhorar
  contexto_faltante: string[]; // Informações que faltaram
  proxima_acao: string;        // Próximo passo
}
```

### Exemplo Prático
```typescript
const feedback: FeedbackIA = {
  funcionou: ["Tipos TypeScript corretos", "Padrão REST seguido"],
  falhou: ["Tratamento de erro genérico", "Faltou rate limiting"],
  melhorias: ["Adicionar logs estruturados", "Implementar retry logic"],
  contexto_faltante: ["Regras de negócio específicas", "SLA de performance"],
  proxima_acao: "Refatorar com middleware de erro customizado"
};
```

## 📚 BIBLIOTECA DE CONTEXTOS

### Para APIs REST
```markdown
## Contexto para API REST

### Padrões Obrigatórios
- OpenAPI 3.0 spec completa
- Status codes HTTP corretos
- Versionamento na URL (/api/v1/)
- Rate limiting implementado
- Logs estruturados (JSON)

### Estrutura de Response
- Sempre incluir metadata
- Paginação consistente
- Error handling padronizado
```

### Para Frontend Components
```markdown
## Contexto para Componentes

### Padrões Obrigatórios
- TypeScript strict mode
- Props interface documentada
- Estados de loading/error/success
- Testes unitários obrigatórios
- Acessibilidade (a11y) completa

### Performance
- Lazy loading quando aplicável
- Memoização em re-renders desnecessários
- Bundle size monitorado
```

## 🎛️ CONTROLES DE QUALIDADE

### Checklist Pré-Prompt
- [ ] Contexto técnico completo?
- [ ] Requisitos não-funcionais especificados?
- [ ] Exemplos de código fornecidos?
- [ ] Restrições e limitações claras?
- [ ] Critérios de aceite definidos?

### Checklist Pós-Resposta
- [ ] Código roda sem modificações?
- [ ] Todos os imports incluídos?
- [ ] Error handling implementado?
- [ ] Tipos TypeScript completos?
- [ ] Logs e monitoramento incluídos?

## 🎯 EXEMPLO COMPLETO DE CONTEXTO

```markdown
# Contexto: Implementar Sistema de Pagamentos

## 🎯 Objetivo
Implementar integração com Stripe para e-commerce B2C

## 📊 Projeto
- Domínio: E-commerce moda feminina
- Stack: React + Node.js + PostgreSQL
- Fase: Scale (10k+ usuários/mês)
- SLA: 99.9% uptime, <300ms response

## 🔧 Técnico
- Backend: Node.js 18 + Express + TypeScript
- Database: PostgreSQL 15 + Prisma ORM
- Queue: Redis Bull
- Monitoramento: DataDog + Sentry

## 📋 Requisitos
- PCI DSS compliance
- Webhook handling resiliente
- Retry logic para falhas
- Idempotência em pagamentos
- Logs auditáveis

## 🚫 Evitar
- Hardcoded API keys
- Dados de cartão no backend
- Webhooks sem validação
- Transações sem rollback
```

---
**Última atualização**: 2025-08-15
**Versão**: 1.0
