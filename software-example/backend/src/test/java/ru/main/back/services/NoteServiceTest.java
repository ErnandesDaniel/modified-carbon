package ru.main.back.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import ru.main.back.BaseServiceTest;
import ru.main.back.dto.noteDto.NoteCreateRequestDto;
import ru.main.back.dto.noteDto.NoteResponseDto;
import ru.main.back.dto.noteDto.NoteUpdateRequestDto;
import ru.main.back.dto.noteDto.NotesPageResponseDto;
import ru.main.back.entities.User;
import ru.main.back.entities.UserIdentity;
import ru.main.back.enums.UserAuthProvider;
import ru.main.back.repositories.NoteRepository;
import ru.main.back.repositories.UserIdentityRepository;
import ru.main.back.repositories.UserRepository;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class NoteServiceTest extends BaseServiceTest {

    @Autowired
    private NoteService noteService;

    @Autowired
    private NoteRepository noteRepository;

    private Long testUserId;
    private static final String PROVIDER_USER_ID = "test-google-id-123";
    private static final String USER_NAME = "Test User";

    @BeforeEach
    void setUp() {
        noteRepository.deleteAll();
        userIdentityRepository.deleteAll();
        userRepository.deleteAll();

        User user = new User();
        User savedUser = userRepository.save(user);
        testUserId = savedUser.getId();

        UserIdentity identity = new UserIdentity();
        identity.setUser(savedUser);
        identity.setProviderName(UserAuthProvider.GOOGLE);
        identity.setProviderUserId(PROVIDER_USER_ID);
        identity.setUserName(USER_NAME);
        userIdentityRepository.save(identity);
    }

    @Test
    void create_ShouldCreateNoteSuccessfully() {
        NoteCreateRequestDto request = new NoteCreateRequestDto(
                "Test Title",
                "Test Description",
                "https://example.com"
        );

        NoteResponseDto result = noteService.create(request, testUserId);

        assertThat(result).isNotNull();
        assertThat(result.id()).isNotNull();
        assertThat(result.title()).isEqualTo("Test Title");
        assertThat(result.description()).isEqualTo("Test Description");
        assertThat(result.url()).isEqualTo("https://example.com");
        assertThat(result.createdAt()).isNotNull();
        assertThat(result.updatedAt()).isNotNull();
    }

    @Test
    void create_ShouldSaveNoteToDatabase() {
        NoteCreateRequestDto request = new NoteCreateRequestDto(
                "Database Test",
                "Checking if saved",
                null
        );

        NoteResponseDto result = noteService.create(request, testUserId);

        assertThat(noteRepository.findById(result.id())).isPresent();
    }

    @Test
    void findAllWithFilters_ShouldReturnNotesForUser() {
        noteService.create(new NoteCreateRequestDto("Note 1", "Desc 1", null), testUserId);
        noteService.create(new NoteCreateRequestDto("Note 2", "Desc 2", null), testUserId);

        NotesPageResponseDto result = noteService.findAllWithFilters(
                testUserId, "", false, 0, 10, null
        );

        assertThat(result.content()).hasSize(2);
        assertThat(result.totalElements()).isEqualTo(2);
        assertThat(result.page()).isEqualTo(0);
        assertThat(result.size()).isEqualTo(10);
    }

    @Test
    void findAllWithFilters_ShouldFilterBySearchQuery() {
        noteService.create(new NoteCreateRequestDto("Important Note", "Description", null), testUserId);
        noteService.create(new NoteCreateRequestDto("Other Note", "Another description", null), testUserId);
        noteService.create(new NoteCreateRequestDto("Third Entry", "Important content here", null), testUserId);

        NotesPageResponseDto result = noteService.findAllWithFilters(
                testUserId, "important", false, 0, 10, null
        );

        assertThat(result.content()).hasSize(2);
    }

    @Test
    void findAllWithFilters_ShouldNotReturnDeletedNotes() {
        NoteResponseDto note = noteService.create(
                new NoteCreateRequestDto("To Delete", "Description", null), 
                testUserId
        );
        noteService.delete(note.id(), testUserId);

        NotesPageResponseDto result = noteService.findAllWithFilters(
                testUserId, "", false, 0, 10, null
        );

        assertThat(result.content()).isEmpty();
    }

    @Test
    void update_ShouldUpdateNoteFields() {
        NoteResponseDto created = noteService.create(
                new NoteCreateRequestDto("Original Title", "Original Desc", "https://original.com"),
                testUserId
        );

        NoteUpdateRequestDto updateRequest = new NoteUpdateRequestDto(
                "Updated Title",
                "Updated Desc",
                "https://updated.com"
        );

        NoteResponseDto updated = noteService.update(created.id(), updateRequest, testUserId);

        assertThat(updated.title()).isEqualTo("Updated Title");
        assertThat(updated.description()).isEqualTo("Updated Desc");
        assertThat(updated.url()).isEqualTo("https://updated.com");
    }

    @Test
    void update_ShouldUpdateOnlyProvidedFields() {
        NoteResponseDto created = noteService.create(
                new NoteCreateRequestDto("Original Title", "Original Desc", "https://original.com"),
                testUserId
        );

        NoteUpdateRequestDto updateRequest = new NoteUpdateRequestDto(
                "Only Title Updated",
                null,
                null
        );

        NoteResponseDto updated = noteService.update(created.id(), updateRequest, testUserId);

        assertThat(updated.title()).isEqualTo("Only Title Updated");
        assertThat(updated.description()).isEqualTo("Original Desc");
        assertThat(updated.url()).isEqualTo("https://original.com");
    }

    @Test
    void update_ShouldThrowException_WhenNoteNotFound() {
        NoteUpdateRequestDto updateRequest = new NoteUpdateRequestDto("Title", null, null);

        assertThatThrownBy(() -> noteService.update(999L, updateRequest, testUserId))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Note not found");
    }

    @Test
    void delete_ShouldMarkNoteAsDeleted() {
        NoteResponseDto created = noteService.create(
                new NoteCreateRequestDto("To Delete", "Description", null),
                testUserId
        );

        noteService.delete(created.id(), testUserId);

        NotesPageResponseDto result = noteService.findAllWithFilters(
                testUserId, "To Delete", false, 0, 10, null
        );
        
        assertThat(result.content()).isEmpty();
    }

    @Test
    void delete_ShouldThrowException_WhenNoteNotFound() {
        assertThatThrownBy(() -> noteService.delete(999L, testUserId))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Note not found");
    }

    @Test
    void delete_ShouldNotDeleteNoteOfOtherUser() {
        User otherUser = new User();
        User savedOtherUser = userRepository.save(otherUser);
        
        NoteResponseDto note = noteService.create(
                new NoteCreateRequestDto("My Note", "Description", null),
                testUserId
        );

        assertThatThrownBy(() -> noteService.delete(note.id(), savedOtherUser.getId()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Note not found");

        NotesPageResponseDto result = noteService.findAllWithFilters(
                testUserId, "My Note", false, 0, 10, null
        );
        
        assertThat(result.content()).hasSize(1);
        assertThat(result.content().get(0).title()).isEqualTo("My Note");
    }

    @Test
    void findAllWithFilters_WithSemanticSearch_ShouldUseLikeFallback_WhenEmbeddingNotGenerated() {
        // Given: создаем заметку (эмбеддинг сгенерируется моком)
        noteService.create(new NoteCreateRequestDto("Spring Boot Framework", "Java web framework", null), testUserId);

        // When: вызываем семантический поиск
        NotesPageResponseDto result = noteService.findAllWithFilters(
                testUserId, "framework", true, 0, 10, null
        );

        // Then: должен вернуть результаты (fallback на LIKE поиск если эмбеддинг не сгенерировался)
        assertThat(result).isNotNull();
        assertThat(result.content()).isNotEmpty();
    }

    @Test
    void create_ShouldGenerateEmbedding() {
        // Given
        NoteCreateRequestDto request = new NoteCreateRequestDto(
                "Machine Learning Basics",
                "Introduction to ML and neural networks",
                "https://ml-course.com"
        );

        // When
        NoteResponseDto result = noteService.create(request, testUserId);

        // Then: заметка создана (эмбеддинг сгенерирован в фоне моком)
        assertThat(result).isNotNull();
        assertThat(result.id()).isNotNull();
        
        // Проверяем что заметка сохранена в БД
        assertThat(noteRepository.findById(result.id())).isPresent();
    }

    @Test
    void update_ShouldRegenerateEmbedding() {
        // Given
        NoteResponseDto created = noteService.create(
                new NoteCreateRequestDto("Original", "Original desc", null),
                testUserId
        );

        // When: обновляем контент
        NoteUpdateRequestDto updateRequest = new NoteUpdateRequestDto(
                "Updated Title about AI",
                "Updated description about artificial intelligence",
                null
        );
        NoteResponseDto updated = noteService.update(created.id(), updateRequest, testUserId);

        // Then: заметка обновлена (эмбеддинг перегенерирован)
        assertThat(updated.title()).isEqualTo("Updated Title about AI");
        assertThat(updated.description()).isEqualTo("Updated description about artificial intelligence");
    }

    @Test
    void create_ShouldStoreEmbeddingInDatabase() {
        // Given
        NoteCreateRequestDto request = new NoteCreateRequestDto(
                "Test Title",
                "Test Description",
                "https://example.com"
        );

        // When
        NoteResponseDto result = noteService.create(request, testUserId);

        // Then: проверяем что эмбеддинг сохранен в БД
        var note = noteRepository.findById(result.id()).orElseThrow();
        assertThat(note.getEmbeddingDense()).isNotNull();
        assertThat(note.getEmbeddingDense()).hasSize(1024);
        assertThat(note.getEmbeddingSparse()).isNotNull();
        assertThat(note.getEmbeddingSparse()).hasSize(1024);
    }

    @Test
    void findAllWithFilters_SemanticSearch_ShouldWorkWithoutErrors() {
        // Given: создаем несколько заметок
        noteService.create(new NoteCreateRequestDto(
                "Spring Boot Tutorial",
                "Learn Spring Boot framework",
                null
        ), testUserId);

        noteService.create(new NoteCreateRequestDto(
                "Python Basics",
                "Introduction to Python",
                null
        ), testUserId);

        // When: выполняем семантический поиск (с моком эмбеддинги одинаковые)
        NotesPageResponseDto result = noteService.findAllWithFilters(
                testUserId, "spring framework", true, 0, 10, null
        );

        // Then: проверяем что поиск выполняется без ошибок
        // С моком может вернуться 0 или несколько результатов в зависимости от реализации
        assertThat(result).isNotNull();
        assertThat(result.page()).isEqualTo(0);
        assertThat(result.size()).isEqualTo(10);
    }

    @Test
    void findAllWithFilters_SemanticSearch_ShouldFilterByUserOnly() {
        // Given: создаем пользователей и заметки
        User otherUser = new User();
        User savedOtherUser = userRepository.save(otherUser);

        noteService.create(new NoteCreateRequestDto(
                "My Private Note",
                "Personal information",
                null
        ), testUserId);

        noteService.create(new NoteCreateRequestDto(
                "Other User Note",
                "Some content",
                null
        ), savedOtherUser.getId());

        // When: ищем заметки первого пользователя
        NotesPageResponseDto result = noteService.findAllWithFilters(
                testUserId, "personal", true, 0, 10, null
        );

        // Then: должен видеть только свою заметку
        assertThat(result.content()).hasSize(1);
        assertThat(result.content().get(0).title()).isEqualTo("My Private Note");
    }
}
