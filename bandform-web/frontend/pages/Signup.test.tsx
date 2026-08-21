import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing/react";
import Signup from "./Signup";
import { PASSWORD_RULE } from "../constants/validation";

// The mutation never fires in these tests: the client-side validation short-
// circuits handleSubmit before createUser is called, so an empty mock list is
// enough (MockedProvider only supplies the useMutation client).
function renderSignup() {
  const utils = render(
    <MockedProvider mocks={[]}>
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    </MockedProvider>
  );
  const form = utils.container.querySelector("form") as HTMLFormElement;
  // Submit the form directly rather than clicking the button: jsdom's native
  // constraint validation would otherwise block submission on the (intentionally)
  // unfilled required fields, so handleSubmit -- the code under test -- never runs.
  return { ...utils, submit: () => fireEvent.submit(form) };
}

describe("Signup client-side validation", () => {
  it("rejects an invalid email before submitting", async () => {
    const { submit } = renderSignup();
    await userEvent.type(screen.getByLabelText("Email"), "not-an-email");
    submit();
    expect(await screen.findByText("Please enter a valid email address.")).toBeInTheDocument();
  });

  it("rejects a weak password with the password rule", async () => {
    const { submit } = renderSignup();
    await userEvent.type(screen.getByLabelText("Email"), "jo@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "weak");
    submit();
    // The rule appears both as a persistent hint and, here, as the error text.
    expect(await screen.findByText(PASSWORD_RULE, { selector: "p.error-text" })).toBeInTheDocument();
  });

  it("rejects mismatched passwords", async () => {
    const { submit } = renderSignup();
    await userEvent.type(screen.getByLabelText("Email"), "jo@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "Abcdef12");
    await userEvent.type(screen.getByLabelText("Confirm password"), "Abcdef99");
    submit();
    expect(await screen.findByText("Passwords do not match.")).toBeInTheDocument();
  });
});
