/**
 * @file Hook for fetching all prototypes from the snapshot
 *
 * **DEMO SITE FEATURE**: This hook includes detailed console logging for
 * demonstration and debugging purposes. Do not remove console.debug or
 * console.error statements - they are essential for showing PROMIDAS
 * behavior to demo site users.
 */

import { useState } from 'react';
import type { NormalizedPrototype } from '@f88/promidas/types';
import { useProtopediaRepository } from './repository-context';

export function useAllPrototypes() {
  const repository = useProtopediaRepository();
  const [prototypes, setPrototypes] = useState<NormalizedPrototype[] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    if (!repository) return;

    setLoading(true);
    setError(null);

    try {
      // *** DEMO SITE: DO NOT REMOVE THIS LOG ***
      console.debug('[PROMIDAS Playground] fetchAll: Fetching all prototypes');

      const all = await repository.getAllFromSnapshot();

      // *** DEMO SITE: DO NOT REMOVE THIS LOG ***
      // Demo site: Log fetched prototypes count
      console.debug(
        `[PROMIDAS Playground] fetchAll: Fetched ${all.length} prototypes`,
        all,
      );

      setPrototypes([...all] as NormalizedPrototype[]);
    } catch (err) {
      // *** DEMO SITE: DO NOT REMOVE THIS LOG ***
      // Demo site: Log error details
      console.error('[PROMIDAS Playground] fetchAll failed:', err);

      const message =
        err instanceof Error ? err.message : 'Failed to fetch all prototypes';
      setError(message);
      setPrototypes([]);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setPrototypes(null);
    setError(null);
  };

  return { prototypes, loading, error, fetchAll, clear };
}
