import type { PrototypeInMemoryStats } from "@f88/promidas";

interface SnapshotManagementProps {
  snapshotLimit: string;
  setSnapshotLimit: (value: string) => void;
  snapshotOffset: string;
  setSnapshotOffset: (value: string) => void;
  snapshotUserNm: string;
  setSnapshotUserNm: (value: string) => void;
  snapshotTagNm: string;
  setSnapshotTagNm: (value: string) => void;
  snapshotEventNm: string;
  setSnapshotEventNm: (value: string) => void;
  snapshotMaterialNm: string;
  setSnapshotMaterialNm: (value: string) => void;
  snapshotLoading: boolean;
  snapshotSuccess: string | null;
  snapshotError: string | null;
  stats: PrototypeInMemoryStats | null;
  handleSetupSnapshot: () => void;
  handleRefreshSnapshot: () => void;
}

export function SnapshotManagement({
  snapshotLimit,
  setSnapshotLimit,
  snapshotOffset,
  setSnapshotOffset,
  snapshotUserNm,
  setSnapshotUserNm,
  snapshotTagNm,
  setSnapshotTagNm,
  snapshotEventNm,
  setSnapshotEventNm,
  snapshotMaterialNm,
  setSnapshotMaterialNm,
  snapshotLoading,
  snapshotSuccess,
  snapshotError,
  stats,
  handleSetupSnapshot,
  handleRefreshSnapshot,
}: SnapshotManagementProps) {
  return (
    <div className="snapshot-controls">
      <h3>setupSnapshot() / refreshSnapshot()</h3>
      <div className="snapshot-form">
        <div className="form-group">
          <label htmlFor="snapshot-limit">Limit:</label>
          <input
            id="snapshot-limit"
            type="number"
            value={snapshotLimit}
            onChange={(e) => setSnapshotLimit(e.target.value)}
            min="1"
            max="100"
          />
        </div>
        <div className="form-group">
          <label htmlFor="snapshot-offset">Offset:</label>
          <input
            id="snapshot-offset"
            type="number"
            value={snapshotOffset}
            onChange={(e) => setSnapshotOffset(e.target.value)}
            min="0"
          />
        </div>
        <div className="form-group">
          <label htmlFor="snapshot-user">User Name:</label>
          <input
            id="snapshot-user"
            type="text"
            value={snapshotUserNm}
            onChange={(e) => setSnapshotUserNm(e.target.value)}
            placeholder="Filter by user"
          />
        </div>
        <div className="form-group">
          <label htmlFor="snapshot-tag">Tag Name:</label>
          <input
            id="snapshot-tag"
            type="text"
            value={snapshotTagNm}
            onChange={(e) => setSnapshotTagNm(e.target.value)}
            placeholder="Filter by tag"
          />
        </div>
        <div className="form-group">
          <label htmlFor="snapshot-event">Event Name:</label>
          <input
            id="snapshot-event"
            type="text"
            value={snapshotEventNm}
            onChange={(e) => setSnapshotEventNm(e.target.value)}
            placeholder="Filter by event"
          />
        </div>
        <div className="form-group">
          <label htmlFor="snapshot-material">Material Name:</label>
          <input
            id="snapshot-material"
            type="text"
            value={snapshotMaterialNm}
            onChange={(e) => setSnapshotMaterialNm(e.target.value)}
            placeholder="Filter by material"
          />
        </div>
        <button
          onClick={handleSetupSnapshot}
          disabled={snapshotLoading}
          className="action-button"
        >
          {snapshotLoading ? "Loading..." : "setupSnapshot()"}
        </button>
        <button
          onClick={handleRefreshSnapshot}
          disabled={snapshotLoading || !stats || stats.size === 0}
          className="action-button secondary"
        >
          {snapshotLoading ? "Loading..." : "refreshSnapshot()"}
        </button>
      </div>
      {snapshotSuccess && (
        <div className="success-message">{snapshotSuccess}</div>
      )}
      {snapshotError && <div className="error-message">{snapshotError}</div>}
    </div>
  );
}
