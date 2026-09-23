package ru.scms.back.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.scms.back.dto.DevLoginRequestDto;
import ru.scms.back.entities.User;
import ru.scms.back.enums.AuditAction;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final AuditService auditService;

    @Transactional
    public User devLogin(DevLoginRequestDto request) {
        User user = userService.getOrCreateDefaultStaff();
        if (request != null && request.name() != null && !request.name().isBlank()) {
            user = userService.updateName(user, request.name());
        }
        auditService.log(user.getId(), AuditAction.LOGIN, "USER", user.getId(), "Вход во внутренний портал");
        return user;
    }

    @Transactional
    public User clientDevLogin() {
        User user = userService.getOrCreateDemoClient();
        auditService.log(user.getId(), AuditAction.LOGIN, "USER", user.getId(), "Демо-вход клиента");
        return user;
    }
}
