package ru.scms.back.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.scms.back.entities.AuditLog;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findAllByOrderByCreatedAtDesc();

    List<AuditLog> findTop100ByOrderByCreatedAtDesc();
}
