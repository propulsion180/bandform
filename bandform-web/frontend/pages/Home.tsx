import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { useAuth } from "../auth/AuthContext";
import { GET_RECOMMENDED_BANDS, GET_USER_JOIN_REQUESTS } from "../graphql/queries";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: recData, loading: recLoading } = useQuery(GET_RECOMMENDED_BANDS, {
    variables: { withinCity: false, withinCountry: true, sameGenre: true, locGenreWeight: 0 },
    skip: !user,
  });

  const { data: reqData } = useQuery(GET_USER_JOIN_REQUESTS, {
    variables: { uID: user?.id ?? "" },
    skip: !user,
  });

  if (!user) {
    return null;
  }

  const pendingCount = reqData?.userJoinRequests?.filter((r) => r?.status === "PENDING").length ?? 0;

  return (
    <div className="page">
      <div className="section-title">Your bands</div>
      {user.bandMemberships.length === 0 && (
        <p className="empty-state">You're not in a band yet.</p>
      )}
      <div className="card-grid">
        {user.bandMemberships.map((membership) =>
          membership?.band ? (
            <Link key={membership.id} to={`/band/${membership.band.id}`} className="card card-link">
              <strong>{membership.band.name}</strong>
              <div className="chip-row">
                <span className="chip">{membership.role}</span>
              </div>
            </Link>
          ) : null
        )}
      </div>

      <div className="navButtonContainer">
        <a className="small-button" onClick={() => navigate("/create-band")}>
          Create a band
        </a>
        <a className="small-button secondary" onClick={() => navigate("/discover")}>
          Discover bands
        </a>
        <a className="small-button secondary" onClick={() => navigate("/requests")}>
          {pendingCount > 0 ? `${pendingCount} pending request${pendingCount === 1 ? "" : "s"}` : "Your requests"}
        </a>
      </div>

      <div className="section-title">Recommended for you</div>
      {recLoading && <p className="empty-state">Loading recommendations...</p>}
      {!recLoading && (recData?.recommendBand.length ?? 0) === 0 && (
        <p className="empty-state">No recommendations yet -- try Discover instead.</p>
      )}
      <div className="card-grid">
        {recData?.recommendBand.slice(0, 3).map((band) => (
          <Link key={band.id} to={`/band/${band.id}`} className="card card-link">
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
    </div>
  );
}
