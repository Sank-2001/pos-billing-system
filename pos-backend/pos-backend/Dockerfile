# ---------- Build stage ----------
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom and source
COPY pom.xml .
COPY src ./src

# Build the Spring Boot JAR (tests skipped for speed)
RUN mvn clean package -DskipTests

# ---------- Run stage ----------
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Render will pass PORT env var; we already use server.port=${PORT:8080}
EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
