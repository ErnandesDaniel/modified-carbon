package ru.main.back;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;
import org.testcontainers.utility.MountableFile;

/**
 * Конфигурация Testcontainers для тестов.
 * Использует PostgreSQL с pgvector для семантического поиска.
 *
 * Примечание: Пользователь и база данных создаются через Liquibase миграцию.
 * Здесь только запускаем контейнер и копируем init скрипт для установки pgvector.
 */
@TestConfiguration
public class TestcontainersConfig {

    private static final DockerImageName PGVECTOR_IMAGE = DockerImageName
            .parse("pgvector/pgvector:pg17")
            .asCompatibleSubstituteFor("postgres");

    @Bean
    @ServiceConnection
    public PostgreSQLContainer<?> postgresContainer() {
        return new PostgreSQLContainer<>(PGVECTOR_IMAGE)
                .withCopyFileToContainer(
                    MountableFile.forClasspathResource("init-test-db.sql"),
                    "/docker-entrypoint-initdb.d/init-test-db.sql"
                );
    }
}
