package xyz.wmmp.bandform_backend.resolvers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import xyz.wmmp.bandform_backend.AbstractGraphQlIT;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.data.UserType;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * End-to-end auth behaviour: cookie issuance, failed-attempt lockout,
 * account-enumeration safety, and session revocation on logout / password change.
 */
class AuthResolverIT extends AbstractGraphQlIT {

    private static final String PW = "Abcdef12";

    @BeforeEach
    void clean() {
        userRepository.deleteAll();
    }

    private String sessionSetCookie(Gql r) {
        return r.setCookies().stream().filter(c -> c.startsWith("session=")).findFirst().orElse(null);
    }

    @Test
    void loginReturnsTheProfileAndSetsAHardenedSessionCookie() {
        seedUser("Nora", PW, UserType.NORMAL);

        Gql r = post(LOGIN, Map.of("n", "Nora", "p", PW), null);

        assertThat(r.hasErrors()).isFalse();
        assertThat(r.data().path("login").path("user").path("name").asText()).isEqualTo("Nora");

        String setCookie = sessionSetCookie(r);
        assertThat(setCookie).isNotNull();
        assertThat(setCookie).contains("HttpOnly");
        assertThat(setCookie).contains("SameSite=Strict");
        assertThat(setCookie).contains("Path=/");
    }

    @Test
    void aWrongPasswordIncrementsTheFailedAttemptCounter() {
        seedUser("Nora", PW, UserType.NORMAL);

        Gql r = post(LOGIN, Map.of("n", "Nora", "p", "wrongpass1"), null);

        assertThat(r.hasErrors()).isTrue();
        assertThat(r.sessionCookie()).isNull();
        User after = userRepository.findByName("Nora").orElseThrow();
        assertThat(after.getFailedLoginAttempts()).isEqualTo(1);
        assertThat(after.isLocked()).isFalse();
    }

    @Test
    void fiveFailedAttemptsLockTheAccount() {
        seedUser("Nora", PW, UserType.NORMAL);

        for (int i = 0; i < 5; i++) {
            post(LOGIN, Map.of("n", "Nora", "p", "wrongpass1"), null);
        }

        User after = userRepository.findByName("Nora").orElseThrow();
        assertThat(after.isLocked()).isTrue();
        assertThat(after.getFailedLoginAttempts()).isGreaterThanOrEqualTo(5);

        // Even the correct password is refused once locked.
        assertThat(post(LOGIN, Map.of("n", "Nora", "p", PW), null).sessionCookie()).isNull();
    }

    @Test
    void unknownUserWrongPasswordAndLockedAccountAreIndistinguishable() {
        seedUser("WrongPw", PW, UserType.NORMAL);
        User locked = seedUser("Locked", PW, UserType.NORMAL);
        locked.setLocked(true);
        userRepository.save(locked);

        String unknownMsg = post(LOGIN, Map.of("n", "Ghost", "p", PW), null).firstErrorMessage();
        String wrongPwMsg = post(LOGIN, Map.of("n", "WrongPw", "p", "totallywrong1"), null).firstErrorMessage();
        String lockedMsg = post(LOGIN, Map.of("n", "Locked", "p", PW), null).firstErrorMessage();

        // The three failure modes must surface as the same message so a caller
        // can't tell "no such user" from "wrong password" from "locked".
        assertThat(unknownMsg).isEqualTo(wrongPwMsg).isEqualTo(lockedMsg);
    }

    @Test
    void logoutClearsTheServerSideSessionAndExpiresTheCookie() {
        seedUser("Nora", PW, UserType.NORMAL);
        String cookie = login("Nora", PW);
        assertThat(userRepository.findByName("Nora").orElseThrow().getJtiToken()).isNotNull();

        Gql r = post("mutation{ logout }", null, cookie);

        assertThat(r.data().path("logout").asBoolean()).isTrue();
        assertThat(userRepository.findByName("Nora").orElseThrow().getJtiToken()).isNull();
        assertThat(sessionSetCookie(r)).contains("Max-Age=0");
    }

    @Test
    void changePasswordRejectsAWeakPasswordWithBadRequest() {
        seedUser("Nora", PW, UserType.NORMAL);
        String cookie = login("Nora", PW);

        Gql r = post("mutation($p:String!){ changePassword(newPassword:$p) }", Map.of("p", "weak"), cookie);

        assertThat(r.hasErrors()).isTrue();
        assertThat(r.firstErrorType()).isEqualTo("BAD_REQUEST");
    }

    @Test
    void changePasswordRotatesTheHashAndRevokesTheSession() {
        User nora = seedUser("Nora", PW, UserType.NORMAL);
        String originalHash = nora.getPasswordHash();
        String cookie = login("Nora", PW);

        Gql r = post("mutation($p:String!){ changePassword(newPassword:$p) }", Map.of("p", "NewPass99"), cookie);

        assertThat(r.hasErrors()).isFalse();
        assertThat(r.data().path("changePassword").asBoolean()).isTrue();
        User after = userRepository.findByName("Nora").orElseThrow();
        assertThat(after.getPasswordHash()).isNotEqualTo(originalHash);
        assertThat(after.getJtiToken()).isNull();               // session revoked
        assertThat(passwordEncoder.matches("NewPass99", after.getPasswordHash())).isTrue();
    }
}
