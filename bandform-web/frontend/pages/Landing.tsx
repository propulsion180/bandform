import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="card" style={{ textAlign: "center", padding: "var(--space-6)" }}>
        <h1>Find your band. Or build one.</h1>
        <p className="section-title" style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>
          Bandform matches musicians by instrument, genre, and location --
          browse bands looking for members, or let us auto-assemble a band
          around the sound you're going for.
        </p>
        <div className="navButtonContainer" style={{ justifyContent: "center" }}>
          <a className="small-button" onClick={() => navigate("/signup")}>
            Sign up
          </a>
          <a className="small-button secondary" onClick={() => navigate("/login")}>
            Log in
          </a>
        </div>
      </div>

      <div className="card-grid">
        <div className="card">
          <h3>Find a band</h3>
          <p>Browse open bands by genre, instrument, and location, then request to join.</p>
        </div>
        <div className="card">
          <h3>Start a band</h3>
          <p>Create a band, open positions for the instruments you need, and manage requests.</p>
        </div>
        <div className="card">
          <h3>Auto-match</h3>
          <p>Tell us the instruments and genres you want -- we'll assemble a band from musicians open to joining.</p>
        </div>
      </div>
    </div>
  );
}
