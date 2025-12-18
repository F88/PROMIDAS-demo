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
import { getProtopediaRepository } from '../lib/protopedia-repository';

export function useRandomPrototype() {
  const [prototype, setPrototype] = useState<NormalizedPrototype | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandom = async () => {
    setLoading(true);
    setError(null);

    try {
      const repo = getProtopediaRepository();
      const stats = repo.getStats();

      // *** DEMO SITE: DO NOT REMOVE THIS LOG ***
      // Demo site: Log repository stats before fetching
      console.debug('[PROMIDAS Demo] fetchRandom: Current stats', stats);

      // Setup snapshot if not initialized or expired
      if (stats.size === 0 || stats.isExpired) {
        // *** DEMO SITE: DO NOT REMOVE THIS LOG ***
        console.debug('[PROMIDAS Demo] fetchRandom: Setting up snapshot');
        await repo.setupSnapshot({ offset: 0, limit: 100 });
      }

      const randomPrototypes = await repo.getRandomSampleFromSnapshot(1);

      // *** DEMO SITE: DO NOT REMOVE THIS LOG ***
      // Demo site: Log fetched prototypes
      console.debug(
        '[PROMIDAS Demo] fetchRandom: Fetched prototypes',
        randomPrototypes,
      );

      if (randomPrototypes.length === 0) {
        setError('No prototypes available in snapshot');
        setPrototype(null);
      } else {
        setPrototype(randomPrototypes[0] as NormalizedPrototype);
      }
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
    setPrototype(null);
    setError(null);
  };

  return { prototype, loading, error, fetchRandom, clear };
}
