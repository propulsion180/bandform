import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApolloClient, useQuery } from "@apollo/client/react";
import { GET_BANDS, GET_RECOMMENDED_BANDS } from "../graphql/queries";

const PAGE_SIZE = 12;

export default function Discover() {
  const client = useApolloClient();
  const [tab, setTab] = useState<"bands" | "recommended">("bands");
  const [filter, setFilter] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const { data: bandsData, loading: bandsLoading } = useQuery(GET_BANDS, {
    skip: tab !== "bands",
    fetchPolicy: "cache-first",
  });

  const { data: recData, loading: recLoading } = useQuery(GET_RECOMMENDED_BANDS, {
    variables: { withinCity: false, withinCountry: true, sameGenre: true, locGenreWeight: 0 },
    skip: tab !== "recommended",
    fetchPolicy: "cache-first",
  });

  useEffect(() => {
    return () => {
      client.cache.evict({ fieldName: "bands" });
      client.cache.evict({ fieldName: "recommendBand" });
      client.cache.gc();
    };
  }, [client]);

  const bands = tab === "bands" ? bandsData?.bands ?? [] : recData?.recommendBand ?? [];
  const loading = tab === "bands" ? bandsLoading : recLoading;

  const filtered = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    if (!needle) return bands;
    return bands.filter(
      (b) =>
        b.name.toLowerCase().includes(needle) ||
        b.city?.toLowerCase().includes(needle) ||
        b.genres.some((g) => g?.name?.toLowerCase().includes(needle))
    );
  }, [bands, filter]);

  return (
    <div className="page">
      <div className="tab-row">
        <button
          className={`tab-button ${tab === "bands" ? "active" : ""}`}
          onClick={() => {
            setTab("bands");
            setVisible(PAGE_SIZE);
          }}
        >
          All bands
        </button>
        <button
          className={`tab-button ${tab === "recommended" ? "active" : ""}`}
          onClick={() => {
            setTab("recommended");
            setVisible(PAGE_SIZE);
          }}
        >
          Recommended for you
        </button>
      </div>

      <input
        className="form-input"
        placeholder="Filter by name, city, or genre"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {loading && <p className="empty-state">Loading bands...</p>}
      {!loading && filtered.length === 0 && <p className="empty-state">No bands found.</p>}

      <div className="card-grid">
        {filtered.slice(0, visible).map((band) => (
          <Link key={band.id} to={`/band/${band.id}`} className="card card-link">
            <strong>{band.name}</strong>
            <p>
              {band.city}, {band.country}
            </p>
            <div className="chip-row">
              {band.genres.map((g) => g && <span key={g.name} className="chip">{g.name}</span>)}
            </div>
            <span className="badge badge-accent">
              {band.openPositions.filter((p) => p && !p.filled).length} open position
              {band.openPositions.filter((p) => p && !p.filled).length === 1 ? "" : "s"}
            </span>
          </Link>
        ))}
      </div>

      {visible < filtered.length && (
        <div className="navButtonContainer">
          <a className="small-button secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Load more
          </a>
        </div>
      )}
    </div>
  );
}
