/**
 * @file Hook for analyzing prototypes in the snapshot (min/max prototype IDs)
 *
 * **DEMO SITE FEATURE**: This hook includes detailed console logging for
 * demonstration and debugging purposes. Do not remove console.debug or
 * console.error statements - they are essential for showing PROMIDAS
 * behavior to demo site users.
 */

import { useState } from 'react';
import { getProtopediaRepository } from '../lib/protopedia-repository';

export function usePrototypeAnalysis() {
  const [analysis, setAnalysis] = useState<{
    min: number | null;
    max: number | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    setError(null);

    try {
      // *** DEMO SITE: DO NOT REMOVE THIS LOG ***
      console.debug('[PROMIDAS Demo] analyze: Starting analysis');

      const repo = getProtopediaRepository();
      const result = await repo.analyzePrototypes();

      // *** DEMO SITE: DO NOT REMOVE THIS LOG ***
      // Demo site: Log analysis result
      console.debug('[PROMIDAS Demo] analyze: Result', result);

      setAnalysis(result);
    } catch (err) {
      // *** DEMO SITE: DO NOT REMOVE THIS LOG ***
      // Demo site: Log error details
      console.error('[PROMIDAS Demo] analyze failed:', err);

      const message =
        err instanceof Error ? err.message : 'Failed to analyze prototypes';
      setError(message);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setAnalysis(null);
    setError(null);
  };

  return { analysis, loading, error, analyze, clear };
}
