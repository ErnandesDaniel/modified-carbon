package ru.scms.back.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.scms.back.annotations.CurrentUserId;
import ru.scms.back.dto.CertificateDto;
import ru.scms.back.services.CertificateService;

import java.util.List;

@RestController
@RequestMapping("/certificates")
@RequiredArgsConstructor
@Tag(name = "Certificates", description = "UC-04: сертификаты совместимости")
public class CertificateController {

    private final CertificateService certificateService;

    @GetMapping
    @Operation(summary = "Все сертификаты")
    public List<CertificateDto> all() {
        return certificateService.all();
    }

    @GetMapping("/mine")
    @Operation(summary = "Мои сертификаты (для клиента)")
    public List<CertificateDto> mine(@CurrentUserId Long userId) {
        return certificateService.byMeth(userId);
    }

    @GetMapping("/case/{caseId}")
    @Operation(summary = "Сертификат по кейсу")
    public CertificateDto byCase(@PathVariable Long caseId) {
        return certificateService.byCase(caseId);
    }
}
