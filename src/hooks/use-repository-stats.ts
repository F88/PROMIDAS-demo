/**
 * @file Hook for fetching repository stats
 *
 * **DEMO SITE FEATURE**: This hook includes detailed console logging for
 * demonstration and debugging purposes. Do not remove console.debug or
 * console.error statements - they are essential for showing PROMIDAS
 * behavior to demo site users.
 */

import { useState, useEffect } from 'react';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import {
  getProtopediaRepository,
  REPOSITORY_TTL_MS,
} from '../lib/protopedia-repository';

export function useRepositoryStats() {
  const [stats, setStats] = useState<PrototypeInMemoryStats | null>(() => {
    try {
      const repo = getProtopediaRepository();
      return repo.getStats();
    } catch (err) {
      console.error('[PROMIDAS Demo] useRepositoryStats init failed:', err);
      return null;
    }
  });

  const updateStats = () => {
    try {
      const repo = getProtopediaRepository();
      setStats(repo.getStats());
    } catch (err) {
      console.error('[PROMIDAS Demo] useRepositoryStats update failed:', err);
      // Token not set yet
      setStats(null);
    }
  };

  useEffect(() => {
    // Schedule next update when TTL expires instead of polling
    const scheduleNextUpdate = () => {
      try {
        const repo = getProtopediaRepository();
        const currentStats = repo.getStats();

        if (
          typeof currentStats.cachedAt === 'number' &&
          !currentStats.isExpired
        ) {
          // Calculate time until expiration
          const now = Date.now();
          const expiresAt = currentStats.cachedAt + REPOSITORY_TTL_MS;
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
  }, []);

  const clearStats = () => {
    setStats(null);
  };

  return { stats, updateStats, clearStats };
}
