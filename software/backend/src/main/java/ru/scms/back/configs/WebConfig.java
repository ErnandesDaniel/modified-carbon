// package ru.scms.back.configs;
//
// import lombok.RequiredArgsConstructor;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.reactive.config.WebFluxConfigurer;
// import org.springframework.web.reactive.result.method.annotation.ArgumentResolverConfigurer;
// import ru.scms.back.configs.CurrentUserIdResolver;
//
// @Configuration
// @RequiredArgsConstructor
// public class WebConfig implements WebFluxConfigurer {
//
//    private final CurrentUserIdResolver currentUserIdResolver;
//
//    @Override
//    public void configureArgumentResolvers(ArgumentResolverConfigurer configurer) {
//        configurer.addCustomResolver(currentUserIdResolver);
//    }
// }

package ru.scms.back.configs;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final CurrentUserIdResolver currentUserIdResolver;

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(currentUserIdResolver);
    }
}
