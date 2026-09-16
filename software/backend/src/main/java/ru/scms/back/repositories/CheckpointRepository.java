package ru.scms.back.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.scms.back.entities.Checkpoint;
import ru.scms.back.enums.CheckpointStatus;

import java.util.List;

public interface CheckpointRepository extends JpaRepository<Checkpoint, Long> {

    List<Checkpoint> findByCaseIdOrderByIdAsc(Long caseId);

    long countByCaseId(Long caseId);

    long countByCaseIdAndStatus(Long caseId, CheckpointStatus status);
}
