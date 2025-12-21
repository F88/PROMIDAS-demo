/**
 * @file Hook for fetching random prototypes from the snapshot
 *
 * **DEMO SITE FEATURE**: This hook includes detailed console logging for
 * demonstration and debugging purposes. Do not remove console.debug or
 * console.error statements - they are essential for showing PROMIDAS
 * behavior to demo site users.
 */

import { useState } from 'react';
import type { NormalizedPrototype } from '@f88/promidas/types';
import { ValidationError } from '@f88/promidas/repository';
import { getProtopediaRepository } from '../lib/repository/protopedia-repository';

export function useRandomPrototype() {
  const [prototypes, setPrototypes] = useState<NormalizedPrototype[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasExecuted, setHasExecuted] = useState(false);

  const fetchRandom = async (size: number = 1) => {
    setLoading(true);
    setError(null);
    setHasExecuted(true);

    try {
      const repo = getProtopediaRepository();
      const stats = repo.getStats();

      // *** DEMO SITE: DO NOT REMOVE THIS LOG ***
      // Demo site: Log repository stats before fetching
      console.debug('[PROMIDAS Demo] fetchRandom: Current stats', stats);

      const randomPrototypes = await repo.getRandomSampleFromSnapshot(size);

      // *** DEMO SITE: DO NOT REMOVE THIS LOG ***
      // Demo site: Log fetched prototypes
      console.debug(
        '[PROMIDAS Demo] fetchRandom: Fetched prototypes',
        randomPrototypes,
      );

      setPrototypes(randomPrototypes as NormalizedPrototype[]);
    } catch (err) {
      // *** DEMO SITE: DO NOT REMOVE THIS LOG ***
      // Demo site: Log error details
      console.error('[PROMIDAS Demo] fetchRandom failed:', err);

      if (err instanceof ValidationError) {
        const message = `Validation error${
          err.field ? ` in ${err.field}` : ''
        }: ${err.message}`;
        setError(message);
      } else {
        const message =
          err instanceof Error ? err.message : 'Failed to fetch prototype';
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setPrototypes([]);
    setError(null);
    setHasExecuted(false);
  };

  return { prototypes, loading, error, fetchRandom, clear, hasExecuted };
}
