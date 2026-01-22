FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copy maven wrapper and pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Give execution rights to the wrapper
RUN chmod +x mvnw

# Resolve dependencies (layer caching)
RUN ./mvnw dependency:resolve

# Copy source code
COPY src ./src

# Build the application
RUN ./mvnw package -DskipTests

# Expose port
EXPOSE 8081

# Run the jar file
CMD ["java", "-jar", "target/buildex-0.0.1-SNAPSHOT.jar"]
