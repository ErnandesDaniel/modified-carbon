package ru.scms.back.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.scms.back.entities.NeedlecastCase;
import ru.scms.back.enums.CaseStatus;

import java.util.Collection;
import java.util.List;

public interface NeedlecastCaseRepository extends JpaRepository<NeedlecastCase, Long> {

    List<NeedlecastCase> findAllByOrderByCreatedAtDesc();

    List<NeedlecastCase> findByStatusOrderByCreatedAtAsc(CaseStatus status);

    List<NeedlecastCase> findByStatusInOrderByCreatedAtAsc(Collection<CaseStatus> statuses);

    List<NeedlecastCase> findByMethUserIdOrderByCreatedAtDesc(Long methUserId);

    long countByStatus(CaseStatus status);

    long countByStatusIn(Collection<CaseStatus> statuses);

    long countBySleeveId(Long sleeveId);
}
