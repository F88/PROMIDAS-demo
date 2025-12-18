import { useState } from 'react';
import { getProtopediaRepository } from '../lib/protopedia-repository';
import type { ProtopediaInMemoryRepository } from '@f88/promidas';

export type StoreConfig = ReturnType<ProtopediaInMemoryRepository['getConfig']>;

/**
 * Custom hook for retrieving repository configuration.
 *
 * **DO NOT REMOVE**: This hook demonstrates the getConfig() API.
 * Console logs are intentionally included for demo site debugging.
 */
export function useConfig() {
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = () => {
    setLoading(true);
    setError(null);

    try {
      const repo = getProtopediaRepository();
      const result = repo.getConfig();

      console.debug('[useConfig] Fetched repository config', {
        ttlMs: result.ttlMs,
        maxDataSizeBytes: result.maxDataSizeBytes,
      });

      setConfig(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[useConfig] Error fetching config', err);
      setError(message);
      setConfig(null);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setConfig(null);
    setError(null);
  };

  return { config, loading, error, fetchConfig, clear };
}
