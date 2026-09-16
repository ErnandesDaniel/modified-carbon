package ru.scms.back.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.scms.back.annotations.CurrentUserId;
import ru.scms.back.dto.UpdateUserRequestDto;
import ru.scms.back.dto.UserDto;
import ru.scms.back.services.UserService;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Tag(name = "Пользователь", description = "Профиль текущего пользователя и управление ролями")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Получить профиль текущего пользователя")
    public UserDto getMe(@CurrentUserId Long userId) {
        return userService.getUser(userId);
    }

    @PatchMapping("/me")
    @Operation(summary = "Обновить профиль (в т.ч. выбрать роль сотрудника)")
    public UserDto updateMe(@CurrentUserId Long userId, @RequestBody UpdateUserRequestDto request) {
        return userService.updateUser(userId, request);
    }

    @GetMapping
    @Operation(summary = "Список пользователей")
    public List<UserDto> list() {
        return userService.listUsers();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Пользователь по ID")
    public UserDto getById(@PathVariable Long id) {
        return userService.getUser(id);
    }
}
