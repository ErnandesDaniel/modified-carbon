package ru.scms.back.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.scms.back.annotations.CurrentUserId;
import ru.scms.back.dto.CertificateDto;
import ru.scms.back.dto.CheckpointDto;
import ru.scms.back.dto.CheckpointUpdateRequestDto;
import ru.scms.back.dto.IncidentRequestDto;
import ru.scms.back.services.ValidationService;

@RestController
@RequiredArgsConstructor
@Tag(name = "Validation", description = "UC-04: осмотр, чекпоинты, сертификация")
public class ValidationController {

    private final ValidationService validationService;

    @GetMapping("/cases/{caseId}/checkpoints")
    @Operation(summary = "Чекпоинты кейса")
    public List<CheckpointDto> checkpoints(@PathVariable Long caseId) {
        return validationService.checkpoints(caseId);
    }

    @PatchMapping("/checkpoints/{checkpointId}")
    @Operation(summary = "Обновить статус чекпоинта")
    public CheckpointDto updateCheckpoint(
            @CurrentUserId Long actorId,
            @PathVariable Long checkpointId,
            @RequestBody CheckpointUpdateRequestDto request) {
        return validationService.updateCheckpoint(checkpointId, request.status(), actorId);
    }

    @PostMapping("/cases/{caseId}/confirm")
    @Operation(summary = "UC-04: подтвердить и сгенерировать сертификат")
    public CertificateDto confirm(@CurrentUserId Long actorId, @PathVariable Long caseId) {
        return validationService.confirm(caseId, actorId);
    }

    @PostMapping("/cases/{caseId}/complications")
    @Operation(summary = "UC-04 (Complications): зафиксировать осложнение")
    public void reportComplication(
            @CurrentUserId Long actorId, @PathVariable Long caseId, @RequestBody IncidentRequestDto request) {
        validationService.reportComplication(caseId, request, actorId);
    }
}
