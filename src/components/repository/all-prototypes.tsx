import type { PrototypeInMemoryStats } from "@f88/promidas";
import type { NormalizedPrototype } from "@f88/promidas/types";

interface AllPrototypesProps {
  allPrototypes: NormalizedPrototype[] | null;
  allLoading: boolean;
  allError: string | null;
  stats: PrototypeInMemoryStats | null;
  fetchAll: () => void;
  clearAll: () => void;
}

export function AllPrototypes({
  allPrototypes,
  allLoading,
  allError,
  stats,
  fetchAll,
  clearAll,
}: AllPrototypesProps) {
  return (
    <div className="controls-section">
      <h3>getAllFromSnapshot()</h3>
      <p className="section-description">
        Retrieve all prototypes from snapshot
      </p>
      <div className="controls">
        <button
          onClick={fetchAll}
          disabled={allLoading || !stats || stats.size === 0}
          className="fetch-button"
        >
          {allLoading ? "Loading..." : "getAllFromSnapshot()"}
        </button>
        {allPrototypes && (
          <button onClick={clearAll} className="action-button secondary">
            Clear
          </button>
        )}
      </div>
      {allError && (
        <div className="error-message">
          <p>Error: {allError}</p>
        </div>
      )}
      {allPrototypes && !allLoading && (
        <div className="ids-display">
          <p className="ids-count">
            Total Prototypes: <strong>{allPrototypes.length}</strong>
          </p>
          <div className="ids-list">
            {allPrototypes.slice(0, 20).map((proto) => (
              <span key={proto.id} className="id-badge">
                {proto.id}: {proto.prototypeNm}
              </span>
            ))}
            {allPrototypes.length > 20 && (
              <span className="id-badge more">
                +{allPrototypes.length - 20} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
