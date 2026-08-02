import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { LOGOUT } from "../graphql/mutations";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../hooks/useTheme";

export default function Header() {
  const navigate = useNavigate();
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
    <div className="header">
      {user == null && <h1>Bandform</h1>}
      {user != null && <h1>Welcome {user.name}</h1>}
      <div className="navButtonContainer">
        <a className="nav-button" onClick={() => navigate("/")}>
          Home
        </a>
        {user != null && (
          <a className="nav-button" onClick={() => navigate("/discover")}>
            Discover
          </a>
        )}
        {user != null && (
          <a className="nav-button" onClick={() => navigate("/requests")}>
            Requests
          </a>
        )}
        {user != null && (
          <a className="nav-button" onClick={() => navigate("/profile")}>
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
          <a className="nav-button" onClick={() => navigate("/admin")}>
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
      <hr className="hr-solid" />
    </div>
  );
}
