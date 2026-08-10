import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { useAuth } from "../auth/AuthContext";
import { GET_RECOMMENDED_BANDS, GET_USER_JOIN_REQUESTS } from "../graphql/queries";
import { useOpenBandWindow } from "../windows/WindowManagerContext";
import { useOpenPath } from "../windows/useOpenPath";

export function YourBandsWidget() {
  const { user } = useAuth();
  const openBand = useOpenBandWindow();
  if (!user) return null;

  return (
    <>
      {user.bandMemberships.length === 0 && <p className="empty-state">You're not in a band yet.</p>}
      <div className="card-grid">
        {user.bandMemberships.map((membership) =>
          membership?.band ? (
            <Link
              key={membership.id}
              to={`/band/${membership.band.id}`}
              className="card card-link"
              onClick={() => openBand(membership.band!.id)}
            >
              <strong>{membership.band.name}</strong>
              <div className="chip-row">
                <span className="chip">{membership.role}</span>
              </div>
            </Link>
          ) : null
        )}
      </div>
    </>
  );
}

export function RecommendedBandsWidget() {
  const { user } = useAuth();
  const openBand = useOpenBandWindow();
  const { data, loading } = useQuery(GET_RECOMMENDED_BANDS, {
    variables: { withinCity: false, withinCountry: true, sameGenre: true, locGenreWeight: 0 },
    skip: !user,
  });

  return (
    <>
      {loading && <p className="empty-state">Loading recommendations...</p>}
      {!loading && (data?.recommendBand.length ?? 0) === 0 && (
        <p className="empty-state">No recommendations yet -- try Discover instead.</p>
      )}
      <div className="card-grid">
        {data?.recommendBand.slice(0, 3).map((band) => (
          <Link key={band.id} to={`/band/${band.id}`} className="card card-link" onClick={() => openBand(band.id)}>
            <strong>{band.name}</strong>
            <p>
              {band.city}, {band.country}
            </p>
            <div className="chip-row">
              {band.genres.map((g) => g && <span key={g.name} className="chip">{g.name}</span>)}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export function RequestsWidget() {
  const { user } = useAuth();
  const openPath = useOpenPath();
  const { data } = useQuery(GET_USER_JOIN_REQUESTS, {
    variables: { uID: user?.id ?? "" },
    skip: !user,
  });
  const pendingCount = data?.userJoinRequests?.filter((r) => r?.status === "PENDING").length ?? 0;

  return (
    <div className="navButtonContainer widget-actions">
      <a className="small-button" onClick={() => openPath("/create-band")}>
        Create a band
      </a>
      <a className="small-button secondary" onClick={() => openPath("/discover")}>
        Discover bands
      </a>
      <a className="small-button secondary" onClick={() => openPath("/requests")}>
        {pendingCount > 0 ? `${pendingCount} pending request${pendingCount === 1 ? "" : "s"}` : "Your requests"}
      </a>
    </div>
  );
}
