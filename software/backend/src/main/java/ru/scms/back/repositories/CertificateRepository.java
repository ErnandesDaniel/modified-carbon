package ru.scms.back.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.scms.back.entities.Certificate;

import java.util.List;
import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    List<Certificate> findByMethUserIdOrderByIssuedAtDesc(Long methUserId);

    List<Certificate> findAllByOrderByIssuedAtDesc();

    Optional<Certificate> findByCaseId(Long caseId);

    boolean existsByCaseId(Long caseId);
}
