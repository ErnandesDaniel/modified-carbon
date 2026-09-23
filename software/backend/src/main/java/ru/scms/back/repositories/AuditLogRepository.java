package ru.scms.back.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.scms.back.entities.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findAllByOrderByCreatedAtDesc();

    List<AuditLog> findTop100ByOrderByCreatedAtDesc();
}
