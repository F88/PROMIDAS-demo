import { useState, useEffect } from "react";
import type {
  NormalizedPrototype,
  ProtopediaInMemoryRepositoryStats,
} from "@f88/promidas";
import type { ListPrototypesParams } from "protopedia-api-v2-client";
import { getProtopediaRepository } from "../lib/protopedia-repository";

export function useRepositoryStats() {
  const [stats, setStats] = useState<ProtopediaInMemoryRepositoryStats | null>(
    null
  );

  const updateStats = () => {
    try {
      const repo = getProtopediaRepository();
      setStats(repo.getStats());
    } catch (err) {
      // Token not set yet
      setStats(null);
    }
  };

  useEffect(() => {
    updateStats();

    // Schedule next update when TTL expires instead of polling
    const scheduleNextUpdate = () => {
      try {
        const repo = getProtopediaRepository();
        const currentStats = repo.getStats();

        if (currentStats.cachedAt && !currentStats.isExpired) {
          // Calculate time until expiration
          const now = Date.now();
          const expiresAt = currentStats.cachedAt + 30000; // ttlMs from repository config
          const timeUntilExpiry = expiresAt - now;

          if (timeUntilExpiry > 0) {
            return setTimeout(() => {
              updateStats();
              scheduleNextUpdate();
            }, timeUntilExpiry + 100); // Add small buffer
          }
        }
      } catch (err) {
        // Token not set yet
      }
      return undefined;
    };

    const timeout = scheduleNextUpdate();
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return { stats, updateStats };
}

export function useRandomPrototype() {
  const [prototype, setPrototype] = useState<NormalizedPrototype | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandom = async () => {
    setLoading(true);
    setError(null);

    try {
      const repo = getProtopediaRepository();
      const stats = repo.getStats();

      // Setup snapshot if not initialized or expired
      if (stats.size === 0 || stats.isExpired) {
        await repo.setupSnapshot({ offset: 0, limit: 100 });
      }

      const randomPrototype = await repo.getRandomPrototypeFromSnapshot();

      if (!randomPrototype) {
        setError("No prototypes available in snapshot");
        setPrototype(null);
      } else {
        setPrototype(randomPrototype);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch prototype"
      );
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setPrototype(null);
    setError(null);
  };

  return { prototype, loading, error, fetchRandom, clear };
}

export function useSnapshotManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const setupSnapshot = async (params: ListPrototypesParams = {}) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const repo = getProtopediaRepository();
      await repo.setupSnapshot(params);
      const limit = params.limit || 100;
      setSuccess(`Snapshot initialized with up to ${limit} prototypes`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to setup snapshot");
    } finally {
      setLoading(false);
    }
  };

  const refreshSnapshot = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const repo = getProtopediaRepository();
      await repo.refreshSnapshot();
      setSuccess("Snapshot refreshed successfully");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refresh snapshot"
      );
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, setupSnapshot, refreshSnapshot };
}

export function usePrototypeSearch() {
  const [prototype, setPrototype] = useState<NormalizedPrototype | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchById = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const repo = getProtopediaRepository();
      const result = await repo.getPrototypeFromSnapshotById(id);

      if (!result) {
        setError(`Prototype with ID ${id} not found in snapshot`);
        setPrototype(null);
      } else {
        setPrototype(result);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to search prototype"
      );
      setPrototype(null);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setPrototype(null);
    setError(null);
  };

  return { prototype, loading, error, searchById, clear };
}
