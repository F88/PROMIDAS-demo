interface ConfigDisplayProps {
  repoConfig: any;
  configLoading: boolean;
  configError: string | null;
  fetchConfig: () => void;
  clearConfig: () => void;
}

export function ConfigDisplay({
  repoConfig,
  configLoading,
  configError,
  fetchConfig,
  clearConfig,
}: ConfigDisplayProps) {
  return (
    <div className="controls-section">
      <h3>getConfig()</h3>
      <p className="section-description">Retrieve store settings</p>
      <div className="controls">
        <button
          onClick={fetchConfig}
          disabled={configLoading}
          className="fetch-button"
        >
          {configLoading ? "Loading..." : "getConfig()"}
        </button>
        {repoConfig && (
          <button onClick={clearConfig} className="action-button secondary">
            Clear
          </button>
        )}
      </div>
      {configError && (
        <div className="error-message">
          <p>Error: {configError}</p>
        </div>
      )}
      {repoConfig && !configLoading && (
        <div className="config-display">
          <div className="config-item">
            <span className="config-label">TTL (Time To Live):</span>
            <span className="config-value">
              {(repoConfig.ttlMs / 1000 / 60).toFixed(0)} minutes
            </span>
          </div>
          <div className="config-item">
            <span className="config-label">Max Data Size:</span>
            <span className="config-value">
              {(repoConfig.maxDataSizeBytes / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
