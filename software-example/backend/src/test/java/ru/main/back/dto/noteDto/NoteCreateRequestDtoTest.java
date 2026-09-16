package ru.main.back.dto.noteDto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Тесты для NoteCreateRequestDto
 */
class NoteCreateRequestDtoTest {

    @Test
    void shouldCreateDtoWithAllFields() {
        NoteCreateRequestDto dto = new NoteCreateRequestDto("Title", "Description", "https://example.com");

        assertEquals("Title", dto.title());
        assertEquals("Description", dto.description());
        assertEquals("https://example.com", dto.url());
    }

    @Test
    void shouldCreateDtoWithNullDescription() {
        NoteCreateRequestDto dto = new NoteCreateRequestDto("Title", null, null);

        assertEquals("Title", dto.title());
        assertNull(dto.description());
        assertNull(dto.url());
    }

    @Test
    void shouldCreateDtoWithEmptyDescription() {
        NoteCreateRequestDto dto = new NoteCreateRequestDto("Title", "", null);

        assertEquals("Title", dto.title());
        assertEquals("", dto.description());
    }
}
