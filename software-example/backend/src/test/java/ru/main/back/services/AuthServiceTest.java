package ru.main.back.services;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.server.ResponseStatusException;
import ru.main.back.BaseServiceTest;
import ru.main.back.enums.UserAuthProvider;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AuthServiceTest extends BaseServiceTest {

    @Autowired
    private AuthService authService;

    @Test
    void extractProviderFromJwt_ShouldReturnGoogle_WhenIssuerIsGoogle() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("iss", "https://accounts.google.com");
        Jwt jwt = createJwt(claims);

        UserAuthProvider result = authService.extractProviderFromJwt(jwt);

        assertThat(result).isEqualTo(UserAuthProvider.GOOGLE);
    }

    @Test
    void extractProviderFromJwt_ShouldReturnGithub_WhenIssuerIsGitHub() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("iss", "https://github.com");
        Jwt jwt = createJwt(claims);

        UserAuthProvider result = authService.extractProviderFromJwt(jwt);

        assertThat(result).isEqualTo(UserAuthProvider.GITHUB);
    }

    @Test
    void extractProviderFromJwt_ShouldThrowException_WhenIssuerIsMissing() {
        Map<String, Object> claims = new HashMap<>();
        Jwt jwt = createJwt(claims);

        assertThatThrownBy(() -> authService.extractProviderFromJwt(jwt))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode().value()).isEqualTo(401);
                    assertThat(rse.getReason()).contains("Missing 'iss' claim");
                });
    }

    @Test
    void extractProviderFromJwt_ShouldThrowException_WhenIssuerIsUnsupported() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("iss", "https://unsupported-provider.com");
        Jwt jwt = createJwt(claims);

        assertThatThrownBy(() -> authService.extractProviderFromJwt(jwt))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode().value()).isEqualTo(400);
                    assertThat(rse.getReason()).contains("Unsupported auth provider");
                });
    }

    @Test
    void extractProviderFromString_ShouldReturnGoogle_WhenProviderIsGoogle() {
        UserAuthProvider result = authService.extractProviderFromString("https://accounts.google.com");

        assertThat(result).isEqualTo(UserAuthProvider.GOOGLE);
    }

    @Test
    void extractProviderFromString_ShouldReturnGithub_WhenProviderIsGitHub() {
        UserAuthProvider result = authService.extractProviderFromString("https://github.com");

        assertThat(result).isEqualTo(UserAuthProvider.GITHUB);
    }

    @Test
    void extractProviderFromString_ShouldThrowException_WhenProviderIsUnsupported() {
        assertThatThrownBy(() -> authService.extractProviderFromString("https://facebook.com"))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode().value()).isEqualTo(400);
                    assertThat(rse.getReason()).contains("Unsupported auth provider");
                });
    }

    private Jwt createJwt(Map<String, Object> claims) {
        return Jwt.withTokenValue("test-token")
                .header("alg", "none")
                .claims(existingClaims -> existingClaims.putAll(claims))
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(3600))
                .build();
    }
}
