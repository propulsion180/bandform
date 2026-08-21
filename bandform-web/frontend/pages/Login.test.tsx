import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing/react";
import Login from "./Login";
import { LOGIN } from "../graphql/mutations";

// Login pulls refreshUser from the auth context; stub it so the test doesn't
// need a live Apollo `me` query. `vi.hoisted` makes the stub available to the
// hoisted `vi.mock` factory without hitting the temporal-dead-zone trap.
const refreshUser = vi.hoisted(() => vi.fn());
vi.mock("../auth/AuthContext", () => ({ useAuth: () => ({ refreshUser }) }));

function renderLogin(mocks: any[]) {
  return render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </MockedProvider>
  );
}

describe("Login", () => {
  beforeEach(() => {
    refreshUser.mockReset();
    refreshUser.mockResolvedValue(undefined);
  });

  it("renders the username and password fields", () => {
    renderLogin([]);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("shows an error message when the login mutation fails", async () => {
    const failing = [
      {
        request: { query: LOGIN, variables: { name: "Nora", password: "wrongpass" } },
        error: new Error("Unauthorized"),
      },
    ];
    renderLogin(failing);

    await userEvent.type(screen.getByLabelText("Username"), "Nora");
    await userEvent.type(screen.getByLabelText("Password"), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText("Invalid username or password.")).toBeInTheDocument();
    expect(refreshUser).not.toHaveBeenCalled();
  });
});
