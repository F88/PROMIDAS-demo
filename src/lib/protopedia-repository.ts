import { createProtopediaInMemoryRepository } from "@f88/promidas";
import type {
  ProtopediaInMemoryRepository,
  PrototypeMapStoreConfig,
} from "@f88/promidas";
import { getApiToken } from "./token-storage";
import type { ProtoPediaApiClientOptions } from "protopedia-api-v2-client";

let repository: ProtopediaInMemoryRepository | null = null;

export function getProtopediaRepository(): ProtopediaInMemoryRepository {
  if (!repository) {
    const token = getApiToken();

    if (!token) {
      throw new Error("API token is not set. Please configure it in Settings.");
    }

    const storeConfig: PrototypeMapStoreConfig = {
      //
      ttlMs: 1_000 * 30, // 30 seconds
      maxPayloadSizeBytes: 10 * 1024 * 1024, // 30 MiB limit
    };

    const protopediaApiClientOptions: ProtoPediaApiClientOptions = {
      token,
      logLevel: "debug",
      fetch: async (url, init) => {
        // Remove x-client-user-agent header for browser compatibility
        const headers = new Headers(init?.headers);
        headers.delete("x-client-user-agent");

        return globalThis.fetch(url, {
          ...init,
          headers,
        });
      },
    };

    repository = createProtopediaInMemoryRepository(
      storeConfig,
      protopediaApiClientOptions
    );
  }

  return repository;
}

export function resetRepository(): void {
  repository = null;
}
