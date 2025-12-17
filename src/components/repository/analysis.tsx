import type { PrototypeInMemoryStats } from "@f88/promidas";

interface AnalysisProps {
  analysis: { min: number | null; max: number | null } | null;
  analysisLoading: boolean;
  analysisError: string | null;
  stats: PrototypeInMemoryStats | null;
  analyze: () => void;
  clearAnalysis: () => void;
}

export function Analysis({
  analysis,
  analysisLoading,
  analysisError,
  stats,
  analyze,
  clearAnalysis,
}: AnalysisProps) {
  return (
    <div className="controls-section">
      <h3>analyzePrototypes()</h3>
      <p className="section-description">
        Extract min/max ID range from snapshot
      </p>
      <div className="controls">
        <button
          onClick={analyze}
          disabled={analysisLoading || !stats || stats.size === 0}
          className="fetch-button"
        >
          {analysisLoading ? "Loading..." : "analyzePrototypes()"}
        </button>
        {analysis && (
          <button onClick={clearAnalysis} className="action-button secondary">
            Clear
          </button>
        )}
      </div>
      {analysisError && (
        <div className="error-message">
          <p>Error: {analysisError}</p>
        </div>
      )}
      {analysis && !analysisLoading && (
        <div className="config-display">
          <div className="config-item">
            <span className="config-label">Minimum ID:</span>
            <span className="config-value">
              {analysis.min !== null ? analysis.min : "N/A"}
            </span>
          </div>
          <div className="config-item">
            <span className="config-label">Maximum ID:</span>
            <span className="config-value">
              {analysis.max !== null ? analysis.max : "N/A"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
