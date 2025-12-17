import { PrototypeCard } from "../PrototypeCard";
import type { PrototypeInMemoryStats } from "@f88/promidas";

interface SingleRandomProps {
  singleRandomPrototype: any;
  singleRandomLoading: boolean;
  singleRandomError: string | null;
  stats: PrototypeInMemoryStats | null;
  fetchSingleRandom: () => void;
  clearSingleRandom: () => void;
}

export function SingleRandom({
  singleRandomPrototype,
  singleRandomLoading,
  singleRandomError,
  stats,
  fetchSingleRandom,
  clearSingleRandom,
}: SingleRandomProps) {
  return (
    <div className="controls-section">
      <h3>getRandomPrototypeFromSnapshot()</h3>
      <p className="section-description">Optimized for single random item</p>
      <div className="controls">
        <button
          onClick={fetchSingleRandom}
          disabled={singleRandomLoading || !stats || stats.size === 0}
          className="fetch-button"
        >
          {singleRandomLoading
            ? "Loading..."
            : "getRandomPrototypeFromSnapshot()"}
        </button>
        {singleRandomPrototype && (
          <button
            onClick={clearSingleRandom}
            className="action-button secondary"
          >
            Clear
          </button>
        )}
      </div>
      {singleRandomError && (
        <div className="error-message">
          <p>Error: {singleRandomError}</p>
        </div>
      )}
      {singleRandomPrototype && !singleRandomLoading && (
        <PrototypeCard prototype={singleRandomPrototype} />
      )}
    </div>
  );
}
