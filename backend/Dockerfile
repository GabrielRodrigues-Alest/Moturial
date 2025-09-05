# Multi-stage build para otimizar o tamanho da imagem
FROM maven:3.9.8-eclipse-temurin-21-alpine AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências primeiro (para cache do Docker)
COPY pom.xml .
COPY src ./src

# Baixar dependências e compilar
RUN mvn clean package -DskipTests

# Stage de produção
FROM eclipse-temurin:21-jre-alpine

# Instalar curl para o Health Check
RUN apk --no-cache add curl

# Criar usuário não-root para segurança
RUN addgroup -S moturial && adduser -S -G moturial moturial

# Definir diretório de trabalho
WORKDIR /app

# Copiar JAR do stage anterior
COPY --from=build /app/target/payment-service-*.jar app.jar

# Mudar propriedade dos arquivos para o usuário não-root
RUN chown -R moturial:moturial /app

# Mudar para usuário não-root
USER moturial

# Expor porta
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/api/v1/payments/health || exit 1

# Comando para executar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
