package ru.scms.back.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.scms.back.annotations.CurrentUserId;
import ru.scms.back.dto.CultivationRequestDto;
import ru.scms.back.dto.GeneticArchiveDto;
import ru.scms.back.dto.SleeveDto;
import ru.scms.back.enums.SleeveGender;
import ru.scms.back.enums.SleeveStatus;
import ru.scms.back.services.SleeveService;

@RestController
@RequestMapping("/sleeves")
@RequiredArgsConstructor
@Tag(name = "Sleeves", description = "UC-01/UC-02: каталог тел, культивирование, приёмка, резервирование")
public class SleeveController {

    private final SleeveService sleeveService;

    @GetMapping
    @Operation(summary = "Поиск тел с фильтрами")
    public List<SleeveDto> search(
            @RequestParam(required = false) SleeveStatus status,
            @RequestParam(required = false) SleeveGender gender,
            @RequestParam(required = false) Integer heightMin,
            @RequestParam(required = false) Integer heightMax,
            @RequestParam(required = false) Integer weightMin,
            @RequestParam(required = false) Integer weightMax,
            @RequestParam(required = false) Integer ageMin,
            @RequestParam(required = false) Integer ageMax,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean availableOnly) {
        return sleeveService.search(
                status, gender, heightMin, heightMax, weightMin, weightMax, ageMin, ageMax, search, availableOnly);
    }

    @GetMapping("/archives")
    @Operation(summary = "Список генетических архивов")
    public List<GeneticArchiveDto> archives() {
        return sleeveService.listArchives();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Тело по ID")
    public SleeveDto get(@PathVariable Long id) {
        return sleeveService.get(id);
    }

    @PostMapping("/cultivation")
    @Operation(summary = "UC-02: заказать культивирование тела")
    public SleeveDto orderCultivation(@CurrentUserId Long actorId, @RequestBody CultivationRequestDto request) {
        return sleeveService.orderCultivation(request, actorId);
    }

    @PostMapping("/{id}/intake/accept")
    @Operation(summary = "UC-02: принять поступившее тело")
    public SleeveDto acceptIntake(@CurrentUserId Long actorId, @PathVariable Long id) {
        return sleeveService.acceptIntake(id, actorId);
    }

    @PostMapping("/{id}/intake/reject")
    @Operation(summary = "UC-02: отклонить поступившее тело")
    public SleeveDto rejectIntake(@CurrentUserId Long actorId, @PathVariable Long id) {
        return sleeveService.rejectIntake(id, actorId);
    }

    @PostMapping("/{id}/reserve")
    @Operation(summary = "UC-01/UC-02: зарезервировать тело за клиентом")
    public SleeveDto reserve(@CurrentUserId Long actorId, @PathVariable Long id, @RequestParam Long userId) {
        return sleeveService.reserve(id, userId, actorId);
    }

    @PostMapping("/{id}/release")
    @Operation(summary = "Снять резерв с тела")
    public SleeveDto release(@CurrentUserId Long actorId, @PathVariable Long id) {
        return sleeveService.release(id, actorId);
    }
}
