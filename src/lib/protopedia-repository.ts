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
// export const REPOSITORY_TTL_MS = 1_000 * 30; // 30 seconds
export const REPOSITORY_TTL_MS = 1_000 * 10; // 10 seconds
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
        fetch: async (url, init) => {
          // Workaround for CORS issue with x-client-user-agent header
          //
          // see https://github.com/F88/promidas/issues/55
          //
          // Remove x-client-user-agent header for browser CORS compatibility
          // ProtoPedia API does not allow this custom header in browser requests
          //
          // NOTE: X-ProtoPedia-API-Client also fails CORS (tested 2025-12-17)
          // Custom headers require server-side CORS configuration
          const headers = new Headers(init?.headers);
          headers.delete("x-client-user-agent");
          // Keep all other headers including Authorization
          return globalThis.fetch(url, { ...init, headers });
        },
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
