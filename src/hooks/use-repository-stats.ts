/**
 * @file Hook for fetching repository stats
 *
 * **DEMO SITE FEATURE**: This hook includes detailed console logging for
 * demonstration and debugging purposes. Do not remove console.debug or
 * console.error statements - they are essential for showing PROMIDAS
 * behavior to demo site users.
 */

import { useState, useEffect, useCallback } from 'react';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import {
  getProtopediaRepository,
  REPOSITORY_TTL_MS,
} from '../lib/repository/protopedia-repository';
import { hasApiToken } from '../lib/token/token-storage';

export type RepositoryStats = PrototypeInMemoryStats & {
  fetchedAt: number;
};

export function useRepositoryStats() {
  const [stats, setStats] = useState<RepositoryStats | null>(() => {
    if (!hasApiToken()) {
      return null;
    }
    try {
      const repo = getProtopediaRepository();
      const result = repo.getStats();
      return { ...result, fetchedAt: Date.now() };
    } catch (err) {
      console.error('[PROMIDAS Demo] useRepositoryStats init failed:', err);
      return null;
    }
  });

  const updateStats = useCallback(() => {
    if (!hasApiToken()) {
      setStats(null);
      return;
    }
    try {
      const repo = getProtopediaRepository();
      const result = repo.getStats();
      const fetchedAt = Date.now();

      console.debug('[useRepositoryStats] Fetched repository stats', {
        size: result.size,
        cachedAt: result.cachedAt,
        isExpired: result.isExpired,
        remainingTtlMs: result.remainingTtlMs,
        fetchedAt: new Date(fetchedAt).toISOString(),
      });

      setStats({ ...result, fetchedAt });
    } catch (err) {
      console.error('[PROMIDAS Demo] useRepositoryStats update failed:', err);
      // Token not set yet
      setStats(null);
    }
  }, []);

  useEffect(() => {
    // Schedule next update when TTL expires instead of polling
    const scheduleNextUpdate = () => {
      if (!hasApiToken()) {
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
            return setTimeout(() => {
              updateStats();
              scheduleNextUpdate();
            }, timeUntilExpiry + 100); // Add small buffer
          }
        }
      } catch (err) {
        console.error(
          '[PROMIDAS Demo] scheduling next stats update failed:',
          err,
        );
      }
      return undefined;
    };

    const timeout = scheduleNextUpdate();
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [updateStats]);

  const clearStats = () => {
    setStats(null);
  };

  return { stats, updateStats, clearStats };
}
