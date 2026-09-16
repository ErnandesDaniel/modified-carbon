# Этап 1: Сборка с Maven и OpenJDK 21
FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /app

# Копируем pom.xml
COPY pom.xml .

# Копируем исходники
COPY src ./src

# Собираем JAR
RUN mvn clean package -DskipTests

# Этап 2: Запуск на JRE (маленький образ)
FROM eclipse-temurin:21-alpine

WORKDIR /app

# Копируем JAR из первого этапа
COPY --from=build /app/target/*.jar app.jar

# Открываем порт для внешних приложений
EXPOSE 3001

# Запускаем приложение
ENTRYPOINT ["java", "-jar", "app.jar"]