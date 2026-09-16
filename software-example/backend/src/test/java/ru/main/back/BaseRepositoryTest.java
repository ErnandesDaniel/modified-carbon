package ru.main.back;

import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Базовый класс для тестов репозиториев.
 * Использует @DataJpaTest для легковесного тестирования слоя данных.
 */
@DataJpaTest
@ActiveProfiles("test")
public abstract class BaseRepositoryTest {
}
