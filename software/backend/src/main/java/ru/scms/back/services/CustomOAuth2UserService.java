package ru.scms.back.services;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import ru.scms.back.entities.User;
import ru.scms.back.enums.UserAuthProvider;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserService userService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId();
        UserAuthProvider authProvider = UserAuthProvider.fromString(provider);

        Map<String, Object> attributes = oAuth2User.getAttributes();
        String providerUserId = String.valueOf(attributes.get("sub"));
        String name = attributes.get("name") != null
                ? attributes.get("name").toString()
                : attributes.get("login") != null ? attributes.get("login").toString() : providerUserId;
        String email = attributes.get("email") != null ? attributes.get("email").toString() : null;

        User user = userService.getOrCreateUser(authProvider, providerUserId, name, email);

        return new CustomOAuth2User(user.getId(), oAuth2User.getAttributes(), "sub");
    }
}
