/**
 * @file Hook for managing snapshot setup and refresh operations
 *
 * **DEMO SITE FEATURE**: This hook includes detailed console logging for
 * demonstration and debugging purposes. Do not remove console.debug or
 * console.error statements - they are essential for showing PROMIDAS
 * behavior to demo site users.
 */

import { useState } from 'react';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import {
  ValidationError,
  type SnapshotOperationResult,
} from '@f88/promidas/repository';
import type { ListPrototypesParams } from 'protopedia-api-v2-client';
import { getProtopediaRepository } from '../lib/repository/protopedia-repository';
import {
  logFetchResult,
  handleSnapshotOperationError,
} from './snapshot-helpers';

export function useSnapshotManagement() {
  const [setupLoading, setSetupLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [setupSuccess, setSetupSuccess] = useState<string | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [refreshSuccess, setRefreshSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState<PrototypeInMemoryStats | null>(null);

  const setupSnapshot = async (params: ListPrototypesParams = {}) => {
    setSetupLoading(true);
    setSetupError(null);
    setSetupSuccess(null);

    try {
      const repo = getProtopediaRepository();
      const result = await repo.setupSnapshot(params);

      // Demo site: Log full error information to console for debugging
      // DO NOT REMOVE: This helps users understand PROMIDAS error responses
      logFetchResult('setupSnapshot', result);

      // Check if setup was successful
      if (!result.ok) {
        handleSnapshotOperationError(result, setSetupError);
      } else {
        const limit = params.limit || 100;
        setSetupSuccess(`Snapshot initialized with up to ${limit} prototypes`);
        // Set stats from result
        setStats(result.stats);
      }
    } catch (err) {
      if (err instanceof ValidationError) {
        setSetupError(
          `Validation error${err.field ? ` in ${err.field}` : ''}: ${
            err.message
          }`,
        );
      } else {
        setSetupError(
          err instanceof Error ? err.message : 'Failed to setup snapshot',
        );
      }
    } finally {
      setSetupLoading(false);
    }
  };

  const refreshSnapshot = async () => {
    setRefreshLoading(true);
    setRefreshError(null);
    setRefreshSuccess(null);

    try {
      const repo = getProtopediaRepository();
      const result: SnapshotOperationResult = await repo.refreshSnapshot();

      // Demo site: Log full error information to console for debugging
      // DO NOT REMOVE: This helps users understand PROMIDAS error responses
      logFetchResult('refreshSnapshot', result);

      if (!result.ok) {
        handleSnapshotOperationError(result, setRefreshError);
      } else {
        setRefreshSuccess('Snapshot refreshed successfully');
        // Set stats from result
        setStats(result.stats);
      }
    } catch (err) {
      if (err instanceof ValidationError) {
        setRefreshError(
          `Validation error${err.field ? ` in ${err.field}` : ''}: ${
            err.message
          }`,
        );
      } else {
        setRefreshError(
          err instanceof Error ? err.message : 'Failed to refresh snapshot',
        );
      }
    } finally {
      setRefreshLoading(false);
    }
  };

  const clearSetupState = () => {
    setSetupError(null);
    setSetupSuccess(null);
  };

  const clearRefreshState = () => {
    setRefreshError(null);
    setRefreshSuccess(null);
  };

  return {
    setupLoading,
    refreshLoading,
    setupError,
    setupSuccess,
    refreshError,
    refreshSuccess,
    stats,
    setupSnapshot,
    refreshSnapshot,
    clearSetupState,
    clearRefreshState,
  };
}
