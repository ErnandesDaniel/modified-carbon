package ru.scms.back.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.scms.back.annotations.CurrentUserId;
import ru.scms.back.dto.StackDto;
import ru.scms.back.repositories.StackRepository;
import ru.scms.back.services.DtoMapper;

@RestController
@RequestMapping("/stacks")
@RequiredArgsConstructor
@Tag(name = "Stacks", description = "Кортикальные стеки")
public class StackController {

    private final StackRepository stackRepository;
    private final DtoMapper dtoMapper;

    @GetMapping
    @Operation(summary = "Все стеки")
    public List<StackDto> all() {
        return stackRepository.findAll().stream().map(dtoMapper::toStack).toList();
    }

    @GetMapping("/mine")
    @Operation(summary = "Мои стеки (для клиента)")
    public List<StackDto> mine(@CurrentUserId Long userId) {
        return stackRepository.findByOwnerUserIdOrderByIdAsc(userId).stream()
                .map(dtoMapper::toStack)
                .toList();
    }
}
