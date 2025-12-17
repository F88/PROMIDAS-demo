import { useState } from "react";
import { useRandomPrototype } from "./hooks/use-random-prototype";
import { useRepositoryStats } from "./hooks/use-repository-stats";
import { useSnapshotManagement } from "./hooks/use-snapshot-management";
import { usePrototypeSearch } from "./hooks/use-prototype-search";
import { PrototypeCard } from "./components/PrototypeCard";
import {
  hasApiToken,
  getApiToken,
  setApiToken,
  removeApiToken,
} from "./lib/token-storage";
import { resetRepository } from "./lib/protopedia-repository";
import "./App.css";
import type { ListPrototypesParams } from "protopedia-api-v2-client";

function App() {
  const [searchId, setSearchId] = useState("7917");
  const [snapshotLimit, setSnapshotLimit] = useState("10");
  const [snapshotOffset, setSnapshotOffset] = useState("0");
  const [snapshotUserNm, setSnapshotUserNm] = useState("");
  const [snapshotTagNm, setSnapshotTagNm] = useState("");
  const [snapshotEventNm, setSnapshotEventNm] = useState("");
  const [snapshotMaterialNm, setSnapshotMaterialNm] = useState("");
  const [token, setTokenInput] = useState(getApiToken() || "");
  const [showToken, setShowToken] = useState(false);

  const {
    prototype: randomPrototype,
    loading: randomLoading,
    error: randomError,
    fetchRandom,
    clear: clearRandom,
  } = useRandomPrototype();
  const { stats, updateStats } = useRepositoryStats();
  const {
    loading: snapshotLoading,
    error: snapshotError,
    success: snapshotSuccess,
    setupSnapshot,
    refreshSnapshot,
  } = useSnapshotManagement();
  const {
    prototype: searchPrototype,
    loading: searchLoading,
    error: searchError,
    searchById,
    clear: clearSearch,
  } = usePrototypeSearch();

  const handleSetupSnapshot = async () => {
    let limit = parseInt(snapshotLimit) || 10;
    if (limit > 100) {
      limit = 100;
      setSnapshotLimit("100");
    }
    const offset = parseInt(snapshotOffset) || 0;
    const params: ListPrototypesParams = { limit, offset };

    if (snapshotUserNm) params.userNm = snapshotUserNm;
    if (snapshotTagNm) params.tagNm = snapshotTagNm;
    if (snapshotEventNm) params.eventNm = snapshotEventNm;
    if (snapshotMaterialNm) params.materialNm = snapshotMaterialNm;

    await setupSnapshot(params);
    updateStats();
  };

  const handleRefreshSnapshot = async () => {
    await refreshSnapshot();
    updateStats();
  };

  const handleFetchRandom = () => {
    clearSearch();
    fetchRandom();
  };

  const handleSearch = () => {
    const id = parseInt(searchId);
    if (!isNaN(id)) {
      searchById(id);
    }
  };

  const handleTokenChange = () => {
    // Clear all prototypes and refresh stats
    clearRandom();
    clearSearch();
    updateStats();
  };

  const handleSaveToken = () => {
    if (token.trim()) {
      setApiToken(token.trim());
      resetRepository();
      handleTokenChange();
    }
  };

  const handleDeleteToken = () => {
    if (confirm("トークンを削除してよろしいですか？")) {
      removeApiToken();
      resetRepository();
      setTokenInput("");
      handleTokenChange();
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>PROMIDAS Demo</h1>
        <p className="subtitle">
          ProtoPedia Resource Organized Management In-memory Data Access Store
        </p>
      </header>

      <main className="app-main">
        {/* API Token Configuration */}
        <div className="token-section">
          <h3>API Token Configuration</h3>
          <div className="token-form">
            <div className="token-input-group">
              <input
                type={showToken ? "text" : "password"}
                value={token}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter your ProtoPedia API token"
                className="token-input"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="toggle-visibility"
                aria-label={showToken ? "Hide token" : "Show token"}
              >
                {showToken ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <div className="token-actions">
              <button onClick={handleSaveToken} disabled={!token.trim()}>
                Save Token
              </button>
              {hasApiToken() && (
                <button onClick={handleDeleteToken} className="delete-button">
                  Delete Token
                </button>
              )}
            </div>
            <p className="token-help">
              トークンは{" "}
              <a
                href="https://protopedia.net/settings/application"
                target="_blank"
                rel="noopener noreferrer"
              >
                ProtoPedia Settings
              </a>{" "}
              で確認できます
            </p>
          </div>
        </div>

        {/* Stats Display */}
        {stats && (
          <div className="stats-card">
            <h3>Repository Stats</h3>
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
                  className={`stat-value ${
                    stats.isExpired ? "expired" : "valid"
                  }`}
                >
                  {stats.isExpired ? "Expired" : "Valid"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Snapshot Management */}
        <div className="snapshot-controls">
          <h3>Snapshot Management</h3>
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
              {snapshotLoading ? "Loading..." : "Setup Snapshot"}
            </button>
            <button
              onClick={handleRefreshSnapshot}
              disabled={snapshotLoading || !stats || stats.size === 0}
              className="action-button secondary"
            >
              {snapshotLoading ? "Loading..." : "Refresh Snapshot"}
            </button>
          </div>
          {snapshotSuccess && (
            <div className="success-message">{snapshotSuccess}</div>
          )}
          {snapshotError && (
            <div className="error-message">{snapshotError}</div>
          )}
        </div>

        {/* Random Prototype */}
        <div className="controls-section">
          <h3>Random Prototype</h3>
          <div className="controls">
            <button
              onClick={handleFetchRandom}
              disabled={randomLoading || !stats || stats.size === 0}
              className="fetch-button"
            >
              {randomLoading ? "Loading..." : "Show Random Prototype"}
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

        {/* Search by ID */}
        <div className="controls-section">
          <h3>Search by ID</h3>
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
              disabled={
                searchLoading || !searchId || !stats || stats.size === 0
              }
              className="fetch-button"
            >
              {searchLoading ? "Searching..." : "Search"}
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

        {!randomPrototype &&
          !searchPrototype &&
          !randomLoading &&
          !searchLoading &&
          stats &&
          stats.size > 0 && (
            <div className="empty-state">
              <p>
                Click "Show Random Prototype" or enter an ID and click "Search"
              </p>
            </div>
          )}

        {(!stats || stats.size === 0) && !snapshotLoading && (
          <div className="empty-state">
            <p>No snapshot loaded. Please setup a snapshot first.</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Powered by{" "}
          <a
            href="https://github.com/F88/promidas"
            target="_blank"
            rel="noopener noreferrer"
          >
            PROMIDAS
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
