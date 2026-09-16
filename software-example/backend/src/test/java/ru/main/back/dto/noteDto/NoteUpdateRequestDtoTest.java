package ru.main.back.dto.noteDto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Тесты для NoteUpdateRequestDto
 */
class NoteUpdateRequestDtoTest {

    @Test
    void shouldCreateDtoWithAllFields() {
        NoteUpdateRequestDto dto = new NoteUpdateRequestDto("Title", "Description", "https://example.com");

        assertEquals("Title", dto.title());
        assertEquals("Description", dto.description());
        assertEquals("https://example.com", dto.url());
    }

    @Test
    void shouldCreateDtoWithNullFields() {
        NoteUpdateRequestDto dto = new NoteUpdateRequestDto(null, null, null);

        assertNull(dto.title());
        assertNull(dto.description());
        assertNull(dto.url());
    }

    @Test
    void shouldCreateDtoWithPartialFields() {
        NoteUpdateRequestDto dto = new NoteUpdateRequestDto("Title", null, null);

        assertEquals("Title", dto.title());
        assertNull(dto.description());
        assertNull(dto.url());
    }
}
