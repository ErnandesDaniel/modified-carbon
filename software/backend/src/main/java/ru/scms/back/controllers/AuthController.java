package ru.scms.back.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.scms.back.annotations.CurrentUserId;
import ru.scms.back.dto.DevLoginRequestDto;
import ru.scms.back.dto.UserDto;
import ru.scms.back.entities.User;
import ru.scms.back.services.AuthService;
import ru.scms.back.services.JwtService;
import ru.scms.back.services.UserService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Авторизация", description = "Вход клиентов (Google OAuth2) и персонала, работа с cookie")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final JwtService jwtService;

    @GetMapping("/me")
    @Operation(operationId = "authMe", summary = "Текущий пользователь")
    public UserDto me(@CurrentUserId Long userId) {
        return userService.getUser(userId);
    }

    @PostMapping("/dev-login")
    @Operation(operationId = "authDevLogin", summary = "Вход во внутренний портал под дефолтным сотрудником")
    public UserDto devLogin(@RequestBody(required = false) DevLoginRequestDto request, HttpServletResponse response) {
        User user = authService.devLogin(request);
        jwtService.addTokenToCookie(
                response, jwtService.generateAccessToken(user.getId(), "local", user.getDisplayName()));
        return userService.getUser(user.getId());
    }

    @PostMapping("/client-dev-login")
    @Operation(operationId = "authClientDevLogin", summary = "Демо-вход клиента без Google OAuth")
    public UserDto clientDevLogin(HttpServletResponse response) {
        User user = authService.clientDevLogin();
        jwtService.addTokenToCookie(
                response, jwtService.generateAccessToken(user.getId(), "local", user.getDisplayName()));
        return userService.getUser(user.getId());
    }

    @PostMapping("/refresh")
    @Operation(operationId = "authRefresh", summary = "Обновить access-токен по refresh-cookie")
    public ResponseEntity<Void> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = jwtService.getRefreshTokenFromRequest(request);
        if (refreshToken == null
                || !jwtService.validateToken(refreshToken)
                || !jwtService.isRefreshToken(refreshToken)) {
            return ResponseEntity.status(401).build();
        }
        Long userId = jwtService.getUserIdFromToken(refreshToken);
        jwtService.addTokenToCookie(response, jwtService.generateAccessToken(userId, "refresh", "user"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    @Operation(operationId = "authLogout", summary = "Выход: очистка cookie")
    public void logout(HttpServletResponse response) {
        jwtService.removeTokensFromCookies(response);
    }
}
