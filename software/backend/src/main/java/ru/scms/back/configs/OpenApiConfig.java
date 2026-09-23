package ru.scms.back.configs;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.media.DateTimeSchema;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Map;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springdoc.core.utils.SpringDocUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")
public class OpenApiConfig {

    // Отключаем отображение параметра в swagger для кастомной аннотации в контроллерах
    static {
        // 1. Игнорируем кастомную аннотацию для параметров контроллера
        SpringDocUtils.getConfig().addAnnotationsToIgnore(ru.scms.back.annotations.CurrentUserId.class);

        // 2. Глобально заменяем типы дат на схему с форматом "date-time"
        // Это заставит Swagger генерировать format: date-time для всех LocalDateTime полей
        SpringDocUtils.getConfig().replaceWithSchema(LocalDateTime.class, new DateTimeSchema());
        SpringDocUtils.getConfig().replaceWithSchema(OffsetDateTime.class, new DateTimeSchema());
        SpringDocUtils.getConfig().replaceWithSchema(Instant.class, new DateTimeSchema());
    }

    // Добавляем в Swagger UI возможность ввести токен доступа (bearerAuth)
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI().addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
    // Делаем все поля, найденные в схеме, обязательными для Swagger
    @Bean
    public OpenApiCustomizer schemaCustomizer() {
        return openApi -> {
            if (openApi.getComponents() == null || openApi.getComponents().getSchemas() == null) {
                return;
            }

            Map<String, Schema> schemas = openApi.getComponents().getSchemas();
            schemas.forEach((name, schema) -> {
                if (schema.getProperties() != null && !schema.getProperties().isEmpty()) {
                    // Делаем все поля обязательными для генерации чистых TypeScript интерфейсов
                    schema.setRequired(new ArrayList<>(schema.getProperties().keySet()));
                }
            });
        };
    }
}
