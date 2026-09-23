package ru.scms.back.services;

import java.util.List;
import java.util.Map;
import lombok.Getter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

@Getter
public class CustomOAuth2User extends DefaultOAuth2User {

    private final Long userId;

    public CustomOAuth2User(Long userId, Map<String, Object> attributes, String nameAttributeKey) {
        super(List.of(new SimpleGrantedAuthority("ROLE_USER")), attributes, nameAttributeKey);
        this.userId = userId;
    }

    @Override
    public String getName() {
        return userId.toString();
    }
}
