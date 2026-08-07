import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { SIGNUP } from "../graphql/mutations";
import TagInput from "../components/TagInput";
import { NOT_IN_BAND_STATUS_OPTIONS } from "../constants/userStatus";
import { UserStatus } from "../gql/graphql";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [plainPassword, setPlainPassword] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<number>(18);
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [genres, setGenres] = useState<string[]>([]);
  const [instruments, setInstruments] = useState<string[]>([]);
  const [status, setStatus] = useState<UserStatus>("NOBANDSEL");
  const [err, setErr] = useState("");
  const [createUser, { loading }] = useMutation(SIGNUP);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    try {
      const response = await createUser({
        variables: {
          name,
          plainPassword,
          email,
          age,
          city,
          country,
          description,
          genres,
          instruments,
          status,
        },
      });

      if (response.data?.createUser.id != null) {
        navigate("/login", { state: { email } });
      }
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Could not create account.");
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Signup</h2>
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
            value={plainPassword}
            onChange={(e) => setPlainPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            className="form-input"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="age">Age</label>
          <input
            className="form-input"
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
            min={16}
            max={120}
            required
          />
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input
            className="form-input"
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input
            className="form-input"
            type="text"
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            className="form-input"
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
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
            {NOT_IN_BAND_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="field-hint">
            {NOT_IN_BAND_STATUS_OPTIONS.find((option) => option.value === status)?.description}
          </p>
        </div>
        <TagInput
          label="Genres you play"
          values={genres}
          onChange={setGenres}
          placeholder="Type a genre, press Enter"
        />
        <TagInput
          label="Instruments you play"
          values={instruments}
          onChange={setInstruments}
          placeholder="Type an instrument, press Enter"
        />

        {err && <p className="error-text">{err}</p>}
        <button type="submit" className="small-button" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
