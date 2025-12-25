/**
 * @file Hook for header stats with auto-refresh for TTL display
 */

import { useState, useEffect, useCallback } from 'react';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import {
  getProtopediaRepository,
  REPOSITORY_TTL_MS,
} from '../lib/repository/protopedia-repository';
import { useToken } from './use-token';

export type HeaderStats = PrototypeInMemoryStats & {
  fetchedAt: number;
};

export function useHeaderStats() {
  const { hasToken } = useToken();
  const [stats, setStats] = useState<HeaderStats | null>(() => {
    if (!hasToken) {
      return null;
    }
    try {
      const repo = getProtopediaRepository();
      const result = repo.getStats();
      return { ...result, fetchedAt: Date.now() };
    } catch (err) {
      console.error('[PROMIDAS Playground] useHeaderStats init failed:', err);
      return null;
    }
  });

  const updateStats = useCallback(() => {
    if (!hasToken) {
      setStats(null);
      return;
    }
    try {
      const repo = getProtopediaRepository();
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
  }, [hasToken]);

  useEffect(() => {
    // Schedule next update when TTL expires instead of polling
    const scheduleNextUpdate = () => {
      if (!hasToken) {
        return undefined;
      }

      try {
        const repo = getProtopediaRepository();
        const currentStats = repo.getStats();

        if (currentStats.cachedAt instanceof Date && !currentStats.isExpired) {
          // Calculate time until expiration
          const now = Date.now();
          const expiresAt = currentStats.cachedAt.getTime() + REPOSITORY_TTL_MS;
          const timeUntilExpiry = expiresAt - now;

          if (timeUntilExpiry > 0) {
            // Schedule update at expiration time
            const timeoutId = window.setTimeout(() => {
              updateStats();
            }, timeUntilExpiry + 100); // 100ms buffer

            return () => window.clearTimeout(timeoutId);
          }
        }
      } catch {
        // Token not set yet or other error
      }
      return undefined;
    };

    const cleanup = scheduleNextUpdate();
    return () => cleanup?.();
  }, [stats, updateStats]);

  const clearStats = useCallback(() => {
    setStats(null);
  }, []);

  return { stats, updateStats, clearStats };
}
