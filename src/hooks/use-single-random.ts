import { useState, useCallback } from 'react';

import type { NormalizedPrototype } from '@f88/promidas/types';

import { useProtopediaRepository } from './repository-context';

/**
 * Custom hook for retrieving a single random prototype from the current snapshot.
 *
 * **DO NOT REMOVE**: This hook demonstrates the getRandomPrototypeFromSnapshot() API.
 * Console logs are intentionally included for demo site debugging.
 */
export function useSingleRandom() {
  const repository = useProtopediaRepository();
  const [prototype, setPrototype] = useState<NormalizedPrototype | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasExecuted, setHasExecuted] = useState(false);

  const fetchSingleRandom = async () => {
    if (!repository) return;

    setLoading(true);
    setError(null);
    setHasExecuted(true);

    try {
      const repo = repository;
      const result = await repo.getRandomPrototypeFromSnapshot();

      console.debug('[useSingleRandom] Fetched single random prototype', {
        prototypeId: result?.id,
        prototypeName: result?.prototypeNm,
      });

      setPrototype(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[useSingleRandom] Error fetching single random', err);
      setError(message);
      setPrototype(null);
    } finally {
      setLoading(false);
    }
  };

  const clear = useCallback(() => {
    setPrototype(null);
    setError(null);
    setHasExecuted(false);
  }, []);

  return {
    prototype,
    loading,
    error,
    fetchSingleRandom,
    clear,
    hasExecuted,
  };
}
