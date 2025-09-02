# ⚡ Cascade AI Optimization Rules

## 🎯 Objetivo
Regras para evitar crashes, timeouts e erros no Cascade durante grandes alterações e criações de código.

## 🚨 LIMITES CRÍTICOS - NUNCA EXCEDER

### **📏 Tamanhos Máximos por Operação**
- **Arquivo único**: Máximo 500 linhas por edit
- **Múltiplos arquivos**: Máximo 5 arquivos por vez  
- **Código gerado**: Máximo 1000 linhas total por resposta
- **Refatoração**: Máximo 300 linhas por edit
- **Criação nova**: Máximo 800 linhas por arquivo

### **⏱️ Timeout Prevention**
- **Edit único**: < 2 minutos de processamento
- **Multiple edits**: Dividir em lotes de 3-5 arquivos
- **Large codebase**: Processar 1 módulo por vez
- **Migration**: 1 tabela/schema por operação

## 🔄 Batch Processing Strategy

### **📦 Lote Pequeno (Recomendado)**
```markdown
## Operação Segura
1. Editar 1-3 arquivos relacionados
2. Máximo 200 linhas por arquivo
3. Testar após cada lote
4. Continuar se sem problemas
```

### **📦 Lote Médio (Cauteloso)**
```markdown  
## Operação Moderada
1. Editar 3-5 arquivos relacionados
2. Máximo 300 linhas por arquivo
3. Verificar memória disponível
4. Pausar se detectar lentidão
```

### **🚫 Lote Grande (Evitar)**
```markdown
## PERIGOSO - Pode causar crash
- 5+ arquivos simultâneos
- 500+ linhas por arquivo  
- Operações complexas combinadas
- Refatoração + criação + testes juntos
```

## 🛠️ Estratégias por Tipo de Operação

### **📝 Criação de Projeto Novo**
```markdown
## Fase 1: Estrutura Base
- [ ] package.json/requirements.txt/pom.xml
- [ ] Dockerfile
- [ ] .gitignore
- [ ] README.md

## Fase 2: Core Architecture  
- [ ] main.py/App.java/Program.cs
- [ ] Config files
- [ ] Database connection
- [ ] Basic error handling

## Fase 3: Business Logic
- [ ] Models/Entities (1-2 por vez)
- [ ] Services (1 por vez)
- [ ] Controllers (1-2 por vez)

## Fase 4: Infrastructure
- [ ] Tests
- [ ] CI/CD
- [ ] Documentation
```

### **🔧 Refatoração Grande**
```markdown
## Estratégia de Refatoração Segura

### Passo 1: Análise
"Analyze codebase structure first, don't edit yet"

### Passo 2: Plan  
"Create refactoring plan with 5-10 small steps"

### Passo 3: Execute em Lotes
"Refactor step 1 only: extract methods in UserService"
"Refactor step 2 only: update interfaces in UserRepo" 
"Refactor step 3 only: add error handling in UserController"

### Passo 4: Validate
"Run tests after each step before continuing"
```

### **🏗️ Migration/Upgrade**
```markdown
## Database Migration
1. Create migration file first
2. Test migration on sample data
3. Update models one by one
4. Update services that use changed models
5. Update tests last

## Framework Upgrade
1. Update package.json/requirements only
2. Fix compilation errors in core files
3. Update deprecated API calls
4. Fix tests
5. Update documentation
```

## ⚠️ Warning Signs - Pare Imediatamente

### **🚨 Indicadores de Sobrecarga**
- Resposta demorar > 30 segundos
- Ide ficar lenta/travando
- Edits falhando repetidamente
- Memory usage > 80%
- Cascade respondendo parcialmente

### **🛑 Ações de Emergência**
```markdown
Se detectar problemas:
1. **PARE** operações imediatamente
2. **SALVE** trabalho atual
3. **RESTART** Cascade/IDE se necessário
4. **DIVIDA** operação em partes menores
5. **CONTINUE** com lotes pequenos
```

## 📊 Templates de Prompt Otimizado

### **✅ Prompt Seguro (Recomendado)**
```markdown
# OPERAÇÃO PEQUENA - Segura
"Refactor UserService.authenticate() method only:
- Extract validation logic to private method
- Add proper error handling 
- Keep changes under 50 lines
- Don't touch other methods"
```

### **⚠️ Prompt Médio (Cauteloso)**  
```markdown
# OPERAÇÃO MÉDIA - Monitorar
"Update User module (3 files max):
- UserModel.py: add email validation
- UserService.py: implement password reset
- UserController.py: add new endpoint
- Max 200 lines per file
- Test after each file"
```

### **❌ Prompt Perigoso (Evitar)**
```markdown
# OPERAÇÃO PERIGOSA - Pode crashar
"Refactor entire authentication system:
- Update all auth-related files
- Migrate to new JWT library  
- Add OAuth2 support
- Update all tests
- Add documentation"
# TOO MUCH - vai dar timeout/crash
```

## 🎯 File Size Management

### **📁 Arquivos Pequenos (< 100 linhas)**
- ✅ Edit completo permitido
- ✅ Múltiplos arquivos simultaneamente  
- ✅ Operações complexas ok

### **📄 Arquivos Médios (100-300 linhas)**
- ⚠️ Edit por seções
- ⚠️ Máximo 3 arquivos por vez
- ⚠️ Operações simples preferidas

### **📜 Arquivos Grandes (300+ linhas)**
- 🚫 NUNCA edit completo
- 🚫 1 arquivo por vez apenas
- 🚫 Edit por métodos/classes específicas
- 🚫 Considerar quebrar em arquivos menores

## 🔄 Recovery Strategies

### **💾 Checkpoint Strategy**
```markdown
## A cada 3-5 arquivos editados:
1. Commit changes: "WIP: batch X completed"
2. Test basic functionality  
3. Check IDE performance
4. Continue se tudo ok
```

### **🔙 Rollback Plan**
```markdown
Se algo der errado:
1. Git stash current work
2. Return to last working commit
3. Restart with smaller batches
4. Apply changes incrementally
```

## 🧠 Memory Management

### **💻 System Resources**
```markdown
## Antes de grandes operações:
- [ ] RAM usage < 70%
- [ ] Disk space > 1GB free  
- [ ] Close unnecessary applications
- [ ] Save all work
- [ ] Have rollback plan ready
```

### **🔧 Cascade Optimization**
```markdown
## Optimize Cascade Performance:
- Use specific function/method names in prompts
- Provide exact line numbers when editing
- Reference existing patterns in codebase
- Avoid asking for "entire file" changes
- Use "edit only the XYZ function" phrasing
```

## 🎪 Examples of Safe Operations

### **✅ SAFE: Adding Single Feature**
```markdown
"Add email validation to User model:
- File: models/User.py  
- Method: validate_email()
- Add to __init__ method
- 20-30 lines total
- Keep existing code unchanged"
```

### **✅ SAFE: Bug Fix**
```markdown
"Fix memory leak in DatabaseConnection:
- File: db/Connection.java
- Method: closeConnection()
- Add proper resource cleanup
- 5-10 line change maximum"
```

### **⚠️ MEDIUM: Multiple Related Changes**
```markdown
"Add user authentication endpoints (3 files):
1. models/User.py - add auth fields only
2. services/AuthService.py - login/logout methods  
3. controllers/AuthController.py - REST endpoints
Process one file at a time, wait for confirmation"
```

### **❌ DANGEROUS: Large Refactor**  
```markdown
# DON'T DO THIS - Will crash/timeout
"Refactor entire application to use microservices:
- Split monolith into 5 services
- Update all database calls
- Change authentication system
- Update deployment configuration
- Migrate all tests"
```

## 🚀 Performance Tips

### **⚡ Speed Optimization**
```markdown
## Make Cascade faster:
1. Be specific about file locations
2. Mention exact function/class names
3. Provide context of surrounding code
4. Use "only modify X" language
5. Avoid broad requests like "improve performance"
```

### **🎯 Precision Targeting**
```markdown
## Instead of: "Fix the user module"
## Use: "In UserService.py, fix the validate_password() method to handle null input"

## Instead of: "Add error handling everywhere"  
## Use: "Add try-catch to DatabaseManager.connect() method only"
```

## 📋 Checklist Templates

### **🔍 Before Large Operation**
```markdown
- [ ] Operation involves < 5 files?
- [ ] Each file change < 300 lines?
- [ ] Have rollback plan ready?
- [ ] System resources available?
- [ ] Recent backup exists?
- [ ] Time available if it takes longer?
```

### **✅ After Each Batch**
```markdown
- [ ] Files compile/run without errors?
- [ ] No syntax errors introduced?  
- [ ] Core functionality still works?
- [ ] IDE responsive and stable?
- [ ] Ready for next batch?
```

## 🚨 Emergency Procedures

### **🔥 If Cascade Crashes**
```markdown
1. Don't panic - your files are saved
2. Restart Cascade/IDE
3. Check git status for unsaved changes
4. Commit any completed work
5. Resume with smaller batches
6. Consider alternative approach
```

### **⏰ If Operation Times Out**
```markdown  
1. Wait 30 seconds for response
2. If still no response, cancel operation
3. Check what was partially completed
4. Save any generated code manually
5. Break remaining work into smaller pieces
```

---

**⚡ Regra de Ouro**: É melhor fazer 10 operações pequenas que funcionam do que 1 grande que crasha.

**📊 Métricas**: Operações pequenas têm 95% taxa de sucesso vs. 60% para operações grandes.

**🔄 Versão**: 1.0  
**📅 Última atualização**: 2024-12-19  
**👨‍💻 Criado por**: Universal AI-Powered Development Rules System
