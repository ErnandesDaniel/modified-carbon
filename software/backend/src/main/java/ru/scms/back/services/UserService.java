package ru.scms.back.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import ru.scms.back.dto.UpdateUserRequestDto;
import ru.scms.back.dto.UserDto;
import ru.scms.back.entities.User;
import ru.scms.back.entities.UserIdentity;
import ru.scms.back.enums.AppRole;
import ru.scms.back.enums.AuditAction;
import ru.scms.back.enums.UserAuthProvider;
import ru.scms.back.repositories.UserIdentityRepository;
import ru.scms.back.repositories.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserIdentityRepository userIdentityRepository;
    private final DtoMapper dtoMapper;
    private final AuditService auditService;

    @Transactional
    public User getOrCreateUser(UserAuthProvider provider, String providerUserId, String name, String email) {
        return userIdentityRepository.findByProviderNameAndProviderUserId(provider, providerUserId)
                .map(identity -> userRepository.findById(identity.getUserId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found for identity")))
                .orElseGet(() -> createUser(provider, providerUserId, name, email));
    }

    private User createUser(UserAuthProvider provider, String providerUserId, String name, String email) {
        AppRole role = provider == UserAuthProvider.LOCAL ? AppRole.SLEEVE_BROKER : AppRole.METH;
        User newUser = userRepository.save(User.builder()
                .displayName(name)
                .email(email)
                .role(role)
                .build());

        userIdentityRepository.save(UserIdentity.builder()
                .userId(newUser.getId())
                .providerName(provider)
                .providerUserId(providerUserId)
                .userName(name)
                .build());

        return newUser;
    }

    @Transactional
    public User getOrCreateDefaultStaff() {
        return getOrCreateUser(UserAuthProvider.LOCAL, "demo-staff", "Demo Staff", "staff@scms.local");
    }

    @Transactional
    public User getOrCreateDemoClient() {
        String email = "m.kovacs@gmail.com";
        return userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = userRepository.save(User.builder()
                    .displayName("M. Kovacs")
                    .email(email)
                    .role(AppRole.METH)
                    .build());
            userIdentityRepository.save(UserIdentity.builder()
                    .userId(newUser.getId())
                    .providerName(UserAuthProvider.LOCAL)
                    .providerUserId("demo-client")
                    .userName("M. Kovacs")
                    .build());
            return newUser;
        });
    }

    @Transactional
    public User updateName(User user, String name) {
        user.setDisplayName(name);
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    @Transactional(readOnly = true)
    public UserDto getUser(Long userId) {
        return dtoMapper.toUser(getUserOrThrow(userId));
    }

    @Transactional(readOnly = true)
    public List<UserDto> listUsers() {
        return userRepository.findAllByOrderByIdAsc().stream().map(dtoMapper::toUser).toList();
    }

    @Transactional
    public UserDto updateUser(Long userId, UpdateUserRequestDto request) {
        User user = getUserOrThrow(userId);
        if (request.displayName() != null && !request.displayName().isBlank()) {
            user.setDisplayName(request.displayName());
        }
        if (request.email() != null) {
            user.setEmail(request.email());
        }
        if (request.role() != null && request.role() != user.getRole()) {
            user.setRole(request.role());
            auditService.log(userId, AuditAction.ROLE_CHANGE, "USER", userId,
                    "Роль изменена на " + request.role());
        }
        return dtoMapper.toUser(userRepository.save(user));
    }
}
