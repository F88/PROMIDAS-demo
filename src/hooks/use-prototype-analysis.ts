/**
 * @file Hook for analyzing prototypes in the snapshot (min/max prototype IDs)
 *
 * **DEMO SITE FEATURE**: This hook includes detailed console logging for
 * demonstration and debugging purposes. Do not remove console.debug or
 * console.error statements - they are essential for showing PROMIDAS
 * behavior to demo site users.
 */

import { useState, useCallback } from 'react';

import { useProtopediaRepository } from './repository-context';

export function usePrototypeAnalysis() {
  const repository = useProtopediaRepository();
  const [analysis, setAnalysis] = useState<{
    min: number | null;
    max: number | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    if (!repository) return;

    setLoading(true);
    setError(null);

    try {
      // *** DEMO SITE: DO NOT REMOVE THIS LOG ***
      console.debug('[PROMIDAS Playground] analyze: Starting analysis');

      const repo = repository;
      const result = await repo.analyzePrototypes();

      // *** DEMO SITE: DO NOT REMOVE THIS LOG ***
      // Demo site: Log analysis result
      console.debug('[PROMIDAS Playground] analyze: Result', result);

      setAnalysis(result);
    } catch (err) {
      // *** DEMO SITE: DO NOT REMOVE THIS LOG ***
      // Demo site: Log error details
      console.error('[PROMIDAS Playground] analyze failed:', err);

      const message =
        err instanceof Error ? err.message : 'Failed to analyze prototypes';
      setError(message);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const clear = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return { analysis, loading, error, analyze, clear };
}
