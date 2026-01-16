/**
 * @file Hook for header stats with auto-refresh for TTL display
 */

import { useCallback, useEffect, useState } from 'react';

import { DEFAULT_REPOSITORY_TTL_MS } from '../lib/repository/protopedia-repository';

import { useProtopediaRepository } from './repository-context';

import type { PrototypeInMemoryStats } from 'promidas';

export type HeaderStats = PrototypeInMemoryStats & {
  fetchedAt: number;
};

export function useHeaderStats() {
  const repository = useProtopediaRepository();
  const [stats, setStats] = useState<HeaderStats | null>(null);

  const updateStats = useCallback(async () => {
    if (!repository) {
      setStats(null);
      return;
    }
    try {
      const repo = repository;
      const result = repo.getStats();
      const fetchedAt = Date.now();

      console.debug('[useHeaderStats] Fetched header stats', {
        size: result.size,
        remainingTtlMs: result.remainingTtlMs,
        fetchedAt: new Date(fetchedAt).toISOString(),
      });

      setStats({ ...result, fetchedAt });
    } catch (err) {
      console.error('[PROMIDAS Playground] useHeaderStats update failed:', err);
      setStats(null);
    }
  }, [repository]);

  // Stats are updated manually via updateStats() calls

  useEffect(() => {
    // Schedule next update when TTL expires instead of polling
    let timeoutId: number | undefined;

    const scheduleNextUpdate = async () => {
      if (!repository) {
        return;
      }

      try {
        const repo = repository;
        const currentStats = repo.getStats();

        if (currentStats.cachedAt instanceof Date && !currentStats.isExpired) {
          // Calculate time until expiration
          const now = Date.now();
          const expiresAt =
            currentStats.cachedAt.getTime() + DEFAULT_REPOSITORY_TTL_MS;
          const timeUntilExpiry = expiresAt - now;

          if (timeUntilExpiry > 0) {
            // Schedule update at expiration time
            timeoutId = window.setTimeout(() => {
              updateStats();
            }, timeUntilExpiry + 100); // 100ms buffer
          }
        }
      } catch {
        // Token not set yet or other error
      }
    };

    scheduleNextUpdate();

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [repository, stats, updateStats]);

  const clearStats = useCallback(() => {
    setStats(null);
  }, []);

  return { stats, updateStats, clearStats };
}
