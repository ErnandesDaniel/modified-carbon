package ru.main.back.dto.noteDto;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Тесты для NotesPageResponseDto
 */
class NotesPageResponseDtoTest {

    @Test
    void shouldCreateDtoWithAllFields() {
        LocalDateTime now = LocalDateTime.now();
        NoteResponseDto note = new NoteResponseDto(1L, "Title", "Description", null, now, now);
        List<NoteResponseDto> content = List.of(note);

        NotesPageResponseDto dto = new NotesPageResponseDto(content, 0, 10, 1, 1, true);

        assertEquals(content, dto.content());
        assertEquals(0, dto.page());
        assertEquals(10, dto.size());
        assertEquals(1, dto.totalElements());
        assertEquals(1, dto.totalPages());
        assertTrue(dto.isLast());
    }

    @Test
    void shouldCreateEmptyPage() {
        NotesPageResponseDto dto = new NotesPageResponseDto(List.of(), 0, 10, 0, 0, true);

        assertTrue(dto.content().isEmpty());
        assertEquals(0, dto.totalElements());
    }
}
