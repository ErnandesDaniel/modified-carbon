package ru.scms.back.configs;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI scmsOpenApi() {
        return new OpenAPI().info(new Info()
                .title("SCMS — Sleeving Clinic Management System API")
                .version("1.0")
                .description("Backend API для внешнего портала Meth и внутреннего портала персонала клиники"));
    }
}
