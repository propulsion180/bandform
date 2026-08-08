import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { LOGOUT } from "../graphql/mutations";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../hooks/useTheme";
import { useOpenPath } from "../windows/useOpenPath";

export function NavLinks() {
  const navigate = useNavigate();
  const location = useLocation();
  const openPath = useOpenPath();
  const { user, isAdmin, setUser } = useAuth();
  const { theme, toggle } = useTheme();
  const [logout] = useMutation(LOGOUT);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      navigate("/");
    }
  };

  const linkClass = (path: string) =>
    `nav-link ${location.pathname === path ? "active" : ""}`;

  return (
    <nav className="header-nav">
      <a className={linkClass("/")} onClick={() => navigate("/")}>
        Home
      </a>
      {user != null && (
        <a className={linkClass("/discover")} onClick={() => openPath("/discover")}>
          Discover
        </a>
      )}
      {user != null && (
        <a className={linkClass("/requests")} onClick={() => openPath("/requests")}>
          Requests
        </a>
      )}
      {user != null && (
        <a className={linkClass("/profile")} onClick={() => openPath("/profile")}>
          Profile
        </a>
      )}
      {user == null && (
        <a className={linkClass("/signup")} onClick={() => navigate("/signup")}>
          Signup
        </a>
      )}
      {user == null && (
        <a className={linkClass("/login")} onClick={() => navigate("/login")}>
          Login
        </a>
      )}
      {user != null && isAdmin && (
        <a className={linkClass("/admin")} onClick={() => openPath("/admin")}>
          Admin
        </a>
      )}
      {user != null && (
        <a className="nav-link" onClick={handleLogout}>
          Logout
        </a>
      )}
      <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
        {theme === "dark" ? "☀" : "☾"}
      </button>
    </nav>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="header">
      <a className="wordmark" onClick={() => navigate("/")}>
        <span className="wordmark-note">♪</span>Bandform
      </a>
      <div className="header-right">
        {user != null && <span className="header-greeting">Welcome, {user.name}</span>}
        <NavLinks />
      </div>
    </div>
  );
}
