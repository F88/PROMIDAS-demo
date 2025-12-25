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
  type SnapshotOperationFailure,
} from '@f88/promidas/repository';
import type { ListPrototypesParams } from 'protopedia-api-v2-client';
import {
  useEnsureProtopediaRepository,
  useProtopediaRepository,
} from './repository-context';
import {
  logFetchResult,
  handleSnapshotOperationError,
} from './snapshot-helpers';
import { emitDownloadProgress } from './use-download-progress';
import { RepositoryConfigurationError } from '../lib/repository/init-error';

function buildInitFailureMessage(err: unknown): string {
  if (err instanceof RepositoryConfigurationError) {
    const hints = err.diagnostics.hints ?? [];
    const hinted = hints.length > 0 ? hints.join('\n') : undefined;
    const fallback = err.message || hinted;
    return fallback || 'Repository initialization failed.';
  }

  return 'Repository is not available. Please set API token first.';
}

export function useSnapshotManagement() {
  const repository = useProtopediaRepository();
  const ensureRepository = useEnsureProtopediaRepository();
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
    const repo =
      repository ??
      (await ensureRepository().catch((err) => {
        console.error(
          '[setupSnapshot] Repository initialization failed before setup:',
          err,
        );
        setSetupError({
          ok: false,
          origin: 'unknown',
          message: buildInitFailureMessage(err),
        });
        return null;
      }));

    if (!repo) {
      return;
    }

    setSetupLoading(true);
    setSetupError(null);
    setSetupSuccess(null);

    try {
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
    const repo =
      repository ??
      (await ensureRepository().catch((err) => {
        console.error(
          '[refreshSnapshot] Repository initialization failed before refresh:',
          err,
        );
        setRefreshError({
          ok: false,
          origin: 'unknown',
          message: buildInitFailureMessage(err),
        });
        return null;
      }));

    if (!repo) {
      return;
    }

    setRefreshLoading(true);
    setRefreshError(null);
    setRefreshSuccess(null);

    try {
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
