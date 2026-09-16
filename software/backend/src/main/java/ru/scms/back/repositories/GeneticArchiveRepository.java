package ru.scms.back.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.scms.back.entities.GeneticArchive;

public interface GeneticArchiveRepository extends JpaRepository<GeneticArchive, Long> {
}
