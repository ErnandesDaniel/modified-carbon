package ru.scms.back.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import ru.scms.back.dto.CertificateDto;
import ru.scms.back.entities.Certificate;
import ru.scms.back.entities.NeedlecastCase;
import ru.scms.back.enums.AuditAction;
import ru.scms.back.enums.CertificateStatus;
import ru.scms.back.repositories.CertificateRepository;
import ru.scms.back.repositories.NeedlecastCaseRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final NeedlecastCaseRepository caseRepository;
    private final DtoMapper dtoMapper;
    private final AuditService auditService;

    @Transactional
    public CertificateDto generate(Long caseId, Long actorId) {
        return certificateRepository.findByCaseId(caseId)
                .map(dtoMapper::toCertificate)
                .orElseGet(() -> {
                    NeedlecastCase c = caseRepository.findById(caseId)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Case not found"));
                    String verification = "QR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                    Certificate certificate = certificateRepository.save(Certificate.builder()
                            .caseId(caseId)
                            .methUserId(c.getMethUserId())
                            .code("CERT-" + c.getCode())
                            .status(CertificateStatus.READY)
                            .verificationCode(verification)
                            .build());
                    auditService.log(actorId, AuditAction.CERTIFY, "CASE", caseId,
                            "Сгенерирован сертификат " + certificate.getCode());
                    return dtoMapper.toCertificate(certificate);
                });
    }

    @Transactional(readOnly = true)
    public CertificateDto byCase(Long caseId) {
        return certificateRepository.findByCaseId(caseId)
                .map(dtoMapper::toCertificate)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Certificate not found"));
    }

    @Transactional(readOnly = true)
    public List<CertificateDto> byMeth(Long methUserId) {
        return certificateRepository.findByMethUserIdOrderByIssuedAtDesc(methUserId).stream()
                .map(dtoMapper::toCertificate).toList();
    }

    @Transactional(readOnly = true)
    public List<CertificateDto> all() {
        return certificateRepository.findAllByOrderByIssuedAtDesc().stream()
                .map(dtoMapper::toCertificate).toList();
    }
}
