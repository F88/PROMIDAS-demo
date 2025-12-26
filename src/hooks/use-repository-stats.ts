/**
 * @file Hook for fetching repository stats
 *
 * **DEMO SITE FEATURE**: This hook includes detailed console logging for
 * demonstration and debugging purposes. Do not remove console.debug or
 * console.error statements - they are essential for showing PROMIDAS
 * behavior to demo site users.
 */

import { useCallback, useEffect, useState } from 'react';

import type { PrototypeInMemoryStats } from '@f88/promidas';

import { DEFAULT_REPOSITORY_TTL_MS } from '../lib/repository/constants';
import { useProtopediaRepository } from './repository-context';

export type RepositoryStats = PrototypeInMemoryStats & {
  fetchedAt: number;
};

export function useRepositoryStats() {
  const repository = useProtopediaRepository();
  const [stats, setStats] = useState<RepositoryStats | null>(null);

  const updateStats = useCallback(async () => {
    if (!repository) {
      setStats(null);
      return;
    }
    try {
      const result = repository.getStats();
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
      console.error(
        '[PROMIDAS Playground] useRepositoryStats update failed:',
        err,
      );
      // Token not set yet
      setStats(null);
    }
  }, [repository]);

  // Stats are updated manually via updateStats() calls

  useEffect(() => {
    // Schedule next update when TTL expires instead of polling
    let timeout: number | undefined;

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
            timeout = window.setTimeout(() => {
              updateStats();
            }, timeUntilExpiry + 100); // Add small buffer
          }
        }
      } catch (err) {
        console.error(
          '[PROMIDAS Playground] scheduling next stats update failed:',
          err,
        );
      }
    };

    scheduleNextUpdate();

    return () => {
      if (timeout !== undefined) {
        window.clearTimeout(timeout);
      }
    };
  }, [repository, stats, updateStats]);

  const clearStats = () => {
    setStats(null);
  };

  return { stats, updateStats, clearStats };
}
