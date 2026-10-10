# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Configure Maven to use Google Cloud mirror for Maven Central (prevents 429 rate limiting)
COPY settings.xml /root/.m2/settings.xml

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Package the application skipping tests
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the generated JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
