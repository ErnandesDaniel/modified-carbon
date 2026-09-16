package ru.main.back.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.main.back.dto.auth.ServiceLoginRequestDto;
import ru.main.back.dto.userDto.UserIdResponseDto;
import ru.main.back.entities.User;
import ru.main.back.enums.UserAuthProvider;
import ru.main.back.services.AuthService;
import ru.main.back.services.UserService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Авторизация", description = "Методы для входа и регистрации пользователей")
public class AuthController {
    private final UserService userService;
    private final AuthService authService;

    @Value("${service.auth.login.secret}")
    private String serviceAuthorizationHeader;

    @PostMapping("/login")
    @Operation(summary = "Сервисный вход пользователя", description = "Проверяет секретный заголовок и на его основе регистрирует или возвращает данные пользователя", operationId = "serviceLogin")
    public ResponseEntity<UserIdResponseDto> login(@RequestBody ServiceLoginRequestDto request, HttpServletRequest httpRequest) {

        // Проверяем, что сервисный заголовок авторизации установлен
        if (serviceAuthorizationHeader == null || serviceAuthorizationHeader.isEmpty()) {
            return ResponseEntity.status(500).build(); // Internal server error if header is not configured
        }

        // Проверяем секретный заголовок
        String headerValue = httpRequest.getHeader("Service-Authorization");

        if (headerValue == null || !headerValue.equals(serviceAuthorizationHeader)) {
            return ResponseEntity.status(401).build();
        }

        UserAuthProvider userAuthProvider=authService.extractProviderFromString(request.provider());

        // Регистрируем или получаем пользователя на основе данных из тела запроса
        User user = userService.getOrCreateUser(userAuthProvider, request.providerUserId(), request.userName());

        // Возвращаем данные пользователя
        UserIdResponseDto userData = new UserIdResponseDto(user.getId());
        return ResponseEntity.ok(userData);
    }

}