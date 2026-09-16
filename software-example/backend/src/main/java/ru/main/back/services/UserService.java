package ru.main.back.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import ru.main.back.dto.userDto.UserDataResponseDto;
import ru.main.back.entities.User;
import ru.main.back.entities.UserIdentity;
import ru.main.back.enums.UserAuthProvider;
import ru.main.back.repositories.UserIdentityRepository;
import ru.main.back.repositories.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserIdentityRepository userIdentityRepository;

    @Transactional
    public User getOrCreateUser(UserAuthProvider provider, String providerUserId, String name) {
        return userIdentityRepository.findByProviderNameAndProviderUserId(provider, providerUserId)
                .map(UserIdentity::getUser)
                .orElseGet(() -> {
                    // Создаем пустую сущность User (только ID и дата создания)
                    User newUser = new User();
                    User savedUser = userRepository.save(newUser);

                    // Вся информация хранится здесь
                    UserIdentity identity = UserIdentity.builder()
                            .user(savedUser)
                            .providerName(provider)
                            .providerUserId(providerUserId)
                            .userName(name)
                            .build();
                    userIdentityRepository.save(identity);
                    return savedUser;
                });
    }

    @Transactional(readOnly = true)
    public Long findUserIdByExternalId(UserAuthProvider provider, String providerUserId) {
        return userIdentityRepository.findByProviderNameAndProviderUserId(provider, providerUserId)
                .map(identity -> identity.getUser().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User identity not found"));
    }

    @Transactional(readOnly = true)
    public UserDataResponseDto getUserData(Long userId, UserAuthProvider provider) {
        // 1. Проверяем существование пользователя (необязательно, но полезно для точной ошибки)
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        // 2. Ищем идентичность пользователя для конкретного провайдера
        UserIdentity identity = userIdentityRepository.findByUserIdAndProviderName(userId, provider)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Identity not found for provider: " + provider
                ));

        // 3. Возвращаем ID пользователя и имя из этой конкретной идентичности
        return new UserDataResponseDto(identity.getUserName(), userId);
    }
}