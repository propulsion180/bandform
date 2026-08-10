import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { GET_ADMIN_BANDS, GET_ADMIN_USERS } from "../graphql/queries";
import { ADMIN_RESET_PASSWORD, DELETE_BAND, DELETE_USER, UNLOCK_USER } from "../graphql/mutations";

export default function Admin() {
  const [tab, setTab] = useState<"users" | "bands">("users");
  const [userFilter, setUserFilter] = useState("");
  const [bandFilter, setBandFilter] = useState("");

  const [loadUsers, { data: usersData, loading: usersLoading, refetch: refetchUsers }] =
    useLazyQuery(GET_ADMIN_USERS, { fetchPolicy: "cache-and-network" });
  const [loadBands, { data: bandsData, loading: bandsLoading, refetch: refetchBands }] =
    useLazyQuery(GET_ADMIN_BANDS, { fetchPolicy: "cache-and-network" });

  const [deleteUser] = useMutation(DELETE_USER);
  const [unlockUser] = useMutation(UNLOCK_USER);
  const [adminResetPassword] = useMutation(ADMIN_RESET_PASSWORD);
  const [deleteBand] = useMutation(DELETE_BAND);
  const [resetResult, setResetResult] = useState<{ id: string; password: string } | null>(null);

  const selectTab = (next: "users" | "bands") => {
    setTab(next);
    if (next === "users" && !usersData) loadUsers();
    if (next === "bands" && !bandsData) loadBands();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = (usersData?.users ?? []).filter((u) =>
    u.name.toLowerCase().includes(userFilter.toLowerCase())
  );
  const filteredBands = (bandsData?.bands ?? []).filter((b) =>
    b.name.toLowerCase().includes(bandFilter.toLowerCase())
  );

  return (
    <div className="page">
      <h2>Admin</h2>
      <div className="tab-row">
        <button className={`tab-button ${tab === "users" ? "active" : ""}`} onClick={() => selectTab("users")}>
          Users
        </button>
        <button className={`tab-button ${tab === "bands" ? "active" : ""}`} onClick={() => selectTab("bands")}>
          Bands
        </button>
      </div>

      {tab === "users" && (
        <>
          <input
            className="form-input"
            placeholder="Filter users"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          />
          {usersLoading && <p className="empty-state">Loading users...</p>}
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Location</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    {u.city}, {u.country}
                  </td>
                  <td>
                    {u.locked ? <span className="badge badge-danger">Locked</span> : "Active"}
                  </td>
                  <td>
                    <div className="table-actions">
                      {u.locked && (
                        <a
                          className="small-button secondary"
                          onClick={async () => {
                            await unlockUser({ variables: { id: u.id } });
                            refetchUsers();
                          }}
                        >
                          Unlock
                        </a>
                      )}
                      <a
                        className="small-button secondary"
                        onClick={async () => {
                          setResetResult(null);
                          const res = await adminResetPassword({ variables: { id: u.id } });
                          const password = res.data?.adminResetPassword;
                          if (password) {
                            setResetResult({ id: u.id, password });
                          }
                        }}
                      >
                        Reset password
                      </a>
                      <a
                        className="small-button danger"
                        onClick={async () => {
                          await deleteUser({ variables: { id: u.id } });
                          refetchUsers();
                        }}
                      >
                        Delete
                      </a>
                    </div>
                    {resetResult?.id === u.id && (
                      <p className="success-text">
                        Temp password: <strong>{resetResult.password}</strong> — share it with the
                        user; they'll need to log in with it. Shown once.
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === "bands" && (
        <>
          <input
            className="form-input"
            placeholder="Filter bands"
            value={bandFilter}
            onChange={(e) => setBandFilter(e.target.value)}
          />
          {bandsLoading && <p className="empty-state">Loading bands...</p>}
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredBands.map((b) => (
                <tr key={b.id}>
                  <td>{b.name}</td>
                  <td>
                    {b.city}, {b.country}
                  </td>
                  <td>
                    <a
                      className="small-button danger"
                      onClick={async () => {
                        await deleteBand({ variables: { id: b.id } });
                        refetchBands();
                      }}
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
