package ru.main.back.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import ru.main.back.annotations.CurrentUserId;
import ru.main.back.dto.userDto.UserDataResponseDto;
import ru.main.back.services.AuthService;
import ru.main.back.enums.UserAuthProvider;
import ru.main.back.services.UserService;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Tag(name = "Пользователь", description = "Управление данными текущего пользователя")
public class UserController {

    private final AuthService authService;
    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Получить данные профиля пользователя", description = "Возвращает информацию о текущем авторизованном пользователе", operationId = "getCurrentUser")
    public UserDataResponseDto getMe(@CurrentUserId Long userId, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        UserAuthProvider provider = authService.extractProviderFromJwt(jwt);
        return userService.getUserData(userId, provider);
    }
}