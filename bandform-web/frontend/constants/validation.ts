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

// Maximum lengths, mirroring the server-side @Size caps on the JPA entities
// (see data/User, data/Band, data/BandPosition, data/Message, data/JoinRequest).
// Used as `maxLength` on inputs; the backend remains the authoritative check.
export const FIELD_MAX = {
  name: 50,
  email: 254,
  city: 100,
  country: 100,
  userDescription: 500,
  bandName: 100,
  bandDescription: 1000,
  positionDescription: 500,
  message: 1000,
  role: 100,
  chatBody: 2000,
} as const;
