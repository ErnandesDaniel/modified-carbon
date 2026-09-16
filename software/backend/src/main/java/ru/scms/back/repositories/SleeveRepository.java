package ru.scms.back.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import ru.scms.back.entities.Sleeve;
import ru.scms.back.enums.SleeveStatus;

import java.util.List;
import java.util.Optional;

public interface SleeveRepository extends JpaRepository<Sleeve, Long>, JpaSpecificationExecutor<Sleeve> {

    Optional<Sleeve> findByCode(String code);

    List<Sleeve> findByStatusOrderByIdAsc(SleeveStatus status);

    List<Sleeve> findByReservedForUserId(Long userId);

    long countByStatus(SleeveStatus status);
}
