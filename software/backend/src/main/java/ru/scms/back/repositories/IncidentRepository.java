package ru.scms.back.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.scms.back.entities.Incident;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {

    List<Incident> findByCaseIdOrderByCreatedAtDesc(Long caseId);

    List<Incident> findByResolvedFalseOrderByCreatedAtDesc();

    long countByResolvedFalse();
}
