package xyz.wmmp.bandform_backend.authsec;

import org.springframework.stereotype.Component;

/**
 * Single source of truth for the password strength rule, shared by account
 * creation and password change. The frontend mirrors the same rule (see
 * Signup/Profile) for inline feedback, but this server-side check is the
 * authoritative one.
 */
@Component
public class PasswordPolicy {

    public static final int MIN_LENGTH = 8;

    public static final String DESCRIPTION =
            "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.";

    /** @throws IllegalArgumentException if the password does not meet the policy. */
    public void validate(String password) {
        if (!isValid(password)) {
            throw new IllegalArgumentException(DESCRIPTION);
        }
    }

    public boolean isValid(String password) {
        if (password == null || password.length() < MIN_LENGTH) {
            return false;
        }
        boolean hasUpper = false;
        boolean hasLower = false;
        boolean hasDigit = false;
        for (int i = 0; i < password.length(); i++) {
            char c = password.charAt(i);
            if (Character.isUpperCase(c)) {
                hasUpper = true;
            } else if (Character.isLowerCase(c)) {
                hasLower = true;
            } else if (Character.isDigit(c)) {
                hasDigit = true;
            }
        }
        return hasUpper && hasLower && hasDigit;
    }
}
