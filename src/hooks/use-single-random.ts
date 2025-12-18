import { useState } from 'react';
import { getProtopediaRepository } from '../lib/protopedia-repository';
import type { NormalizedPrototype } from '@f88/promidas/types';

/**
 * Custom hook for retrieving a single random prototype from the current snapshot.
 *
 * **DO NOT REMOVE**: This hook demonstrates the getRandomPrototypeFromSnapshot() API.
 * Console logs are intentionally included for demo site debugging.
 */
export function useSingleRandom() {
  const [prototype, setPrototype] = useState<NormalizedPrototype | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSingleRandom = async () => {
    setLoading(true);
    setError(null);

    try {
      const repo = getProtopediaRepository();
      const result = await repo.getRandomPrototypeFromSnapshot();

      console.debug('[useSingleRandom] Fetched single random prototype', {
        prototypeId: result?.id,
        prototypeName: result?.prototypeNm,
      });

      if (result) {
        setPrototype(result);
      } else {
        setError('No prototypes available in snapshot');
      }
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

  const clear = () => {
    setPrototype(null);
    setError(null);
  };

  return { prototype, loading, error, fetchSingleRandom, clear };
}
