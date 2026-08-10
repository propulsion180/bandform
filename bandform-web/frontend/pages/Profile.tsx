import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CHANGE_PASSWORD, UPDATE_USER } from "../graphql/mutations";
import { useAuth } from "../auth/AuthContext";
import TagInput from "../components/TagInput";
import { useNavigate } from "react-router-dom";
import { NOT_IN_BAND_STATUS_OPTIONS, IN_BAND_STATUS_OPTIONS } from "../constants/userStatus";
import { isStrongPassword, isValidEmail, PASSWORD_RULE, FIELD_MAX } from "../constants/validation";
import { UserStatus } from "../gql/graphql";

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [country, setCountry] = useState(user?.country ?? "");
  const [description, setDescription] = useState(user?.description ?? "");
  const [status, setStatus] = useState<UserStatus>(user?.status ?? "NOBANDSEL");
  const [genres, setGenres] = useState<string[]>((user?.genres.map((g) => g?.name).filter(Boolean) as string[]) ?? []);
  const [instruments, setInstruments] = useState<string[]>(
    (user?.instruments.map((i) => i?.name).filter(Boolean) as string[]) ?? []
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  const [updateUser, { loading: saving }] = useMutation(UPDATE_USER);
  const [changePassword, { loading: changingPassword }] = useMutation(CHANGE_PASSWORD);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setSaved(false);
    if (!isValidEmail(email)) {
      setErr("Please enter a valid email address.");
      return;
    }
    try {
      await updateUser({
        variables: { id: user.id, name, email, city, country, description, status, genres, instruments },
      });
      setUser({ ...user, name, email, city, country, description, status });
      setSaved(true);
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Could not save changes.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErr("");
    if (!isStrongPassword(newPassword)) {
      setPasswordErr(PASSWORD_RULE);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErr("Passwords do not match.");
      return;
    }
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
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={FIELD_MAX.name}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={FIELD_MAX.email}
            required
          />
        </div>
        <div>
          <label>City</label>
          <input
            className="form-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            maxLength={FIELD_MAX.city}
            required
          />
        </div>
        <div>
          <label>Country</label>
          <input
            className="form-input"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            maxLength={FIELD_MAX.country}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <input
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={FIELD_MAX.userDescription}
          />
        </div>
        <div>
          <label htmlFor="status">How do you want to be matched?</label>
          <select
            className="form-select"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStatus)}
          >
            {(user.bandMemberships.length === 0 ? NOT_IN_BAND_STATUS_OPTIONS : IN_BAND_STATUS_OPTIONS).map(
              (option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              )
            )}
          </select>
          <p className="field-hint">
            {(user.bandMemberships.length === 0 ? NOT_IN_BAND_STATUS_OPTIONS : IN_BAND_STATUS_OPTIONS).find(
              (option) => option.value === status
            )?.description}
          </p>
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
          <p className="field-hint">{PASSWORD_RULE}</p>
        </div>
        <div>
          <label>Confirm new password</label>
          <input
            className="form-input"
            type="password"
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {passwordErr && <p className="error-text">{passwordErr}</p>}
        <button type="submit" className="small-button secondary" disabled={changingPassword}>
          {changingPassword ? "Updating..." : "Change password"}
        </button>
      </form>
    </div>
  );
}
