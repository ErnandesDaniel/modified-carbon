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
import ru.scms.back.dto.CaseDto;
import ru.scms.back.dto.CompleteProcedureRequestDto;
import ru.scms.back.dto.IncidentDto;
import ru.scms.back.dto.IncidentRequestDto;
import ru.scms.back.dto.StartProcedureRequestDto;
import ru.scms.back.enums.CaseStatus;
import ru.scms.back.services.CaseService;

@RestController
@RequestMapping("/cases")
@RequiredArgsConstructor
@Tag(name = "Cases", description = "UC-03: кейсы и процедура needlecast")
public class CaseController {

    private final CaseService caseService;

    @GetMapping
    @Operation(summary = "Список кейсов")
    public List<CaseDto> list(@RequestParam(required = false) CaseStatus status) {
        return caseService.list(status);
    }

    @GetMapping("/mine")
    @Operation(summary = "Мои кейсы (для клиента)")
    public List<CaseDto> mine(@CurrentUserId Long userId) {
        return caseService.mine(userId);
    }

    @GetMapping("/validation")
    @Operation(summary = "UC-04: кейсы на валидации (Needlecaster/Psychosurgeon)")
    public List<CaseDto> validationQueue() {
        return caseService.byStatuses(List.of(CaseStatus.IN_PROGRESS, CaseStatus.COMPLETED, CaseStatus.CORRECTIVE));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Кейс по ID")
    public CaseDto get(@PathVariable Long id) {
        return caseService.get(id);
    }

    @GetMapping("/{id}/incidents")
    @Operation(summary = "Инциденты по кейсу")
    public List<IncidentDto> incidents(@PathVariable Long id) {
        return caseService.incidents(id);
    }

    @PostMapping("/{id}/start")
    @Operation(summary = "UC-03: начать перенос")
    public CaseDto start(
            @CurrentUserId Long actorId,
            @PathVariable Long id,
            @RequestBody(required = false) StartProcedureRequestDto request) {
        String needlecaster = request == null ? null : request.needlecasterName();
        return caseService.start(id, needlecaster, actorId);
    }

    @PostMapping("/{id}/complete")
    @Operation(summary = "UC-03: отметить успешное завершение переноса")
    public CaseDto complete(
            @CurrentUserId Long actorId,
            @PathVariable Long id,
            @RequestBody(required = false) CompleteProcedureRequestDto request) {
        String result = request == null ? "SUCCESS" : request.result();
        return caseService.complete(id, result, actorId);
    }

    @PostMapping("/{id}/incident")
    @Operation(summary = "UC-03 (ProcedureFailed): зафиксировать инцидент")
    public CaseDto reportIncident(
            @CurrentUserId Long actorId, @PathVariable Long id, @RequestBody IncidentRequestDto request) {
        return caseService.reportIncident(id, request, actorId);
    }
}
