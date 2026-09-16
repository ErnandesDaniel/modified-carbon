package ru.main.back.dto.userDto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Тесты для UserIdResponseDto
 */
class UserIdResponseDtoTest {

    @Test
    void shouldCreateDto() {
        UserIdResponseDto dto = new UserIdResponseDto(1L);

        assertEquals(1L, dto.userId());
    }
}
