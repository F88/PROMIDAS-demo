/**
 * @file Hook for managing snapshot setup and refresh operations
 *
 * **DEMO SITE FEATURE**: This hook includes detailed console logging for
 * demonstration and debugging purposes. Do not remove console.debug or
 * console.error statements - they are essential for showing PROMIDAS
 * behavior to demo site users.
 */

import { useState } from "react";
import type { PrototypeInMemoryStats } from "@f88/promidas";
import {
  ValidationError,
  type SnapshotOperationResult,
} from "@f88/promidas/repository";
import type { ListPrototypesParams } from "protopedia-api-v2-client";
import { getProtopediaRepository } from "../lib/protopedia-repository";
import {
  logFetchResult,
  handleSnapshotOperationError,
} from "./snapshot-helpers";

export function useSnapshotManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState<PrototypeInMemoryStats | null>(null);

  const setupSnapshot = async (params: ListPrototypesParams = {}) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const repo = getProtopediaRepository();
      const result = await repo.setupSnapshot(params);

      // Demo site: Log full error information to console for debugging
      // DO NOT REMOVE: This helps users understand PROMIDAS error responses
      logFetchResult("setupSnapshot", result);

      // Check if setup was successful
      if (!result.ok) {
        handleSnapshotOperationError(result, setError);
      } else {
        const limit = params.limit || 100;
        setSuccess(`Snapshot initialized with up to ${limit} prototypes`);
        // Set stats from result
        setStats(result.stats);
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

      // Demo site: Log full error information to console for debugging
      // DO NOT REMOVE: This helps users understand PROMIDAS error responses
      logFetchResult("refreshSnapshot", result);

      if (!result.ok) {
        handleSnapshotOperationError(result, setError);
      } else {
        setSuccess("Snapshot refreshed successfully");
        // Set stats from result
        setStats(result.stats);
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
          err instanceof Error ? err.message : "Failed to refresh snapshot"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, stats, setupSnapshot, refreshSnapshot };
}
