import { ConfigDisplay } from "./config-display";
import type { PrototypeInMemoryStats } from "@f88/promidas";
import { GetStats } from "./get-stats";
import { GetConfig } from "./get-config";
import { StatsDisplay } from "./stats-display";
import type { StoreConfig } from "../../hooks/use-config";

interface StoreContainerProps {
  stats: PrototypeInMemoryStats | null;
  fetchStats: () => void;
  config: StoreConfig | null;
  configLoading: boolean;
  configError: string | null;
  fetchConfig: () => void;
  isActive?: boolean;
}

export function StoreContainer({
  stats,
  fetchStats,
  config,
  configLoading,
  configError,
  fetchConfig,
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
        <ConfigDisplay
          repoConfig={config}
          configLoading={configLoading}
          configError={configError}
        />
        <GetConfig configLoading={configLoading} fetchConfig={fetchConfig} />
        <StatsDisplay stats={stats} />
        <GetStats fetchStats={fetchStats} />
      </div>
    </div>
  );
}
