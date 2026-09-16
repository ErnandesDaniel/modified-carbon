package ru.main.back;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import ru.main.back.repositories.UserIdentityRepository;
import ru.main.back.repositories.UserRepository;
import ru.main.back.services.EmbeddingService;

/**
 * Базовый класс для интеграционных тестов сервисов.
 * Использует TestcontainersConfig для PostgreSQL и TestAiConfig для мока EmbeddingModel.
 * PostgreSQL контейнер создается один раз в TestcontainersConfig и переиспользуется.
 */
@Slf4j
@SpringBootTest
@Import({TestcontainersConfig.class, TestAiConfig.class})
@ActiveProfiles("test")
@Transactional
public abstract class BaseServiceTest {

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected UserIdentityRepository userIdentityRepository;

    @Autowired
    protected EmbeddingService embeddingService;
}
