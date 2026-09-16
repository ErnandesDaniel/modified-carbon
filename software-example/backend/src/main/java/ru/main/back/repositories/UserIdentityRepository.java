package ru.main.back.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.main.back.entities.UserIdentity;
import ru.main.back.enums.UserAuthProvider;
import java.util.Optional;

@Repository
public interface UserIdentityRepository extends JpaRepository<UserIdentity, Long> {
    Optional<UserIdentity> findByProviderNameAndProviderUserId(UserAuthProvider providerName, String providerUserId);
    Optional<UserIdentity> findByUserId(Long userId);
    // Поиск по ID связанного пользователя (user.id) и провайдеру
    Optional<UserIdentity> findByUserIdAndProviderName(Long userId, UserAuthProvider providerName);
}