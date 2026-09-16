package ru.main.back.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Утилитарный класс для генерации JWT токенов в тестах.
 */
@Component
public class TestJwtUtils {

    @Value("${jwt.secret}")
    private String secret;

    /**
     * Генерирует JWT токен для тестового пользователя.
     *
     * @param userId ID пользователя
     * @param provider провайдер аутентификации (например, "https://accounts.google.com")
     * @return JWT токен
     */
    public String generateTestToken(Long userId, String provider) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, SignatureAlgorithm.HS256.getJcaName());

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 3600000); // 1 час

        return Jwts.builder()
                .setSubject(userId.toString())
                .claim("iss", provider)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(keySpec, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Генерирует JWT токен для Google пользователя.
     */
    public String generateGoogleToken(Long userId) {
        return generateTestToken(userId, "https://accounts.google.com");
    }

    /**
     * Генерирует JWT токен для GitHub пользователя.
     */
    public String generateGithubToken(Long userId) {
        return generateTestToken(userId, "https://github.com");
    }
}
