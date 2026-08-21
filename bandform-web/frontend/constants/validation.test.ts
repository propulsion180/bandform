import { describe, it, expect } from "vitest";
import { isValidEmail, isStrongPassword, PASSWORD_MIN_LENGTH, FIELD_MAX } from "./validation";

// These mirror the authoritative server-side rules (UserService email regex,
// authsec/PasswordPolicy, and the entity @Size caps). Keeping them pinned means
// a drift from the backend rules shows up as a failing test.

describe("isValidEmail", () => {
  it.each([
    "jo@example.com",
    "a.b+tag@sub.domain.co",
    "user_name@host.io",
  ])("accepts %s", (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each([
    "not-an-email",
    "no@tld",
    "@example.com",
    "spaces in@example.com",
    "trailingdot@example.",
    "toolongtld@example.abcdefgh", // TLD > 7 chars, mirrors the {2,7} bound
  ])("rejects %s", (email) => {
    expect(isValidEmail(email)).toBe(false);
  });
});

describe("isStrongPassword", () => {
  it("accepts a password meeting every class at the minimum length", () => {
    expect(isStrongPassword("Abcdef12")).toBe(true);
    expect(PASSWORD_MIN_LENGTH).toBe(8);
  });

  it.each([
    ["Abc123", "too short"],
    ["abcdef12", "no uppercase"],
    ["ABCDEF12", "no lowercase"],
    ["Abcdefgh", "no digit"],
    ["", "empty"],
  ])("rejects %s (%s)", (password) => {
    expect(isStrongPassword(password)).toBe(false);
  });
});

describe("FIELD_MAX", () => {
  it("pins the length caps that mirror the server @Size annotations", () => {
    expect(FIELD_MAX).toMatchObject({
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
    });
  });
});
