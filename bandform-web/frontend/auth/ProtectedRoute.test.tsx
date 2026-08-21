import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "./AuthContext";

// Isolate ProtectedRoute from Apollo by mocking the auth hook it consumes.
vi.mock("./AuthContext", () => ({ useAuth: vi.fn() }));
const mockUseAuth = vi.mocked(useAuth);

type AuthShape = Partial<ReturnType<typeof useAuth>>;

function renderRoute(auth: AuthShape, { adminOnly = false } = {}) {
  mockUseAuth.mockReturnValue({
    user: null,
    loading: false,
    isAdmin: false,
    setUser: () => {},
    refreshUser: async () => {},
    ...auth,
  } as ReturnType<typeof useAuth>);

  return render(
    <MemoryRouter initialEntries={["/secret"]}>
      <Routes>
        <Route element={<ProtectedRoute adminOnly={adminOnly} />}>
          <Route path="/secret" element={<div>SECRET</div>} />
        </Route>
        <Route path="/login" element={<div>LOGIN PAGE</div>} />
        <Route path="/" element={<div>HOME PAGE</div>} />
      </Routes>
    </MemoryRouter>
  );
}

const someUser = { id: "1", name: "Nora", role: "NORMAL" } as unknown as ReturnType<typeof useAuth>["user"];

describe("ProtectedRoute", () => {
  beforeEach(() => mockUseAuth.mockReset());

  it("shows a loading state while auth is resolving", () => {
    renderRoute({ loading: true });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("redirects an unauthenticated user to /login", () => {
    renderRoute({ user: null, loading: false });
    expect(screen.getByText("LOGIN PAGE")).toBeInTheDocument();
    expect(screen.queryByText("SECRET")).not.toBeInTheDocument();
  });

  it("renders the protected outlet for an authenticated user", () => {
    renderRoute({ user: someUser, loading: false });
    expect(screen.getByText("SECRET")).toBeInTheDocument();
  });

  it("redirects a non-admin away from an admin-only route", () => {
    renderRoute({ user: someUser, loading: false, isAdmin: false }, { adminOnly: true });
    expect(screen.getByText("HOME PAGE")).toBeInTheDocument();
    expect(screen.queryByText("SECRET")).not.toBeInTheDocument();
  });

  it("allows an admin through an admin-only route", () => {
    renderRoute({ user: someUser, loading: false, isAdmin: true }, { adminOnly: true });
    expect(screen.getByText("SECRET")).toBeInTheDocument();
  });
});
