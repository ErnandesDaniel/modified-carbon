package ru.scms.back.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import ru.scms.back.exceptionHandlers.JwtAccessDeniedHandler;
import ru.scms.back.exceptionHandlers.JwtAuthenticationEntryPoint;
import ru.scms.back.services.CustomOAuth2User;
import ru.scms.back.services.CustomOAuth2UserService;
import ru.scms.back.services.JwtService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${app.frontend-url}")
    private String frontendUrl;

    private final JwtService jwtService;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

    public SecurityConfig(
            JwtService jwtService,
            CustomOAuth2UserService customOAuth2UserService,
            JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
            JwtAccessDeniedHandler jwtAccessDeniedHandler) {
        this.jwtService = jwtService;
        this.customOAuth2UserService = customOAuth2UserService;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.jwtAccessDeniedHandler = jwtAccessDeniedHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http, JwtCookieAuthenticationFilter jwtCookieAuthenticationFilter) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .addFilterBefore(jwtCookieAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth.requestMatchers(
                                "/auth/dev-login",
                                "/auth/client-dev-login",
                                "/auth/refresh",
                                "/oauth2/**",
                                "/login/oauth2/**",
                                "/v3/api-docs/**",
                                "/swagger/**",
                                "/swagger-ui/**",
                                "/")
                        .permitAll()
                        .anyRequest()
                        .authenticated())
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                        .accessDeniedHandler(jwtAccessDeniedHandler))
                .oauth2Login(
                        oauth2 -> oauth2.userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                                .successHandler(successHandler()))
                .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()));

        return http.build();
    }

    @Bean
    public AuthenticationSuccessHandler successHandler() {
        return (request, response, authentication) -> {
            if (authentication instanceof OAuth2AuthenticationToken oauthToken) {
                Long userId;
                String userName;

                if (oauthToken.getPrincipal() instanceof CustomOAuth2User customUser) {
                    userId = customUser.getUserId();
                    Object name = customUser.getAttributes().get("name");
                    userName = name != null ? name.toString() : "user";
                } else {
                    var principal = oauthToken.getPrincipal();
                    String sub = (String) principal.getAttribute("sub");
                    throw new IllegalStateException("Unexpected principal type for user " + sub);
                }

                JwtService.TokenPair tokens =
                        jwtService.generateTokens(userId, oauthToken.getAuthorizedClientRegistrationId(), userName);
                jwtService.addTokensToCookies(response, tokens);
            }
            response.sendRedirect(frontendUrl);
        };
    }
}
