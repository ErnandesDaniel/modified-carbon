package ru.scms.back.dto;

import java.time.LocalDateTime;
import ru.scms.back.enums.CertificateStatus;

public record CertificateDto(
        Long id,
        Long caseId,
        String caseCode,
        Long methUserId,
        String methUserName,
        String code,
        CertificateStatus status,
        String verificationCode,
        LocalDateTime issuedAt) {}
