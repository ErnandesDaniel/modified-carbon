package ru.scms.back.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.scms.back.dto.AuthResponseDto;
import ru.scms.back.dto.DevLoginRequestDto;
import ru.scms.back.dto.ServiceLoginRequestDto;
import ru.scms.back.services.AuthService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Авторизация", description = "Вход клиентов (Google) и персонала (dev)")
public class AuthController {

    private final AuthService authService;

    @Value("${service.auth.login.secret}")
    private String serviceAuthorizationHeader;

    @PostMapping("/login")
    @Operation(summary = "Сервисный вход (используется client-portal / NextAuth)")
    public ResponseEntity<Long> login(@RequestBody ServiceLoginRequestDto request, HttpServletRequest httpRequest) {
        String headerValue = httpRequest.getHeader("Service-Authorization");
        if (headerValue == null || !headerValue.equals(serviceAuthorizationHeader)) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(authService.serviceLogin(request));
    }

    @PostMapping("/dev-login")
    @Operation(summary = "Вход во внутренний портал под дефолтным сотрудником")
    public AuthResponseDto devLogin(@RequestBody(required = false) DevLoginRequestDto request) {
        return authService.devLogin(request);
    }

    @PostMapping("/client-dev-login")
    @Operation(summary = "Демо-вход клиента (внешний портал без Google OAuth)")
    public AuthResponseDto clientDevLogin() {
        return authService.clientDevLogin();
    }
}
