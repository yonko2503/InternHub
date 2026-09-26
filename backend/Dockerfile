# Stage 1: Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build application without running tests
RUN mvn clean package -DskipTests

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create a non-root user for security
RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring:spring

# Copy built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Render sets PORT env variable (typically 10000)
# Spring Boot reads it via server.port=${PORT:8080} in application.properties
EXPOSE ${PORT:-8080}

# Pass PORT explicitly as JVM arg to guarantee correct port binding
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
