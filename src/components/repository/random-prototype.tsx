import { PrototypeCard } from "../PrototypeCard";
import type { PrototypeInMemoryStats } from "@f88/promidas";

interface RandomPrototypeProps {
  randomPrototype: any;
  randomLoading: boolean;
  randomError: string | null;
  stats: PrototypeInMemoryStats | null;
  handleFetchRandom: () => void;
  clearRandom: () => void;
}

export function RandomPrototype({
  randomPrototype,
  randomLoading,
  randomError,
  stats,
  handleFetchRandom,
  clearRandom,
}: RandomPrototypeProps) {
  return (
    <div className="controls-section">
      <h3>getRandomSampleFromSnapshot()</h3>
      <div className="controls">
        <button
          onClick={handleFetchRandom}
          disabled={randomLoading || !stats || stats.size === 0}
          className="fetch-button"
        >
          {randomLoading ? "Loading..." : "getRandomSampleFromSnapshot()"}
        </button>
        {randomPrototype && (
          <button onClick={clearRandom} className="action-button secondary">
            Clear
          </button>
        )}
      </div>
      {randomError && (
        <div className="error-message">
          <p>Error: {randomError}</p>
        </div>
      )}
      {randomPrototype && !randomLoading && (
        <PrototypeCard prototype={randomPrototype} />
      )}
    </div>
  );
}
