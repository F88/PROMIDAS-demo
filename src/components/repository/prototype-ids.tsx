import type { PrototypeInMemoryStats } from "@f88/promidas";

interface PrototypeIdsProps {
  prototypeIds: readonly number[] | null;
  idsLoading: boolean;
  idsError: string | null;
  stats: PrototypeInMemoryStats | null;
  fetchIds: () => void;
  clearIds: () => void;
}

export function PrototypeIds({
  prototypeIds,
  idsLoading,
  idsError,
  stats,
  fetchIds,
  clearIds,
}: PrototypeIdsProps) {
  return (
    <div className="controls-section">
      <h3>getPrototypeIdsFromSnapshot()</h3>
      <p className="section-description">Efficient ID-only retrieval</p>
      <div className="controls">
        <button
          onClick={fetchIds}
          disabled={idsLoading || !stats || stats.size === 0}
          className="fetch-button"
        >
          {idsLoading ? "Loading..." : "getPrototypeIdsFromSnapshot()"}
        </button>
        {prototypeIds && (
          <button onClick={clearIds} className="action-button secondary">
            Clear
          </button>
        )}
      </div>
      {idsError && (
        <div className="error-message">
          <p>Error: {idsError}</p>
        </div>
      )}
      {prototypeIds && !idsLoading && (
        <div className="ids-display">
          <p className="ids-count">
            Total IDs: <strong>{prototypeIds.length}</strong>
          </p>
          <div className="ids-list">
            {prototypeIds.slice(0, 50).map((id) => (
              <span key={id} className="id-badge">
                {id}
              </span>
            ))}
            {prototypeIds.length > 50 && (
              <span className="id-badge more">
                +{prototypeIds.length - 50} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
