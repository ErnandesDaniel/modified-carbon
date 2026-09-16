package ru.scms.back.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import ru.scms.back.dto.AuthResponseDto;
import ru.scms.back.dto.DevLoginRequestDto;
import ru.scms.back.dto.ServiceLoginRequestDto;
import ru.scms.back.entities.User;
import ru.scms.back.enums.AuditAction;
import ru.scms.back.enums.UserAuthProvider;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final TokenService tokenService;
    private final AuditService auditService;

    public UserAuthProvider extractProviderFromJwt(Jwt jwt) {
        String issuer = jwt.getClaimAsString("iss");
        if (issuer == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing 'iss' claim in JWT");
        }
        return extractProviderFromString(issuer);
    }

    public UserAuthProvider extractProviderFromString(String provider) {
        if (provider == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Provider is missing");
        }
        if (provider.contains("accounts.google.com")) {
            return UserAuthProvider.GOOGLE;
        }
        if (provider.contains("github.com")) {
            return UserAuthProvider.GITHUB;
        }
        if (provider.equalsIgnoreCase("local") || provider.contains("scms")) {
            return UserAuthProvider.LOCAL;
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported auth provider: " + provider);
    }

    @Transactional
    public AuthResponseDto devLogin(DevLoginRequestDto request) {
        User user = userService.getOrCreateDefaultStaff();
        if (request != null && request.name() != null && !request.name().isBlank()) {
            user = userService.updateName(user, request.name());
        }
        String token = tokenService.generate(user.getId(), "scms-internal");
        auditService.log(user.getId(), AuditAction.LOGIN, "USER", user.getId(), "Вход во внутренний портал (dev)");
        return new AuthResponseDto(token, user.getId(), user.getDisplayName(), user.getEmail(), user.getRole());
    }

    @Transactional
    public AuthResponseDto clientDevLogin() {
        User user = userService.getOrCreateDemoClient();
        String token = tokenService.generate(user.getId(), "scms-client");
        auditService.log(user.getId(), AuditAction.LOGIN, "USER", user.getId(), "Демо-вход клиента");
        return new AuthResponseDto(token, user.getId(), user.getDisplayName(), user.getEmail(), user.getRole());
    }

    @Transactional
    public Long serviceLogin(ServiceLoginRequestDto request) {
        UserAuthProvider provider = extractProviderFromString(request.provider());
        User user = userService.getOrCreateUser(provider, request.providerUserId(), request.userName(), null);
        auditService.log(user.getId(), AuditAction.LOGIN, "USER", user.getId(), "Сервисный вход через " + provider);
        return user.getId();
    }
}
