package ru.main.back.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.main.back.entities.User;
import ru.main.back.enums.UserAuthProvider;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;

    public UserAuthProvider extractProviderFromJwt(Jwt jwt) {
        String issuer = jwt.getClaimAsString("iss");
        if (issuer == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing 'iss' claim in JWT");
        }

        if (issuer.contains("https://accounts.google.com")) {
            return UserAuthProvider.GOOGLE;
        }
        if (issuer.contains("github.com")) {
            return UserAuthProvider.GITHUB;
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported auth provider: " + issuer);
    }

    public UserAuthProvider extractProviderFromString(String provider) {

        if (provider.contains("https://accounts.google.com")) {
            return UserAuthProvider.GOOGLE;
        }
        if (provider.contains("github.com")) {
            return UserAuthProvider.GITHUB;
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported auth provider: " + provider);
    }

    private String extractUserName(Jwt jwt) {
        return jwt.getClaimAsString("given_name");
    }
}