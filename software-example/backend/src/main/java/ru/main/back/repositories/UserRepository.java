package ru.main.back.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.main.back.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {}