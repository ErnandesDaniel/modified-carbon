package ru.scms.back.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.scms.back.annotations.CurrentUserId;
import ru.scms.back.dto.CertificateDto;
import ru.scms.back.services.CertificateService;

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
