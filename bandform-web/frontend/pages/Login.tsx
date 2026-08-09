import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { LOGIN } from "../graphql/mutations";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const location = useLocation() as { state?: { email?: string } };
  const { refreshUser } = useAuth();

  const [login, { loading }] = useMutation(LOGIN);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      const result = await login({ variables: { name, password } });
      if (result.data?.login.user) {
        await refreshUser();
        navigate("/");
      }
    } catch (error) {
      setErr("Invalid username or password.");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {location.state?.email && (
        <p className="success-text">Account created. Log in to continue.</p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            className="form-input"
            type="text"
            id="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            className="form-input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {err && <p className="error-text">{err}</p>}
        <button type="submit" className="small-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
