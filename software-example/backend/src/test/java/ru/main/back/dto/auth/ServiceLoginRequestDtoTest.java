package ru.main.back.dto.auth;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Тесты для ServiceLoginRequestDto
 */
class ServiceLoginRequestDtoTest {

    @Test
    void shouldCreateDtoWithAllFields() {
        ServiceLoginRequestDto dto = new ServiceLoginRequestDto("user123", "Test User", "GOOGLE");

        assertEquals("user123", dto.providerUserId());
        assertEquals("Test User", dto.userName());
        assertEquals("GOOGLE", dto.provider());
    }
}
