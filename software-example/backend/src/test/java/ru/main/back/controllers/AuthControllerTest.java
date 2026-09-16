package ru.main.back.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import ru.main.back.BaseControllerTest;
import ru.main.back.dto.auth.ServiceLoginRequestDto;
import ru.main.back.repositories.UserIdentityRepository;
import ru.main.back.repositories.UserRepository;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthControllerTest extends BaseControllerTest {

    private static final String SERVICE_AUTH_HEADER = "Service-Authorization";
    private static final String GOOGLE_PROVIDER = "https://accounts.google.com";

    @Value("${service.auth.login.secret}")
    private String serviceAuthSecret;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserIdentityRepository userIdentityRepository;

    @BeforeEach
    void setUp() {
        userIdentityRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void login_ShouldReturnUserId_WhenHeaderIsValid() throws Exception {
        ServiceLoginRequestDto request = new ServiceLoginRequestDto(
                "auth-controller-user",
                "Auth Controller User",
                GOOGLE_PROVIDER
        );

        mockMvc.perform(post("/auth/login")
                        .header(SERVICE_AUTH_HEADER, serviceAuthSecret)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").isNumber());
    }

    @Test
    void login_ShouldReturnSameUser_WhenCalledTwice() throws Exception {
        ServiceLoginRequestDto request = new ServiceLoginRequestDto(
                "auth-controller-repeat",
                "Repeat User",
                GOOGLE_PROVIDER
        );

        String firstResponse = mockMvc.perform(post("/auth/login")
                        .header(SERVICE_AUTH_HEADER, serviceAuthSecret)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        long firstUserId = objectMapper.readTree(firstResponse).get("userId").asLong();

        mockMvc.perform(post("/auth/login")
                        .header(SERVICE_AUTH_HEADER, serviceAuthSecret)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(firstUserId));
    }

    @Test
    void login_ShouldReturnUnauthorized_WhenHeaderMissing() throws Exception {
        ServiceLoginRequestDto request = new ServiceLoginRequestDto(
                "no-header-user",
                "No Header",
                GOOGLE_PROVIDER
        );

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void login_ShouldReturnUnauthorized_WhenHeaderInvalid() throws Exception {
        ServiceLoginRequestDto request = new ServiceLoginRequestDto(
                "bad-header-user",
                "Bad Header",
                GOOGLE_PROVIDER
        );

        mockMvc.perform(post("/auth/login")
                        .header(SERVICE_AUTH_HEADER, "wrong-secret")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void login_ShouldReturnBadRequest_WhenProviderUnsupported() throws Exception {
        ServiceLoginRequestDto request = new ServiceLoginRequestDto(
                "unsupported-provider-user",
                "Unsupported Provider",
                "https://unsupported.example.com"
        );

        mockMvc.perform(post("/auth/login")
                        .header(SERVICE_AUTH_HEADER, serviceAuthSecret)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
