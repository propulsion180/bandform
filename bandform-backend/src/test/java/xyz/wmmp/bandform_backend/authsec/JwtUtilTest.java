package xyz.wmmp.bandform_backend.authsec;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThatCode;

class JwtUtilTest {

    private static final String SECRET = "unit-test-secret-that-is-well-over-32-bytes-long";

    private JwtUtil withSecret(String secret) {
        JwtUtil util = new JwtUtil();
        ReflectionTestUtils.setField(util, "secret", secret);
        return util;
    }

    @Test
    void validateSecretRejectsShortOrNullSecrets() {
        assertThatThrownBy(() -> ReflectionTestUtils.invokeMethod(withSecret("tooshort"), "validateSecret"))
                .isInstanceOf(IllegalStateException.class);
        assertThatThrownBy(() -> ReflectionTestUtils.invokeMethod(withSecret(null), "validateSecret"))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void validateSecretAcceptsALongEnoughSecret() {
        assertThatCode(() -> ReflectionTestUtils.invokeMethod(withSecret(SECRET), "validateSecret"))
                .doesNotThrowAnyException();
    }

    @Test
    void generatedTokenRoundTripsSubjectRoleAndJti() {
        JwtUtil util = withSecret(SECRET);
        String token = util.generateToken("jti-123", "42", "ADMIN");

        Claims claims = util.validate(token);
        assertThat(claims.getSubject()).isEqualTo("42");
        assertThat(claims.get("role", String.class)).isEqualTo("ADMIN");
        assertThat(claims.getId()).isEqualTo("jti-123");
        assertThat(claims.getExpiration()).isAfter(claims.getIssuedAt());
    }

    @Test
    void aTokenSignedWithADifferentKeyIsRejected() {
        JwtUtil signer = withSecret(SECRET);
        JwtUtil other = withSecret("a-completely-different-secret-key-32-bytes-plus");

        String forged = signer.generateToken("jti", "1", "NORMAL");

        assertThatThrownBy(() -> other.validate(forged)).isInstanceOf(JwtException.class);
    }
}
