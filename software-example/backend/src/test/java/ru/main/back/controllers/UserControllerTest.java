package ru.main.back.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import ru.main.back.BaseControllerTest;
import ru.main.back.entities.User;
import ru.main.back.entities.UserIdentity;
import ru.main.back.enums.UserAuthProvider;
import ru.main.back.repositories.UserIdentityRepository;
import ru.main.back.repositories.UserRepository;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class UserControllerTest extends BaseControllerTest {

    private static final String GOOGLE_ISSUER = "https://accounts.google.com";
    private static final String GITHUB_ISSUER = "https://github.com";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserIdentityRepository userIdentityRepository;

    private Long testUserId;

    @BeforeEach
    void setUp() {
        userIdentityRepository.deleteAll();
        userRepository.deleteAll();

        User user = userRepository.save(new User());
        testUserId = user.getId();

        userIdentityRepository.save(UserIdentity.builder()
                .user(user)
                .providerName(UserAuthProvider.GOOGLE)
                .providerUserId("user-controller-user")
                .userName("User Controller User")
                .build());
    }

    @Test
    void getMe_ShouldReturnCurrentUserData() throws Exception {
        mockMvc.perform(get("/user/me")
                        .with(jwt().jwt(token -> token
                                .subject(testUserId.toString())
                                .issuer(GOOGLE_ISSUER))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userName").value("User Controller User"))
                .andExpect(jsonPath("$.userId").value(testUserId));
    }

    @Test
    void getMe_ShouldReturnNotFound_WhenIdentityForProviderMissing() throws Exception {
        mockMvc.perform(get("/user/me")
                        .with(jwt().jwt(token -> token
                                .subject(testUserId.toString())
                                .issuer(GITHUB_ISSUER))))
                .andExpect(status().isNotFound());
    }

    @Test
    void getMe_ShouldReturnUnauthorized_WhenNoToken() throws Exception {
        mockMvc.perform(get("/user/me"))
                .andExpect(status().isUnauthorized());
    }
}
