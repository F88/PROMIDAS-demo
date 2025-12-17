import { PrototypeCard } from "../PrototypeCard";
import type { PrototypeInMemoryStats } from "@f88/promidas";

interface SearchByIdProps {
  searchId: string;
  setSearchId: (value: string) => void;
  searchPrototype: any;
  searchLoading: boolean;
  searchError: string | null;
  stats: PrototypeInMemoryStats | null;
  handleSearch: () => void;
  clearSearch: () => void;
}

export function SearchById({
  searchId,
  setSearchId,
  searchPrototype,
  searchLoading,
  searchError,
  stats,
  handleSearch,
  clearSearch,
}: SearchByIdProps) {
  return (
    <div className="controls-section">
      <h3>getPrototypeFromSnapshotByPrototypeId()</h3>
      <div className="search-controls">
        <input
          type="number"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter Prototype ID"
          className="search-input"
        />
        <button
          onClick={handleSearch}
          disabled={searchLoading || !searchId || !stats || stats.size === 0}
          className="fetch-button"
        >
          {searchLoading
            ? "Searching..."
            : "getPrototypeFromSnapshotByPrototypeId()"}
        </button>
        {searchPrototype && (
          <button onClick={clearSearch} className="action-button secondary">
            Clear
          </button>
        )}
      </div>
      {searchError && (
        <div className="error-message">
          <p>Error: {searchError}</p>
        </div>
      )}
      {searchPrototype && !searchLoading && (
        <PrototypeCard prototype={searchPrototype} />
      )}
    </div>
  );
}
