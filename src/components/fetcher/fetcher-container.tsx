/**
 * Fetcher Container
 *
 * Visualizes API fetch operations.
 * This container highlights when data is being fetched from the ProtoPedia API.
 */

interface FetcherContainerProps {
  isActive?: boolean;
}

export function FetcherContainer({ isActive = false }: FetcherContainerProps) {
  return (
    <div
      className={`container-wrapper fetcher-container ${
        isActive ? "active" : ""
      }`}
    >
      <span className="container-label">Fetcher</span>
      <div
        style={{
          minHeight: "20px",
          textAlign: "center",
          color: "#6b7280",
          fontSize: "0.875rem",
        }}
      >
        {isActive ? "📡 Fetching data from API..." : "Ready to fetch"}
      </div>
    </div>
  );
}
