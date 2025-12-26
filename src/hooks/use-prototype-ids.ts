import { useState, useCallback } from 'react';

import { useProtopediaRepository } from './repository-context';

/**
 * Custom hook for retrieving all prototype IDs from the current snapshot.
 *
 * **DO NOT REMOVE**: This hook demonstrates the getPrototypeIdsFromSnapshot() API.
 * Console logs are intentionally included for demo site debugging.
 */
export function usePrototypeIds() {
  const repository = useProtopediaRepository();
  const [ids, setIds] = useState<readonly number[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIds = async () => {
    if (!repository) return;

    setLoading(true);
    setError(null);

    try {
      const repo = repository;
      const result = await repo.getPrototypeIdsFromSnapshot();

      console.debug('[usePrototypeIds] Fetched prototype IDs', {
        count: result.length,
        sample: result.slice(0, 10),
      });

      setIds(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[usePrototypeIds] Error fetching IDs', err);
      setError(message);
      setIds(null);
    } finally {
      setLoading(false);
    }
  };

  const clear = useCallback(() => {
    setIds(null);
    setError(null);
  }, []);

  return { ids, loading, error, fetchIds, clear };
}
