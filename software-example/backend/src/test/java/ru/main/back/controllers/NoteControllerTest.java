package ru.main.back.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import ru.main.back.BaseControllerTest;
import ru.main.back.dto.noteDto.NoteCreateRequestDto;
import ru.main.back.dto.noteDto.NoteUpdateRequestDto;
import ru.main.back.entities.User;
import ru.main.back.entities.UserIdentity;
import ru.main.back.enums.UserAuthProvider;
import ru.main.back.repositories.NoteRepository;
import ru.main.back.repositories.UserIdentityRepository;
import ru.main.back.repositories.UserRepository;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class NoteControllerTest extends BaseControllerTest {

    private static final String GOOGLE_ISSUER = "https://accounts.google.com";

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserIdentityRepository userIdentityRepository;

    private Long testUserId;

    @BeforeEach
    void setUp() {
        noteRepository.deleteAll();
        userIdentityRepository.deleteAll();
        userRepository.deleteAll();

        User user = userRepository.save(new User());
        testUserId = user.getId();

        userIdentityRepository.save(UserIdentity.builder()
                .user(user)
                .providerName(UserAuthProvider.GOOGLE)
                .providerUserId("note-controller-user")
                .userName("Note Controller User")
                .build());
    }

    private RequestPostProcessor authenticatedUser() {
        return jwt().jwt(token -> token
                .subject(testUserId.toString())
                .issuer(GOOGLE_ISSUER));
    }

    @Test
    void create_ShouldReturnCreatedNote() throws Exception {
        NoteCreateRequestDto request = new NoteCreateRequestDto(
                "Controller Note",
                "Created through the REST layer",
                "https://example.com"
        );

        mockMvc.perform(post("/notes")
                        .with(authenticatedUser())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Controller Note"))
                .andExpect(jsonPath("$.description").value("Created through the REST layer"))
                .andExpect(jsonPath("$.url").value("https://example.com"));
    }

    @Test
    void getAll_ShouldReturnNotesPage() throws Exception {
        createNote("First Note", "First description");
        createNote("Second Note", "Second description");

        mockMvc.perform(get("/notes")
                        .with(authenticatedUser()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.content.length()").value(2));
    }

    @Test
    void getAll_ShouldSupportSearchQuery() throws Exception {
        createNote("Important Note", "Has important content");
        createNote("Other Note", "Nothing to see");

        mockMvc.perform(get("/notes")
                        .param("searchQuery", "important")
                        .with(authenticatedUser()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.content[0].title").value("Important Note"));
    }

    @Test
    void update_ShouldUpdateNote() throws Exception {
        Long noteId = createNote("Original Title", "Original description");

        NoteUpdateRequestDto request = new NoteUpdateRequestDto(
                "Updated Title",
                "Updated description",
                null
        );

        mockMvc.perform(patch("/notes/{id}", noteId)
                        .with(authenticatedUser())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"))
                .andExpect(jsonPath("$.description").value("Updated description"));
    }

    @Test
    void delete_ShouldRemoveNote() throws Exception {
        Long noteId = createNote("To Be Deleted", "Will be deleted");

        mockMvc.perform(delete("/notes/{id}", noteId)
                        .with(authenticatedUser()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/notes")
                        .with(authenticatedUser()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(0));
    }

    @Test
    void getAll_ShouldReturnUnauthorized_WhenNoToken() throws Exception {
        mockMvc.perform(get("/notes"))
                .andExpect(status().isUnauthorized());
    }

    private Long createNote(String title, String description) throws Exception {
        String response = mockMvc.perform(post("/notes")
                        .with(authenticatedUser())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new NoteCreateRequestDto(title, description, null))))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(response).get("id").asLong();
    }
}
