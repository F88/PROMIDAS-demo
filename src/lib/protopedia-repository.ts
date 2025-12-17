import { PromidasRepositoryBuilder } from "@f88/promidas";
import type {
  ProtopediaInMemoryRepository,
  ProtopediaInMemoryRepositoryConfig,
  PrototypeInMemoryStoreConfig,
} from "@f88/promidas";
import { getApiToken } from "./token-storage";
import type { LogLevel } from "@f88/promidas/logger";
import type { ProtopediaApiCustomClientConfig } from "@f88/promidas/fetcher";

// Repository configuration constants
export const REPOSITORY_TTL_MS = 1_000 * 30; // 30 seconds
export const REPOSITORY_MAX_DATA_SIZE = 10 * 1024 * 1024; // 10 MiB

let repository: ProtopediaInMemoryRepository | null = null;

export function getProtopediaRepository(): ProtopediaInMemoryRepository {
  if (!repository) {
    const token = getApiToken();

    if (!token) {
      throw new Error("API token is not set. Please configure it in Settings.");
    }

    // For demo site, set log level to debug to help with troubleshooting
    const LOG_LEVEL_FOR_DEMO_SITE: LogLevel = "debug";

    const storeConfig: PrototypeInMemoryStoreConfig = {
      ttlMs: REPOSITORY_TTL_MS,
      maxDataSizeBytes: REPOSITORY_MAX_DATA_SIZE,
      logLevel: LOG_LEVEL_FOR_DEMO_SITE,
    };

    const protopediaInMemoryRepositoryConfig: ProtopediaInMemoryRepositoryConfig =
      {
        logLevel: LOG_LEVEL_FOR_DEMO_SITE,
        enableEvents: true, // Enable event system for real-time notifications
      };

    const protopediaApiCustomClientConfig: ProtopediaApiCustomClientConfig = {
      protoPediaApiClientOptions: {
        logLevel: LOG_LEVEL_FOR_DEMO_SITE,
        token,
        userAgent: "PROMIDAS-Demo-Site/1.0.0",
      },
      progressLog: true, // Enable progress logging for download tracking
    };

    repository = new PromidasRepositoryBuilder()
      .setStoreConfig(storeConfig)
      .setApiClientConfig(protopediaApiCustomClientConfig)
      .setRepositoryConfig(protopediaInMemoryRepositoryConfig)
      .build();
  }

  return repository;
}

export function resetRepository(): void {
  if (repository) {
    // Cleanup event listeners if repository has dispose method
    if ("dispose" in repository && typeof repository.dispose === "function") {
      repository.dispose();
    }
  }
  repository = null;
}
