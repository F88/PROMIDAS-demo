/**
 * @file Hook for store display stats (manual update only)
 */

import { useState, useCallback } from 'react';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import { getProtopediaRepository } from '../lib/repository/protopedia-repository';
import { useToken } from './use-token';

export type StoreStats = PrototypeInMemoryStats & {
  fetchedAt: number;
};

export function useStoreStats() {
  const { hasToken } = useToken();
  const [stats, setStats] = useState<StoreStats | null>(null);

  const updateStats = useCallback(() => {
    if (!hasToken) {
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
      console.error('[PROMIDAS Playground] useStoreStats update failed:', err);
      setStats(null);
    }
  }, [hasToken]);

  const clearStats = useCallback(() => {
    setStats(null);
  }, []);

  return { stats, updateStats, clearStats };
}
