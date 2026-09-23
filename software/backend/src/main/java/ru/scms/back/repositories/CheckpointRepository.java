package ru.scms.back.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.scms.back.entities.Checkpoint;
import ru.scms.back.enums.CheckpointStatus;

public interface CheckpointRepository extends JpaRepository<Checkpoint, Long> {

    List<Checkpoint> findByCaseIdOrderByIdAsc(Long caseId);

    long countByCaseId(Long caseId);

    long countByCaseIdAndStatus(Long caseId, CheckpointStatus status);
}
