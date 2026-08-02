import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_BAND_JOIN_REQUESTS, GET_USER_JOIN_REQUESTS } from "../graphql/queries";
import { ACCEPT_JOIN_REQUEST, REJECT_JOIN_REQUEST } from "../graphql/mutations";
import { useAuth } from "../auth/AuthContext";

const statusBadgeClass: Record<string, string> = {
  PENDING: "badge-warning",
  ACCEPTED: "badge-success",
  REJECTED: "badge-danger",
};

function ReceivedForBand({ bandId, bandName }: { bandId: string; bandName: string }) {
  const { data, refetch } = useQuery(GET_BAND_JOIN_REQUESTS, { variables: { bID: bandId } });
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [bandRole, setBandRole] = useState("");
  const [acceptJoinRequest] = useMutation(ACCEPT_JOIN_REQUEST);
  const [rejectJoinRequest] = useMutation(REJECT_JOIN_REQUEST);

  const pending = data?.bandJoinRequests?.filter((r) => r?.status === "PENDING" && !r?.invitedByBand) ?? [];
  if (pending.length === 0) return null;

  return (
    <>
      <div className="section-title">{bandName}</div>
      {pending.map((request) =>
        request ? (
          <div key={request.id} className="card" style={{ marginBottom: "var(--space-2)" }}>
            <strong>{request.user.name}</strong>{" "}
            <span className={`badge ${statusBadgeClass[request.status]}`}>{request.status}</span>
            <p>{request.message}</p>
            {acceptingId === request.id ? (
              <div className="navButtonContainer">
                <input
                  className="form-input"
                  placeholder="Role in the band"
                  value={bandRole}
                  onChange={(e) => setBandRole(e.target.value)}
                />
                <a
                  className="small-button"
                  onClick={async () => {
                    if (!bandRole.trim()) return;
                    await acceptJoinRequest({ variables: { id: request.id, bandRole } });
                    setAcceptingId(null);
                    setBandRole("");
                    refetch();
                  }}
                >
                  Confirm
                </a>
              </div>
            ) : (
              <div className="navButtonContainer">
                <a className="small-button" onClick={() => setAcceptingId(request.id)}>
                  Accept
                </a>
                <a
                  className="small-button danger"
                  onClick={async () => {
                    await rejectJoinRequest({ variables: { id: request.id } });
                    refetch();
                  }}
                >
                  Reject
                </a>
              </div>
            )}
          </div>
        ) : null
      )}
    </>
  );
}

export default function Requests() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"requests" | "invitations" | "managing">("requests");

  const { data } = useQuery(GET_USER_JOIN_REQUESTS, {
    variables: { uID: user?.id ?? "" },
    skip: !user,
  });

  const [acceptJoinRequest] = useMutation(ACCEPT_JOIN_REQUEST);
  const [rejectJoinRequest] = useMutation(REJECT_JOIN_REQUEST);

  if (!user) return null;

  const myRequests = data?.userJoinRequests?.filter((r) => r && !r.invitedByBand) ?? [];
  const myInvitations = data?.userJoinRequests?.filter((r) => r && r.invitedByBand) ?? [];
  const ownedBands = user.bandMemberships.filter((m) => m?.band?.owner?.id === user.id);

  return (
    <div className="page">
      <div className="tab-row">
        <button className={`tab-button ${tab === "requests" ? "active" : ""}`} onClick={() => setTab("requests")}>
          My Requests
        </button>
        <button
          className={`tab-button ${tab === "invitations" ? "active" : ""}`}
          onClick={() => setTab("invitations")}
        >
          My Invitations
        </button>
        {ownedBands.length > 0 && (
          <button
            className={`tab-button ${tab === "managing" ? "active" : ""}`}
            onClick={() => setTab("managing")}
          >
            Managing
          </button>
        )}
      </div>

      {tab === "requests" && (
        <>
          {myRequests.length === 0 && (
            <p className="empty-state">You haven't requested to join any bands yet.</p>
          )}
          {myRequests.map((request) =>
            request ? (
              <div key={request.id} className="card" style={{ marginBottom: "var(--space-2)" }}>
                <Link to={`/band/${request.band.id}`}>
                  <strong>{request.band.name}</strong>
                </Link>{" "}
                <span className={`badge ${statusBadgeClass[request.status]}`}>{request.status}</span>
                <p>{request.message}</p>
              </div>
            ) : null
          )}
        </>
      )}

      {tab === "invitations" && (
        <>
          {myInvitations.length === 0 && <p className="empty-state">No invitations yet.</p>}
          {myInvitations.map((request) =>
            request ? (
              <div key={request.id} className="card" style={{ marginBottom: "var(--space-2)" }}>
                <Link to={`/band/${request.band.id}`}>
                  <strong>{request.band.name}</strong>
                </Link>{" "}
                invited you{request.proposedRole ? ` as ${request.proposedRole}` : ""}{" "}
                <span className={`badge ${statusBadgeClass[request.status]}`}>{request.status}</span>
                <p>{request.message}</p>
                {request.status === "PENDING" && (
                  <div className="navButtonContainer">
                    <a
                      className="small-button"
                      onClick={async () => {
                        await acceptJoinRequest({ variables: { id: request.id } });
                      }}
                    >
                      Accept
                    </a>
                    <a
                      className="small-button danger"
                      onClick={async () => {
                        await rejectJoinRequest({ variables: { id: request.id } });
                      }}
                    >
                      Decline
                    </a>
                  </div>
                )}
              </div>
            ) : null
          )}
        </>
      )}

      {tab === "managing" && (
        <>
          {ownedBands.length === 0 && (
            <p className="empty-state">You're not managing any bands yet.</p>
          )}
          {ownedBands.map((membership) =>
            membership?.band ? (
              <ReceivedForBand key={membership.band.id} bandId={membership.band.id} bandName={membership.band.name} />
            ) : null
          )}
        </>
      )}
    </div>
  );
}
