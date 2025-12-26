/**
 * @file Hook for searching prototypes by ID in the snapshot
 *
 * **DEMO SITE FEATURE**: This hook includes detailed console logging for
 * demonstration and debugging purposes. Do not remove console.debug or
 * console.error statements - they are essential for showing PROMIDAS
 * behavior to demo site users.
 */

import { useState, useCallback } from 'react';
import type { NormalizedPrototype } from '@f88/promidas/types';
import { ValidationError } from '@f88/promidas/repository';
import { useProtopediaRepository } from './repository-context';

export function usePrototypeSearch() {
  const repository = useProtopediaRepository();
  const [prototype, setPrototype] = useState<NormalizedPrototype | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchById = async (id: number) => {
    if (!repository) return;

    setLoading(true);
    setError(null);

    try {
      console.debug(`[PROMIDAS Playground] searchById: Searching for ID ${id}`);

      const repo = repository;
      const result = await repo.getPrototypeFromSnapshotByPrototypeId(id);

      // Demo site: Log search result
      console.debug(
        `[PROMIDAS Playground] searchById: Result for ID ${id}`,
        result,
      );

      if (!result) {
        const message = `Prototype with ID ${id} not found in snapshot`;
        setError(message);
        setPrototype(null);
      } else {
        setPrototype(result);
      }
    } catch (err) {
      // *** DEMO SITE: DO NOT REMOVE THIS LOG ***
      // Demo site: Log error details
      console.error(
        `[PROMIDAS Playground] searchById failed for ID ${id}:`,
        err,
      );

      if (err instanceof ValidationError) {
        const message = `Validation error${
          err.field ? ` in ${err.field}` : ''
        }: ${err.message}`;
        setError(message);
      } else {
        const message =
          err instanceof Error ? err.message : 'Failed to search prototype';
        setError(message);
      }
      setPrototype(null);
    } finally {
      setLoading(false);
    }
  };

  const clear = useCallback(() => {
    setPrototype(null);
    setError(null);
  }, []);

  return { prototype, loading, error, searchById, clear };
}
