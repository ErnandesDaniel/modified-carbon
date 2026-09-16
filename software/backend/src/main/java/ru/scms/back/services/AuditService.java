package ru.scms.back.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.scms.back.dto.AuditLogDto;
import ru.scms.back.entities.AuditLog;
import ru.scms.back.entities.User;
import ru.scms.back.enums.AuditAction;
import ru.scms.back.repositories.AuditLogRepository;
import ru.scms.back.repositories.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Transactional
    public void log(Long userId, AuditAction action, String entityType, Long entityId, String details) {
        auditLogRepository.save(AuditLog.builder()
                .userId(userId)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .details(details)
                .build());
    }

    @Transactional(readOnly = true)
    public List<AuditLogDto> recent() {
        return auditLogRepository.findTop100ByOrderByCreatedAtDesc().stream()
                .map(this::toDto)
                .toList();
    }

    private AuditLogDto toDto(AuditLog a) {
        String userName = a.getUserId() == null ? null
                : userRepository.findById(a.getUserId()).map(User::getDisplayName).orElse(null);
        return new AuditLogDto(a.getId(), a.getUserId(), userName, a.getAction(),
                a.getEntityType(), a.getEntityId(), a.getDetails(), a.getCreatedAt());
    }
}
