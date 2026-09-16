package ru.scms.back.dto;

import ru.scms.back.enums.CertificateStatus;

import java.time.LocalDateTime;

public record CertificateDto(
        Long id,
        Long caseId,
        String caseCode,
        Long methUserId,
        String methUserName,
        String code,
        CertificateStatus status,
        String verificationCode,
        LocalDateTime issuedAt
) {
}
