import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CHANGE_PASSWORD, UPDATE_USER } from "../graphql/mutations";
import { useAuth } from "../auth/AuthContext";
import TagInput from "../components/TagInput";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [country, setCountry] = useState(user?.country ?? "");
  const [description, setDescription] = useState(user?.description ?? "");
  const [genres, setGenres] = useState<string[]>((user?.genres.map((g) => g?.name).filter(Boolean) as string[]) ?? []);
  const [instruments, setInstruments] = useState<string[]>(
    (user?.instruments.map((i) => i?.name).filter(Boolean) as string[]) ?? []
  );
  const [newPassword, setNewPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  const [updateUser, { loading: saving }] = useMutation(UPDATE_USER);
  const [changePassword, { loading: changingPassword }] = useMutation(CHANGE_PASSWORD);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setSaved(false);
    try {
      await updateUser({
        variables: { id: user.id, name, email, city, country, description, genres, instruments },
      });
      setUser({ ...user, name, email, city, country, description });
      setSaved(true);
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Could not save changes.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    await changePassword({ variables: { newPassword } });
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="form-container">
      <h2>Profile</h2>
      <span className={`badge ${user.status.startsWith("BAND") ? "badge-success" : "badge-accent"}`}>
        {user.status.startsWith("BAND") ? "In a band" : "Looking for a band"}
      </span>

      <form onSubmit={handleSave}>
        <div>
          <label>Name</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>City</label>
          <input className="form-input" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div>
          <label>Country</label>
          <input className="form-input" value={country} onChange={(e) => setCountry(e.target.value)} required />
        </div>
        <div>
          <label>Description</label>
          <input
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <TagInput label="Genres" values={genres} onChange={setGenres} placeholder="Type a genre, press Enter" />
        <TagInput
          label="Instruments"
          values={instruments}
          onChange={setInstruments}
          placeholder="Type an instrument, press Enter"
        />
        {err && <p className="error-text">{err}</p>}
        {saved && <p className="success-text">Saved.</p>}
        <button type="submit" className="small-button" disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>

      <hr className="hr-solid" />

      <h3>Change password</h3>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>New password</label>
          <input
            className="form-input"
            type="password"
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="small-button secondary" disabled={changingPassword}>
          {changingPassword ? "Updating..." : "Change password"}
        </button>
      </form>
    </div>
  );
}
