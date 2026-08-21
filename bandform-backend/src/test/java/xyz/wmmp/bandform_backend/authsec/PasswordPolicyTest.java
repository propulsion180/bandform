package xyz.wmmp.bandform_backend.authsec;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThatCode;

class PasswordPolicyTest {

    private final PasswordPolicy policy = new PasswordPolicy();

    @Test
    void acceptsAPasswordMeetingEveryRule() {
        assertThat(policy.isValid("Abcdef12")).isTrue();   // 8 chars, upper+lower+digit
    }

    @Test
    void rejectsTooShort() {
        assertThat(policy.isValid("Abc123")).isFalse();     // 6 chars
        assertThat(policy.isValid("Abcde12")).isFalse();    // 7 chars, one short of MIN_LENGTH
    }

    @Test
    void boundaryAtMinLength() {
        assertThat(PasswordPolicy.MIN_LENGTH).isEqualTo(8);
        assertThat(policy.isValid("Abcde12")).isFalse();    // 7 chars -> just below min
        assertThat(policy.isValid("Abcdef12")).isTrue();    // exactly 8, all classes
    }

    @Test
    void rejectsWhenMissingACharacterClass() {
        assertThat(policy.isValid("abcdef12")).isFalse();   // no uppercase
        assertThat(policy.isValid("ABCDEF12")).isFalse();   // no lowercase
        assertThat(policy.isValid("Abcdefgh")).isFalse();   // no digit
    }

    @Test
    void rejectsNull() {
        assertThat(policy.isValid(null)).isFalse();
    }

    @Test
    void validateThrowsWithTheDescriptionOnFailure() {
        assertThatThrownBy(() -> policy.validate("weak"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage(PasswordPolicy.DESCRIPTION);
    }

    @Test
    void validatePassesSilentlyForAStrongPassword() {
        assertThatCode(() -> policy.validate("Abcdef12")).doesNotThrowAnyException();
    }
}
