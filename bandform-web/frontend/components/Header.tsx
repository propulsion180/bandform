import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { LOGOUT } from "../graphql/mutations";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../hooks/useTheme";
import { useOpenPath } from "../windows/useOpenPath";

export function NavLinks() {
  const navigate = useNavigate();
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

  return (
    <div className="navButtonContainer">
      <a className="nav-button" onClick={() => navigate("/")}>
        Home
      </a>
      {user != null && (
        <a className="nav-button" onClick={() => openPath("/discover")}>
          Discover
        </a>
      )}
      {user != null && (
        <a className="nav-button" onClick={() => openPath("/requests")}>
          Requests
        </a>
      )}
      {user != null && (
        <a className="nav-button" onClick={() => openPath("/profile")}>
          Profile
        </a>
      )}
      {user == null && (
        <a className="nav-button" onClick={() => navigate("/signup")}>
          Signup
        </a>
      )}
      {user == null && (
        <a className="nav-button" onClick={() => navigate("/login")}>
          Login
        </a>
      )}
      {user != null && isAdmin && (
        <a className="nav-button" onClick={() => openPath("/admin")}>
          Admin
        </a>
      )}
      {user != null && (
        <a className="nav-button" onClick={handleLogout}>
          Logout
        </a>
      )}
      <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
        {theme === "dark" ? "☀" : "☾"}
      </button>
    </div>
  );
}

export default function Header() {
  const { user } = useAuth();

  return (
    <div className="header">
      {user == null && <h1>Bandform</h1>}
      {user != null && <h1>Welcome {user.name}</h1>}
      <NavLinks />
      <hr className="hr-solid" />
    </div>
  );
}
