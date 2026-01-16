import { useCallback, useState } from 'react';

import { useProtopediaRepository } from './repository-context';

import type { ProtopediaInMemoryRepository } from 'promidas';

export type StoreConfig = ReturnType<
  ProtopediaInMemoryRepository['getConfig']
> & {
  fetchedAt: number;
};

/**
 * Custom hook for retrieving repository configuration.
 *
 * **DO NOT REMOVE**: This hook demonstrates the getConfig() API.
 * Console logs are intentionally included for demo site debugging.
 */
export function useConfig() {
  const repository = useProtopediaRepository();
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    if (!repository) {
      setConfig(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const repo = repository;
      const result = repo.getConfig();
      const fetchedAt = Date.now();

      console.debug('[useConfig] Fetched repository config', {
        ttlMs: result.ttlMs,
        maxDataSizeBytes: result.maxDataSizeBytes,
        fetchedAt: new Date(fetchedAt).toISOString(),
      });

      setConfig({ ...result, fetchedAt });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[useConfig] Error fetching config', err);
      setError(message);
      setConfig(null);
    } finally {
      setLoading(false);
    }
  }, [repository]);

  const clear = useCallback(() => {
    setConfig(null);
    setError(null);
  }, []);

  return { config, loading, error, fetchConfig, clear };
}
