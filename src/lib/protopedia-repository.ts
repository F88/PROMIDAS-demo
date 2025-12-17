import { PromidasRepositoryBuilder } from "@f88/promidas";
import type {
  ProtopediaInMemoryRepository,
  PrototypeInMemoryStoreConfig,
} from "@f88/promidas";
import { getApiToken } from "./token-storage";

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

    const storeConfig: PrototypeInMemoryStoreConfig = {
      ttlMs: REPOSITORY_TTL_MS,
      maxDataSizeBytes: REPOSITORY_MAX_DATA_SIZE,
    };

    repository = new PromidasRepositoryBuilder()
      .setStoreConfig(storeConfig)
      .setApiClientConfig({
        protoPediaApiClientOptions: {
          token,
          fetch: async (url, init) => {
            // Remove x-client-user-agent header for browser compatibility
            const headers = new Headers(init?.headers);
            headers.delete("x-client-user-agent");
            return globalThis.fetch(url, { ...init, headers });
          },
        },
      })
      .build();
  }

  return repository;
}

export function resetRepository(): void {
  repository = null;
}
