package xyz.wmmp.bandform_backend.resolvers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import xyz.wmmp.bandform_backend.AbstractGraphQlIT;
import xyz.wmmp.bandform_backend.data.UserType;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Guards the @PreAuthorize("hasAnyRole('ADMIN','OWNER')") gate on the admin-only
 * systemMetrics query: rejected for anonymous and NORMAL callers, served to ADMIN.
 */
class AuthorizationIT extends AbstractGraphQlIT {

    private static final String PW = "Abcdef12";
    private static final String METRICS = "query{ systemMetrics { totalUsers } }";

    @BeforeEach
    void clean() {
        userRepository.deleteAll();
    }

    @Test
    void anonymousCallerCannotReadSystemMetrics() {
        Gql r = post(METRICS, null, null);

        assertThat(r.hasErrors()).isTrue();
        assertThat(r.data().path("systemMetrics").isMissingNode() || r.data().path("systemMetrics").isNull()).isTrue();
    }

    @Test
    void normalUserCannotReadSystemMetrics() {
        seedUser("Nora", PW, UserType.NORMAL);
        String cookie = login("Nora", PW);

        Gql r = post(METRICS, null, cookie);

        assertThat(r.hasErrors()).isTrue();
        assertThat(r.data().path("systemMetrics").isNull() || r.data().path("systemMetrics").isMissingNode()).isTrue();
    }

    @Test
    void adminUserCanReadSystemMetrics() {
        seedUser("Alex", PW, UserType.ADMIN);
        String cookie = login("Alex", PW);

        Gql r = post(METRICS, null, cookie);

        assertThat(r.hasErrors()).isFalse();
        assertThat(r.data().path("systemMetrics").path("totalUsers").isInt()).isTrue();
    }
}
