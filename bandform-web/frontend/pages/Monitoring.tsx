import React from "react";
import { useQuery } from "@apollo/client/react";
import { SYSTEM_METRICS } from "../graphql/queries";

function bytes(n: number): string {
  if (n <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(n) / Math.log(1024)));
  return `${(n / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function pct(load: number): string {
  return load < 0 ? "n/a" : `${(load * 100).toFixed(1)}%`;
}

function duration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s % 60}s`;
}

function Metric({ value, label, sub }: { value: React.ReactNode; label: string; sub?: string }) {
  return (
    <div className="metric-card">
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}

export default function Monitoring() {
  const { data, loading, error } = useQuery(SYSTEM_METRICS, { pollInterval: 5000 });

  if (loading && !data) return <div className="page"><p className="empty-state">Loading metrics...</p></div>;
  if (error) return <div className="page"><p className="error-text">Could not load metrics: {error.message}</p></div>;
  if (!data) return null;

  const m = data.systemMetrics;
  const errorRate = m.graphqlRequests > 0 ? (m.graphqlErrors / m.graphqlRequests) * 100 : 0;

  return (
    <div className="page">
      <h2>Monitoring</h2>
      <p className="metric-sub">Auto-refreshing every 5s.</p>

      <h3 className="section-title">System &amp; JVM</h3>
      <div className="metric-grid">
        <Metric value={pct(m.systemCpuLoad)} label="System CPU" sub={`${m.availableProcessors} cores`} />
        <Metric value={pct(m.processCpuLoad)} label="Process CPU" />
        <Metric value={`${bytes(m.heapUsed)}`} label="Heap used" sub={`of ${bytes(m.heapMax)}`} />
        <Metric value={bytes(m.nonHeapUsed)} label="Non-heap used" />
        <Metric
          value={bytes(m.systemMemoryTotal - m.systemMemoryFree)}
          label="System memory"
          sub={`of ${bytes(m.systemMemoryTotal)}`}
        />
        <Metric value={bytes(m.diskFree)} label="Disk free" sub={`of ${bytes(m.diskTotal)}`} />
        <Metric value={m.threadCount} label="Threads" sub={`peak ${m.peakThreadCount}, ${m.daemonThreadCount} daemon`} />
        <Metric value={m.gcCount} label="GC collections" sub={`${m.gcTimeMs} ms total`} />
        <Metric value={duration(m.uptimeMs)} label="Uptime" sub={`since ${new Date(m.startTime).toLocaleString()}`} />
      </div>

      <h3 className="section-title">Database</h3>
      <div className="metric-grid">
        <Metric
          value={m.dbReachable ? "Up" : "Down"}
          label="Reachability"
        />
        <Metric value={m.dbPoolActive ?? "-"} label="Pool active" sub={`max ${m.dbPoolMax ?? "-"}`} />
        <Metric value={m.dbPoolIdle ?? "-"} label="Pool idle" />
        <Metric value={m.dbPoolPending ?? "-"} label="Awaiting connection" />
        <Metric value={m.dbPoolTotal ?? "-"} label="Pool total" />
      </div>

      <h3 className="section-title">Traffic (since startup)</h3>
      <div className="metric-grid">
        <Metric value={m.graphqlRequests} label="GraphQL requests" />
        <Metric value={m.graphqlErrors} label="Error responses" sub={`${errorRate.toFixed(1)}% error rate`} />
        <Metric value={`${m.graphqlAvgLatencyMs.toFixed(1)} ms`} label="Avg latency" />
      </div>

      <h3 className="section-title">App &amp; Security</h3>
      <div className="metric-grid">
        <Metric value={m.totalUsers} label="Users" />
        <Metric value={m.activeSessions} label="Active sessions" />
        <Metric value={m.lockedAccounts} label="Locked accounts" />
        <Metric value={m.usersWithFailedLogins} label="Users w/ failed logins" />
        <Metric value={m.totalBands} label="Bands" />
        <Metric value={m.openPositions} label="Open positions" />
        <Metric value={m.pendingJoinRequests} label="Pending requests" />
        <Metric value={m.totalMessages} label="Messages" />
      </div>

      <h3 className="section-title">Recent logins</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>User</th>
            <th>IP</th>
            <th>Country</th>
            <th>When</th>
          </tr>
        </thead>
        <tbody>
          {m.recentLogins.length === 0 ? (
            <tr>
              <td colSpan={4} className="empty-state">No logins recorded yet.</td>
            </tr>
          ) : (
            m.recentLogins.map((r) => (
              <tr key={r.userId}>
                <td>{r.name}</td>
                <td>{r.ip ?? "-"}</td>
                <td>{r.country ?? "-"}</td>
                <td>{r.at ? new Date(r.at).toLocaleString() : "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
