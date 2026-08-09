// Client-side mirrors of the server-side rules (see UserService's email regex
// and authsec/PasswordPolicy). These give inline feedback before submitting;
// the backend remains the authoritative check.

// Mirrors UserService.emailRegex.
const EMAIL_REGEX =
  /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_RULE =
  "At least 8 characters, including an uppercase letter, a lowercase letter, and a number.";

export function isStrongPassword(password: string): boolean {
  return (
    password.length >= PASSWORD_MIN_LENGTH &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
}
