package ru.main.back.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.server.ResponseStatusException;
import ru.main.back.BaseServiceTest;
import ru.main.back.dto.userDto.UserDataResponseDto;
import ru.main.back.entities.User;
import ru.main.back.entities.UserIdentity;
import ru.main.back.enums.UserAuthProvider;
import ru.main.back.repositories.UserIdentityRepository;
import ru.main.back.repositories.UserRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class UserServiceTest extends BaseServiceTest {

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserIdentityRepository userIdentityRepository;

    private static final String PROVIDER_USER_ID = "test-google-id-123";
    private static final String USER_NAME = "Test User";

    @BeforeEach
    void setUp() {
        userIdentityRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void getOrCreateUser_ShouldCreateNewUser_WhenUserDoesNotExist() {
        User result = userService.getOrCreateUser(
                UserAuthProvider.GOOGLE,
                PROVIDER_USER_ID,
                USER_NAME
        );

        assertThat(result).isNotNull();
        assertThat(result.getId()).isNotNull();

        assertThat(userRepository.findById(result.getId())).isPresent();
    }

    @Test
    void getOrCreateUser_ShouldCreateUserIdentity_WhenCreatingNewUser() {
        User result = userService.getOrCreateUser(
                UserAuthProvider.GOOGLE,
                PROVIDER_USER_ID,
                USER_NAME
        );

        var identityOpt = userIdentityRepository.findByProviderNameAndProviderUserId(
                UserAuthProvider.GOOGLE,
                PROVIDER_USER_ID
        );

        assertThat(identityOpt).isPresent();
        assertThat(identityOpt.get().getUser().getId()).isEqualTo(result.getId());
        assertThat(identityOpt.get().getUserName()).isEqualTo(USER_NAME);
    }

    @Test
    void getOrCreateUser_ShouldReturnExistingUser_WhenUserAlreadyExists() {
        User firstUser = userService.getOrCreateUser(
                UserAuthProvider.GOOGLE,
                PROVIDER_USER_ID,
                USER_NAME
        );

        User secondUser = userService.getOrCreateUser(
                UserAuthProvider.GOOGLE,
                PROVIDER_USER_ID,
                USER_NAME
        );

        assertThat(secondUser.getId()).isEqualTo(firstUser.getId());
        assertThat(userRepository.count()).isEqualTo(1);
    }

    @Test
    void getOrCreateUser_ShouldCreateDifferentUsers_ForDifferentProviders() {
        User googleUser = userService.getOrCreateUser(
                UserAuthProvider.GOOGLE,
                "google-id-123",
                "Google User"
        );

        User githubUser = userService.getOrCreateUser(
                UserAuthProvider.GITHUB,
                "github-id-456",
                "GitHub User"
        );

        assertThat(googleUser.getId()).isNotEqualTo(githubUser.getId());
        assertThat(userRepository.count()).isEqualTo(2);
    }

    @Test
    void findUserIdByExternalId_ShouldReturnUserId_WhenIdentityExists() {
        User createdUser = userService.getOrCreateUser(
                UserAuthProvider.GOOGLE,
                PROVIDER_USER_ID,
                USER_NAME
        );

        Long foundUserId = userService.findUserIdByExternalId(
                UserAuthProvider.GOOGLE,
                PROVIDER_USER_ID
        );

        assertThat(foundUserId).isEqualTo(createdUser.getId());
    }

    @Test
    void findUserIdByExternalId_ShouldThrowException_WhenIdentityNotFound() {
        assertThatThrownBy(() ->
                userService.findUserIdByExternalId(UserAuthProvider.GOOGLE, "non-existent-id")
        )
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode().value()).isEqualTo(401);
                });
    }

    @Test
    void getUserData_ShouldReturnUserData_WhenUserAndIdentityExist() {
        User createdUser = userService.getOrCreateUser(
                UserAuthProvider.GOOGLE,
                PROVIDER_USER_ID,
                USER_NAME
        );

        UserDataResponseDto result = userService.getUserData(
                createdUser.getId(),
                UserAuthProvider.GOOGLE
        );

        assertThat(result).isNotNull();
        assertThat(result.userId()).isEqualTo(createdUser.getId());
    }

    @Test
    void getUserData_ShouldThrowException_WhenUserNotFound() {
        assertThatThrownBy(() ->
                userService.getUserData(999L, UserAuthProvider.GOOGLE)
        )
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode().value()).isEqualTo(404);
                });
    }

    @Test
    void getUserData_ShouldThrowException_WhenIdentityNotFoundForProvider() {
        User user = userService.getOrCreateUser(
                UserAuthProvider.GOOGLE,
                PROVIDER_USER_ID,
                USER_NAME
        );

        assertThatThrownBy(() ->
                userService.getUserData(user.getId(), UserAuthProvider.GITHUB)
        )
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode().value()).isEqualTo(404);
                });
    }

    @Test
    void getUserData_ShouldWork_WhenUserHasMultipleIdentities() {
        User user = userService.getOrCreateUser(
                UserAuthProvider.GOOGLE,
                "google-id",
                "Google Name"
        );

        UserIdentity githubIdentity = new UserIdentity();
        githubIdentity.setUser(user);
        githubIdentity.setProviderName(UserAuthProvider.GITHUB);
        githubIdentity.setProviderUserId("github-id");
        githubIdentity.setUserName("GitHub Name");
        userIdentityRepository.save(githubIdentity);

        UserDataResponseDto googleData = userService.getUserData(user.getId(), UserAuthProvider.GOOGLE);
        UserDataResponseDto githubData = userService.getUserData(user.getId(), UserAuthProvider.GITHUB);

        assertThat(googleData.userId()).isEqualTo(user.getId());
        assertThat(githubData.userId()).isEqualTo(user.getId());
    }
}
