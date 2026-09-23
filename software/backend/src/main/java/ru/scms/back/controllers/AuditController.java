package ru.scms.back.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.scms.back.dto.AuditLogDto;
import ru.scms.back.services.AuditService;

@RestController
@RequestMapping("/audit")
@RequiredArgsConstructor
@Tag(name = "Audit", description = "FR-012/FR-022: неизменяемый журнал операций")
public class AuditController {

    private final AuditService auditService;

    @GetMapping
    @Operation(summary = "Журнал аудита")
    public List<AuditLogDto> list() {
        return auditService.recent();
    }
}
