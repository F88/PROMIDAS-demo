interface DataFlowIndicatorProps {
  isFetcherActive: boolean;
  isStoreActive: boolean;
  isRepositoryActive: boolean;
  isDisplayActive: boolean;
}

export function DataFlowIndicator({
  isFetcherActive,
  isStoreActive,
  isRepositoryActive,
  isDisplayActive,
}: DataFlowIndicatorProps) {
  return (
    <div className="data-flow-indicator">
      <div className="indicator-label">Data Flow Status:</div>
      <div className="indicator-items">
        <div className={`indicator-item ${isFetcherActive ? "active" : ""}`}>
          <span className="indicator-icon">📡</span>
          <span className="indicator-text">Fetcher</span>
        </div>
        <div className="indicator-arrow">→</div>
        <div className={`indicator-item ${isStoreActive ? "active" : ""}`}>
          <span className="indicator-icon">💾</span>
          <span className="indicator-text">Store</span>
        </div>
        <div className="indicator-arrow">→</div>
        <div className={`indicator-item ${isRepositoryActive ? "active" : ""}`}>
          <span className="indicator-icon">📚</span>
          <span className="indicator-text">Repository</span>
        </div>
        <div className="indicator-arrow">→</div>
        <div className={`indicator-item ${isDisplayActive ? "active" : ""}`}>
          <span className="indicator-icon">🖥️</span>
          <span className="indicator-text">Display</span>
        </div>
      </div>
    </div>
  );
}
