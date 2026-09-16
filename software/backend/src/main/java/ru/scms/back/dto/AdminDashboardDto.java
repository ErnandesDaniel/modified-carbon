package ru.scms.back.dto;

import java.util.List;

public record AdminDashboardDto(
        long totalSleeves,
        long availableSleeves,
        long cultivatingSleeves,
        long intakeSleeves,
        long reservedSleeves,
        long inUseSleeves,
        long pendingCases,
        long inProgressCases,
        long completedCases,
        long incidentCases,
        long pendingValidation,
        long openIncidents,
        long newOrders,
        List<AuditLogDto> recentAudit
) {
}
