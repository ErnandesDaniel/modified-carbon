package ru.main.back.enums;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Тесты для UserAuthProvider enum
 */
class UserAuthProviderTest {

    @Test
    void shouldContainGoogleProvider() {
        UserAuthProvider provider = UserAuthProvider.GOOGLE;
        assertNotNull(provider);
    }

    @Test
    void shouldContainGithubProvider() {
        UserAuthProvider provider = UserAuthProvider.GITHUB;
        assertNotNull(provider);
    }

    @Test
    void shouldHaveCorrectNumberOfProviders() {
        UserAuthProvider[] providers = UserAuthProvider.values();
        assertEquals(2, providers.length);
    }

    @Test
    void shouldFindProviderByName() {
        UserAuthProvider provider = UserAuthProvider.valueOf("GOOGLE");
        assertEquals(UserAuthProvider.GOOGLE, provider);
    }
}
