package ru.scms.back.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.scms.back.entities.Stack;
import ru.scms.back.enums.StackStatus;

import java.util.List;
import java.util.Optional;

public interface StackRepository extends JpaRepository<Stack, Long> {

    Optional<Stack> findByCode(String code);

    List<Stack> findByOwnerUserIdOrderByIdAsc(Long ownerUserId);

    List<Stack> findByStatusOrderByIdAsc(StackStatus status);
}
