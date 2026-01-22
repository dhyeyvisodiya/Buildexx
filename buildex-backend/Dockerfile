# Use Maven image to build the application
FROM maven:3.8-eclipse-temurin-17 AS build
WORKDIR /app

# Copy project files
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/buildex-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
CMD ["java", "-jar", "app.jar"]

# Expose port
EXPOSE 8081

# Run the jar file
CMD ["java", "-jar", "target/buildex-0.0.1-SNAPSHOT.jar"]
