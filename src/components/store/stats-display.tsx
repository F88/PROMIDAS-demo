import type { PrototypeInMemoryStats } from "@f88/promidas";

interface StatsDisplayProps {
  stats: PrototypeInMemoryStats | null;
  fetchStats: () => void;
}

export function StatsDisplay({ stats, fetchStats }: StatsDisplayProps) {
  return (
    <div className="stats-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3>getStats()</h3>
        <button
          onClick={fetchStats}
          className="fetch-button"
          style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}
        >
          getStats()
        </button>
      </div>
      {!stats && (
        <div style={{ textAlign: "center", color: "#6b7280", padding: "1rem" }}>
          No stats available. Please setup a snapshot first.
        </div>
      )}
      {stats && (
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Snapshot Size:</span>
            <span className="stat-value">{stats.size} prototypes</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Cached At:</span>
            <span className="stat-value">
              {stats.cachedAt
                ? new Date(stats.cachedAt).toLocaleString()
                : "Not cached"}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Status:</span>
            <span
              className={`stat-value ${stats.isExpired ? "expired" : "valid"}`}
            >
              {stats.isExpired ? "Expired" : "Valid"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
