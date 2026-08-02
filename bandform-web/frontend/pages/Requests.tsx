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

  const pending = data?.bandJoinRequests?.filter((r) => r?.status === "PENDING") ?? [];
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
  const [tab, setTab] = useState<"sent" | "received">("sent");

  const { data: sentData } = useQuery(GET_USER_JOIN_REQUESTS, {
    variables: { uID: user?.id ?? "" },
    skip: !user || tab !== "sent",
  });

  if (!user) return null;

  return (
    <div className="page">
      <div className="tab-row">
        <button className={`tab-button ${tab === "sent" ? "active" : ""}`} onClick={() => setTab("sent")}>
          Sent
        </button>
        <button
          className={`tab-button ${tab === "received" ? "active" : ""}`}
          onClick={() => setTab("received")}
        >
          Received
        </button>
      </div>

      {tab === "sent" && (
        <>
          {(sentData?.userJoinRequests?.length ?? 0) === 0 && (
            <p className="empty-state">You haven't requested to join any bands yet.</p>
          )}
          {sentData?.userJoinRequests?.map((request) =>
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

      {tab === "received" && (
        <>
          {user.bandMemberships.length === 0 && (
            <p className="empty-state">You're not managing any bands yet.</p>
          )}
          {user.bandMemberships.map((membership) =>
            membership?.band ? (
              <ReceivedForBand key={membership.band.id} bandId={membership.band.id} bandName={membership.band.name} />
            ) : null
          )}
        </>
      )}
    </div>
  );
}
