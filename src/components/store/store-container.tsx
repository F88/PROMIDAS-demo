import { ConfigDisplay } from "./config-display";
import type { PrototypeInMemoryStats } from "@f88/promidas";
import { StatsDisplay } from "./stats-display";

interface StoreContainerProps {
  stats: PrototypeInMemoryStats | null;
  fetchStats: () => void;
  repoConfig: any;
  configLoading: boolean;
  configError: string | null;
  fetchConfig: () => void;
  clearConfig: () => void;
  isActive?: boolean;
}

export function StoreContainer({
  stats,
  fetchStats,
  repoConfig,
  configLoading,
  configError,
  fetchConfig,
  clearConfig,
  isActive = false,
}: StoreContainerProps) {
  return (
    <div
      className={`container-wrapper store-container ${
        isActive ? "active" : ""
      }`}
    >
      <span className="container-label">Store</span>
      <div className="store-grid">
        <StatsDisplay stats={stats} fetchStats={fetchStats} />
        <ConfigDisplay
          repoConfig={repoConfig}
          configLoading={configLoading}
          configError={configError}
          fetchConfig={fetchConfig}
          clearConfig={clearConfig}
        />
      </div>
    </div>
  );
}
