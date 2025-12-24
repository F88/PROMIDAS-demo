/**
 * @file Hook for managing snapshot setup and refresh operations
 *
 * **DEMO SITE FEATURE**: This hook includes detailed console logging for
 * demonstration and debugging purposes. Do not remove console.debug or
 * console.error statements - they are essential for showing PROMIDAS
 * behavior to demo site users.
 */

import { useState } from 'react';
import type {
  ProtopediaInMemoryRepository,
  PrototypeInMemoryStats,
} from '@f88/promidas';
import {
  ValidationError,
  type SnapshotOperationResult,
  type SnapshotOperationFailure,
} from '@f88/promidas/repository';
import type { ListPrototypesParams } from 'protopedia-api-v2-client';
import { getProtopediaRepository } from '../lib/repository/protopedia-repository';
import {
  logFetchResult,
  handleSnapshotOperationError,
} from './snapshot-helpers';
import { emitDownloadProgress } from './use-download-progress';

export function useSnapshotManagement() {
  const [setupLoading, setSetupLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [setupError, setSetupError] = useState<SnapshotOperationFailure | null>(
    null,
  );
  const [setupSuccess, setSetupSuccess] = useState<string | null>(null);
  const [refreshError, setRefreshError] =
    useState<SnapshotOperationFailure | null>(null);
  const [refreshSuccess, setRefreshSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState<PrototypeInMemoryStats | null>(null);

  const setupSnapshot = async (params: ListPrototypesParams = {}) => {
    setSetupLoading(true);
    setSetupError(null);
    setSetupSuccess(null);

    try {
      const repo: ProtopediaInMemoryRepository = getProtopediaRepository();
      const result: SnapshotOperationResult = await repo.setupSnapshot(params);

      // Demo site: Log full error information to console for debugging
      // DO NOT REMOVE: This helps users understand PROMIDAS error responses
      logFetchResult('setupSnapshot', result);

      // Check if setup was successful
      if (!result.ok) {
        handleSnapshotOperationError(result, setSetupError);
        // Only emit to Fetcher for network/fetch failures, not validation failures
        if (
          result.origin === 'fetcher' &&
          (result.code === 'NETWORK_ERROR' || result.code === 'CORS_BLOCKED')
        ) {
          emitDownloadProgress({
            status: 'error',
            errorMessage: result.message || 'Setup snapshot failed',
          });
        }
      } else {
        const limit = params.limit || 100;
        setSetupSuccess(`Snapshot initialized with up to ${limit} prototypes`);
        // Set stats from result
        setStats(result.stats);
      }
    } catch (err) {
      // Convert exceptions to SnapshotOperationFailure format
      let message: string;
      if (err instanceof ValidationError) {
        message = `Validation error${err.field ? ` in ${err.field}` : ''}: ${err.message}`;
      } else {
        message =
          err instanceof Error ? err.message : 'Failed to setup snapshot';
      }
      setSetupError({
        ok: false,
        origin: 'unknown',
        message,
      });
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
        // Only emit to Fetcher for network/fetch failures, not validation failures
        if (
          result.origin === 'fetcher' &&
          (result.code === 'NETWORK_ERROR' || result.code === 'CORS_BLOCKED')
        ) {
          emitDownloadProgress({
            status: 'error',
            errorMessage: result.message || 'Refresh snapshot failed',
          });
        }
      } else {
        setRefreshSuccess('Snapshot refreshed successfully');
        // Set stats from result
        setStats(result.stats);
      }
    } catch (err) {
      // Convert exceptions to SnapshotOperationFailure format
      let message: string;
      if (err instanceof ValidationError) {
        message = `Validation error${err.field ? ` in ${err.field}` : ''}: ${err.message}`;
      } else {
        message =
          err instanceof Error ? err.message : 'Failed to refresh snapshot';
      }
      setRefreshError({
        ok: false,
        origin: 'unknown',
        message,
      });
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
