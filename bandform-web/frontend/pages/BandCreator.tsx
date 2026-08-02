import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { CREATE_BAND, CREATE_BAND_MEMBER, CREATE_RANDOMIZED_BAND } from "../graphql/mutations";
import { useAuth } from "../auth/AuthContext";
import TagInput from "../components/TagInput";

export default function BandCreator() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"choose" | "manual" | "auto">("choose");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState(user?.city ?? "");
  const [country, setCountry] = useState(user?.country ?? "");
  const [genres, setGenres] = useState<string[]>([]);
  const [instruments, setInstruments] = useState<string[]>([]);
  const [yourInstrument, setYourInstrument] = useState("");
  const [yourRole, setYourRole] = useState("");
  const [searchDepth, setSearchDepth] = useState(3);
  const [result, setResult] = useState<{ id: string; members: number; open: number } | null>(null);

  const [createBand, { loading: creatingManual }] = useMutation(CREATE_BAND);
  const [createBandMember] = useMutation(CREATE_BAND_MEMBER);
  const [createRandomizedBand, { loading: creatingAuto }] = useMutation(CREATE_RANDOMIZED_BAND);

  if (!user) return null;

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await createBand({ variables: { name, description, city, country, genres } });
    const bandId = response.data?.createBand.id;
    if (bandId) {
      await createBandMember({
        variables: {
          bID: bandId,
          uID: user.id,
          instrumentNames: yourInstrument ? [yourInstrument] : [],
          role: yourRole || yourInstrument,
        },
      });
      navigate(`/band/${bandId}`);
    }
  };

  const handleAutoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await createRandomizedBand({
      variables: {
        yourUID: user.id,
        yourInstrument,
        yourRole: yourRole || null,
        name,
        instruments,
        city,
        country,
        genres,
        description,
        instrumentSearchDepth: searchDepth,
      },
    });
    if (response.data?.randomizedBandCreator) {
      const band = response.data.randomizedBandCreator;
      setResult({ id: band.id, members: band.members.length, open: band.openPositions.length });
    }
  };

  if (result) {
    return (
      <div className="page">
        <div className="card">
          <h2>Band created!</h2>
          <p>
            {result.members} member{result.members === 1 ? "" : "s"} auto-added, {result.open} position
            {result.open === 1 ? "" : "s"} still open.
          </p>
          <a className="small-button" onClick={() => navigate(`/band/${result.id}`)}>
            Go to your band
          </a>
        </div>
      </div>
    );
  }

  if (mode === "choose") {
    return (
      <div className="page">
        <h2>Create a band</h2>
        <div className="card-grid">
          <div className="card">
            <h3>Manual</h3>
            <p>Create the band yourself, then invite or accept members one at a time.</p>
            <a className="small-button" onClick={() => setMode("manual")}>
              Start manually
            </a>
          </div>
          <div className="card">
            <h3>Automatic</h3>
            <p>Tell us the instruments and genres you want -- we'll assemble a band from musicians open to joining.</p>
            <a className="small-button" onClick={() => setMode("auto")}>
              Start automatic
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>{mode === "manual" ? "Create a band" : "Automatic band creator"}</h2>
      <form onSubmit={mode === "manual" ? handleManualSubmit : handleAutoSubmit}>
        <div>
          <label>Band name</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Description</label>
          <input
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
        <TagInput label="Genres" values={genres} onChange={setGenres} placeholder="Type a genre, press Enter" />

        <div>
          <label>Instrument you'll play</label>
          <input
            className="form-input"
            value={yourInstrument}
            onChange={(e) => setYourInstrument(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Your role (optional)</label>
          <input className="form-input" value={yourRole} onChange={(e) => setYourRole(e.target.value)} />
        </div>

        {mode === "manual" && (
          <button type="submit" className="small-button" disabled={creatingManual}>
            {creatingManual ? "Creating..." : "Create band"}
          </button>
        )}

        {mode === "auto" && (
          <>
            <TagInput
              label="Instruments you still need"
              values={instruments}
              onChange={setInstruments}
              placeholder="Type an instrument, press Enter"
            />
            <div>
              <label>How many candidates to consider per instrument</label>
              <input
                className="form-input"
                type="number"
                min={1}
                max={10}
                value={searchDepth}
                onChange={(e) => setSearchDepth(parseInt(e.target.value, 10) || 1)}
              />
            </div>
            <button type="submit" className="small-button" disabled={creatingAuto}>
              {creatingAuto ? "Assembling band..." : "Create band automatically"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
