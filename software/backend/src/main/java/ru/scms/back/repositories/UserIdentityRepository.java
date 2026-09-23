package ru.scms.back.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.scms.back.entities.UserIdentity;
import ru.scms.back.enums.UserAuthProvider;

public interface UserIdentityRepository extends JpaRepository<UserIdentity, Long> {

    Optional<UserIdentity> findByProviderNameAndProviderUserId(UserAuthProvider providerName, String providerUserId);

    Optional<UserIdentity> findByUserIdAndProviderName(Long userId, UserAuthProvider providerName);

    List<UserIdentity> findByUserId(Long userId);
}
