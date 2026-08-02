import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApolloClient, useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { GET_BAND, GET_BAND_JOIN_REQUESTS, GET_RECOMMENDED_USERS } from "../graphql/queries";
import {
  ACCEPT_JOIN_REQUEST,
  CREATE_BAND_MEMBER,
  CREATE_BAND_POSITION,
  CREATE_JOIN_REQUEST,
  DELETE_BAND_MEMBER,
  REJECT_JOIN_REQUEST,
  UPDATE_BAND_POSITION,
} from "../graphql/mutations";
import { useAuth } from "../auth/AuthContext";

const statusBadgeClass: Record<string, string> = {
  PENDING: "badge-warning",
  ACCEPTED: "badge-success",
  REJECTED: "badge-danger",
};

export default function BandDetail() {
  const { id } = useParams<{ id: string }>();
  const client = useApolloClient();
  const { user } = useAuth();
  const [tab, setTab] = useState<"overview" | "manage">("overview");
  const [joinPositionId, setJoinPositionId] = useState<string | null>(null);
  const [joinMessage, setJoinMessage] = useState("");
  const [newPositionInstrument, setNewPositionInstrument] = useState("");
  const [newPositionDescription, setNewPositionDescription] = useState("");
  const [findMembersFor, setFindMembersFor] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [bandRole, setBandRole] = useState("");

  const { data, loading, refetch } = useQuery(GET_BAND, {
    variables: { id: id ?? "" },
    skip: !id,
  });

  const [loadJoinRequests, { data: jrData, refetch: refetchJoinRequests }] = useLazyQuery(
    GET_BAND_JOIN_REQUESTS
  );

  const { data: recommendedData, loading: recommendedLoading } = useQuery(GET_RECOMMENDED_USERS, {
    variables: {
      bp: findMembersFor ?? "",
      withinCity: false,
      withinCountry: true,
      sameGenre: true,
      singleInstrument: true,
      locGenreWeight: 0,
    },
    skip: !findMembersFor,
  });

  useEffect(() => {
    return () => {
      if (id) {
        client.cache.evict({ id: client.cache.identify({ __typename: "Band", id }) });
        client.cache.gc();
      }
    };
  }, [client, id]);

  const [createJoinRequest, { loading: joining }] = useMutation(CREATE_JOIN_REQUEST);
  const [createBandPosition] = useMutation(CREATE_BAND_POSITION);
  const [createBandMember] = useMutation(CREATE_BAND_MEMBER);
  const [updateBandPosition] = useMutation(UPDATE_BAND_POSITION);
  const [deleteBandMember] = useMutation(DELETE_BAND_MEMBER);
  const [acceptJoinRequest] = useMutation(ACCEPT_JOIN_REQUEST);
  const [rejectJoinRequest] = useMutation(REJECT_JOIN_REQUEST);

  if (!id) return null;
  if (loading) return <div className="page">Loading band...</div>;

  const band = data?.band;
  if (!band) return <div className="page empty-state">Band not found.</div>;

  const isMember = band.members.some((m) => m?.user.id === user?.id);
  const myInstruments = user?.instruments.map((i) => i?.name).filter(Boolean) as string[] | undefined;

  const handleOpenManage = () => {
    setTab("manage");
    loadJoinRequests({ variables: { bID: id } });
  };

  const handleJoinRequest = async (positionId: string) => {
    if (!user) return;
    await createJoinRequest({
      variables: {
        uID: user.id,
        bID: band.id,
        bpId: positionId,
        interestedInstruments: myInstruments,
        message: joinMessage,
      },
    });
    setJoinPositionId(null);
    setJoinMessage("");
    refetch();
  };

  const handleCreatePosition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPositionInstrument.trim()) return;
    await createBandPosition({
      variables: {
        bandId: band.id,
        instrumentName: newPositionInstrument,
        description: newPositionDescription,
      },
    });
    setNewPositionInstrument("");
    setNewPositionDescription("");
    refetch();
  };

  const handleAddCandidate = async (positionId: string, instrumentName: string, candidateId: string) => {
    await createBandMember({
      variables: { bID: band.id, uID: candidateId, instrumentNames: [instrumentName], role: instrumentName },
    });
    await updateBandPosition({ variables: { bpId: positionId, filled: true } });
    setFindMembersFor(null);
    refetch();
  };

  const handleAccept = async (requestId: string) => {
    if (!bandRole.trim()) return;
    await acceptJoinRequest({ variables: { id: requestId, bandRole } });
    setAcceptingId(null);
    setBandRole("");
    refetch();
    refetchJoinRequests();
  };

  const handleReject = async (requestId: string) => {
    await rejectJoinRequest({ variables: { id: requestId } });
    refetchJoinRequests();
  };

  return (
    <div className="page">
      <h2>{band.name}</h2>
      <p>
        {band.city}, {band.country}
      </p>
      <div className="chip-row">
        {band.genres.map((g) => g && <span key={g.name} className="chip">{g.name}</span>)}
      </div>
      <p>{band.description}</p>

      <div className="tab-row">
        <button
          className={`tab-button ${tab === "overview" ? "active" : ""}`}
          onClick={() => setTab("overview")}
        >
          Overview
        </button>
        {isMember && (
          <button
            className={`tab-button ${tab === "manage" ? "active" : ""}`}
            onClick={handleOpenManage}
          >
            Manage
          </button>
        )}
      </div>

      {tab === "overview" && (
        <>
          <div className="section-title">Members</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Instruments</th>
              </tr>
            </thead>
            <tbody>
              {band.members.map((m) => (
                <tr key={m?.id}>
                  <td>{m?.user.name}</td>
                  <td>{m?.role}</td>
                  <td>{m?.instruments?.map((i) => i?.name).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="section-title">Open positions</div>
          {band.openPositions.filter((p) => p && !p.filled).length === 0 && (
            <p className="empty-state">No open positions right now.</p>
          )}
          {band.openPositions
            .filter((p) => p && !p.filled)
            .map((position) => (
              <div key={position!.id} className="card" style={{ marginBottom: "var(--space-2)" }}>
                <strong>{position!.instrument.name}</strong>
                <p>{position!.description}</p>
                {isMember ? (
                  <span className="badge badge-muted">You're already in this band</span>
                ) : joinPositionId === position!.id ? (
                  <div>
                    <textarea
                      className="form-input"
                      placeholder="Message to the band (optional)"
                      value={joinMessage}
                      onChange={(e) => setJoinMessage(e.target.value)}
                    />
                    <div className="navButtonContainer">
                      <a
                        className="small-button"
                        onClick={() => handleJoinRequest(position!.id)}
                      >
                        {joining ? "Sending..." : "Send request"}
                      </a>
                      <a className="small-button secondary" onClick={() => setJoinPositionId(null)}>
                        Cancel
                      </a>
                    </div>
                  </div>
                ) : (
                  <a className="small-button" onClick={() => setJoinPositionId(position!.id)}>
                    Request to join
                  </a>
                )}
              </div>
            ))}
        </>
      )}

      {tab === "manage" && isMember && (
        <>
          <div className="section-title">Open positions</div>
          {band.openPositions.map((position) => (
            <div key={position!.id} className="card" style={{ marginBottom: "var(--space-2)" }}>
              <strong>{position!.instrument.name}</strong>{" "}
              <span className={`badge ${position!.filled ? "badge-success" : "badge-accent"}`}>
                {position!.filled ? "filled" : "open"}
              </span>
              <p>{position!.description}</p>
              {!position!.filled && (
                <a
                  className="small-button secondary"
                  onClick={() =>
                    setFindMembersFor(findMembersFor === position!.id ? null : position!.id)
                  }
                >
                  Find members
                </a>
              )}
              {findMembersFor === position!.id && (
                <div>
                  {recommendedLoading && <p className="empty-state">Searching...</p>}
                  {recommendedData?.recommendUser.map((candidate) => (
                    <div key={candidate.id} className="card" style={{ marginTop: "var(--space-2)" }}>
                      <strong>{candidate.name}</strong> -- {candidate.city}, {candidate.country}
                      <div className="chip-row">
                        {candidate.instruments.map((i) => i && <span key={i.name} className="chip">{i.name}</span>)}
                      </div>
                      <a
                        className="small-button"
                        onClick={() =>
                          handleAddCandidate(position!.id, position!.instrument.name ?? "", candidate.id)
                        }
                      >
                        Add to band
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <form onSubmit={handleCreatePosition} className="card">
            <label>Open a new position</label>
            <input
              className="form-input"
              placeholder="Instrument"
              value={newPositionInstrument}
              onChange={(e) => setNewPositionInstrument(e.target.value)}
            />
            <input
              className="form-input"
              placeholder="Description"
              value={newPositionDescription}
              onChange={(e) => setNewPositionDescription(e.target.value)}
            />
            <button type="submit" className="small-button">
              Add position
            </button>
          </form>

          <div className="section-title">Join requests</div>
          {(jrData?.bandJoinRequests?.length ?? 0) === 0 && (
            <p className="empty-state">No join requests yet.</p>
          )}
          {jrData?.bandJoinRequests?.map((request) => {
            const requestId = request?.id;
            if (!request || !requestId) return null;
            return (
              <div key={requestId} className="card" style={{ marginBottom: "var(--space-2)" }}>
                <strong>{request.user?.name}</strong>{" "}
                <span className={`badge ${statusBadgeClass[request.status ?? "PENDING"]}`}>
                  {request.status}
                </span>
                <p>{request.message}</p>
                <div className="chip-row">
                  {request.interestedInstruments?.map((i) => i && <span key={i.name} className="chip">{i.name}</span>)}
                </div>
                {request.status === "PENDING" && (
                  <>
                    {acceptingId === requestId ? (
                      <div className="navButtonContainer">
                        <input
                          className="form-input"
                          placeholder="Role in the band"
                          value={bandRole}
                          onChange={(e) => setBandRole(e.target.value)}
                        />
                        <a className="small-button" onClick={() => handleAccept(requestId)}>
                          Confirm
                        </a>
                      </div>
                    ) : (
                      <div className="navButtonContainer">
                        <a className="small-button" onClick={() => setAcceptingId(requestId)}>
                          Accept
                        </a>
                        <a className="small-button danger" onClick={() => handleReject(requestId)}>
                          Reject
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}

          <div className="section-title">Members</div>
          {band.members.map((m) => (
            <div key={m?.id} className="navButtonContainer">
              <span>
                {m?.user.name} -- {m?.role}
              </span>
              <a
                className="small-button danger"
                onClick={async () => {
                  await deleteBandMember({ variables: { bmID: m!.id } });
                  refetch();
                }}
              >
                Remove
              </a>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
