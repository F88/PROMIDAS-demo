/**
 * @file Hook for store display stats (manual update only)
 */

import { useState, useCallback } from 'react';

import { useProtopediaRepository } from './repository-context';

import type { PrototypeInMemoryStats } from 'promidas';

export type StoreStats = PrototypeInMemoryStats & {
  fetchedAt: number;
};

export function useStoreStats() {
  const repository = useProtopediaRepository();
  const [stats, setStats] = useState<StoreStats | null>(null);

  const updateStats = useCallback(async () => {
    if (!repository) {
      setStats(null);
      return;
    }
    try {
      const repo = repository;
      const result = repo.getStats();
      const fetchedAt = Date.now();

      console.debug('[useStoreStats] Fetched store stats', {
        size: result.size,
        cachedAt: result.cachedAt,
        isExpired: result.isExpired,
        fetchedAt: new Date(fetchedAt).toISOString(),
      });

      setStats({ ...result, fetchedAt });
    } catch (err) {
      console.error('[PROMIDAS Playground] useStoreStats update failed:', err);
      setStats(null);
    }
  }, [repository]);

  // Stats are updated manually via updateStats() calls

  const clearStats = useCallback(() => {
    setStats(null);
  }, []);

  return { stats, updateStats, clearStats };
}
