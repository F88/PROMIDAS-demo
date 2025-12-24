/**
 * @file Hook for store display stats (manual update only)
 */

import { useState, useCallback } from 'react';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import { getProtopediaRepository } from '../lib/repository/protopedia-repository';
import { hasApiToken } from '../lib/token/token-storage';

export type StoreStats = PrototypeInMemoryStats & {
  fetchedAt: number;
};

export function useStoreStats() {
  const [stats, setStats] = useState<StoreStats | null>(null);

  const updateStats = useCallback(() => {
    if (!hasApiToken()) {
      setStats(null);
      return;
    }
    try {
      const repo = getProtopediaRepository();
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
      console.error('[PROMIDAS Demo] useStoreStats update failed:', err);
      setStats(null);
    }
  }, []);

  const clearStats = useCallback(() => {
    setStats(null);
  }, []);

  return { stats, updateStats, clearStats };
}
