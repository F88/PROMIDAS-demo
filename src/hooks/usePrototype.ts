import { useState, useEffect } from "react";
import type { NormalizedPrototype } from "@f88/promidas/types";
import type { PrototypeInMemoryStats } from "@f88/promidas";
import {
  ValidationError,
  type SnapshotOperationResult,
  type SnapshotOperationSuccess,
} from "@f88/promidas/repository";
import type { ListPrototypesParams } from "protopedia-api-v2-client";
import {
  getProtopediaRepository,
  REPOSITORY_TTL_MS,
} from "../lib/protopedia-repository";

export function useRepositoryStats() {
  const [stats, setStats] = useState<PrototypeInMemoryStats | null>(null);

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

        if (
          typeof currentStats.cachedAt === "number" &&
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

      const randomPrototypes = await repo.getRandomSampleFromSnapshot(1);

      if (randomPrototypes.length === 0) {
        setError("No prototypes available in snapshot");
        setPrototype(null);
      } else {
        setPrototype(randomPrototypes[0] as NormalizedPrototype);
      }
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(
          `Validation error${err.field ? ` in ${err.field}` : ""}: ${
            err.message
          }`
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to fetch prototype"
        );
      }
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
      const result = await repo.setupSnapshot(params);

      // Check if setup was successful
      if (!result.ok) {
        // Demo site: Log full error information to console for debugging
        // DO NOT REMOVE: This helps users understand PROMIDAS error responses
        console.error("[PROMIDAS Demo] setupSnapshot failed:", {
          status: result.status,
          error: result.error,
          code: result.code,
          fullResult: result,
        });

        // Demo site: Show all available information from PROMIDAS
        const parts = [];
        if (result.status) parts.push(`[Status: ${result.status}]`);
        if (result.code) parts.push(`[Code: ${result.code}]`);
        parts.push(result.error || "Unknown error");
        setError(parts.join(" "));
        return;
      }

      const limit = params.limit || 100;
      setSuccess(`Snapshot initialized with up to ${limit} prototypes`);
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(
          `Validation error${err.field ? ` in ${err.field}` : ""}: ${
            err.message
          }`
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to setup snapshot"
        );
      }
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
      const result: SnapshotOperationResult = await repo.refreshSnapshot();

      // Check if refresh was successful
      if (result.ok) {
        console.debug(
          "[PROMIDAS Demo] refreshSnapshot succeeded",
          result as SnapshotOperationSuccess
        );
      } else {
        console.debug(
          "[PROMIDAS Demo] refreshSnapshot failed",
          result as SnapshotOperationResult
        );
      }

      if (!result.ok) {
        // Demo site: Log full error information to console for debugging
        // DO NOT REMOVE: This helps users understand PROMIDAS error responses
        console.error("[PROMIDAS Demo] refreshSnapshot failed:", {
          status: result.status,
          error: result.error,
          details: result.details,
          fullResult: result,
        });

        // Demo site: Show all available information from PROMIDAS
        const parts = [];
        if (result.status) parts.push(`[Status: ${result.status}]`);
        parts.push(result.error || "Unknown error");
        if (result.details && Object.keys(result.details).length > 0) {
          parts.push(`Details: ${JSON.stringify(result.details)}`);
        }
        setError(parts.join(" "));
        return;
      }

      setSuccess("Snapshot refreshed successfully");
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(
          `Validation error${err.field ? ` in ${err.field}` : ""}: ${
            err.message
          }`
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to refresh snapshot"
        );
      }
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
      const result = await repo.getPrototypeFromSnapshotByPrototypeId(id);

      if (!result) {
        setError(`Prototype with ID ${id} not found in snapshot`);
        setPrototype(null);
      } else {
        setPrototype(result);
      }
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(
          `Validation error${err.field ? ` in ${err.field}` : ""}: ${
            err.message
          }`
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to search prototype"
        );
      }
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
      const repo = getProtopediaRepository();
      const result = await repo.analyzePrototypes();
      setAnalysis(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze prototypes"
      );
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  return { analysis, loading, error, analyze };
}

export function useAllPrototypes() {
  const [prototypes, setPrototypes] = useState<NormalizedPrototype[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);

    try {
      const repo = getProtopediaRepository();
      const all = await repo.getAllFromSnapshot();
      setPrototypes([...all] as NormalizedPrototype[]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch all prototypes"
      );
      setPrototypes([]);
    } finally {
      setLoading(false);
    }
  };

  return { prototypes, loading, error, fetchAll };
}
