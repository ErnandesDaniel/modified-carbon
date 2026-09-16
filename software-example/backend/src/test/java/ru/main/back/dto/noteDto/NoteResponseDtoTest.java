package ru.main.back.dto.noteDto;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Тесты для NoteResponseDto
 */
class NoteResponseDtoTest {

    @Test
    void shouldCreateDtoWithAllFields() {
        LocalDateTime now = LocalDateTime.now();
        NoteResponseDto dto = new NoteResponseDto(1L, "Title", "Description", "https://example.com", now, now);

        assertEquals(1L, dto.id());
        assertEquals("Title", dto.title());
        assertEquals("Description", dto.description());
        assertEquals("https://example.com", dto.url());
        assertEquals(now, dto.createdAt());
        assertEquals(now, dto.updatedAt());
    }
}
