package ru.main.back.dto.userDto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Тесты для UserDataResponseDto
 */
class UserDataResponseDtoTest {

    @Test
    void shouldCreateDto() {
        UserDataResponseDto dto = new UserDataResponseDto("Test User", 1L);

        assertEquals("Test User", dto.userName());
        assertEquals(1L, dto.userId());
    }
}
