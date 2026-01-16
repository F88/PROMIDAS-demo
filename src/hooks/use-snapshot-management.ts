/**
 * @file Hook for managing snapshot setup and refresh operations
 *
 * **DEMO SITE FEATURE**: This hook includes detailed console logging for
 * demonstration and debugging purposes. Do not remove console.debug or
 * console.error statements - they are essential for showing PROMIDAS
 * behavior to demo site users.
 */

import {
  ValidationError,
  type SnapshotOperationFailure,
  type SnapshotOperationResult,
} from 'promidas/repository';
import { useEffect, useState } from 'react';

import { useProtopediaRepository } from './repository-context';
import {
  handleSnapshotOperationError,
  logFetchResult,
} from './snapshot-helpers';
import { emitDownloadProgress } from './use-download-progress';

import type { PrototypeInMemoryStats } from 'promidas';
import type { SerializableSnapshot } from 'promidas/repository/types';
import type { ListPrototypesParams } from 'protopedia-api-v2-client';

export function useSnapshotManagement() {
  const repository = useProtopediaRepository();
  const [setupLoading, setSetupLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [setupError, setSetupError] = useState<SnapshotOperationFailure | null>(
    null,
  );
  const [setupSuccess, setSetupSuccess] = useState<string | null>(null);
  const [refreshError, setRefreshError] =
    useState<SnapshotOperationFailure | null>(null);
  const [refreshSuccess, setRefreshSuccess] = useState<string | null>(null);
  const [importError, setImportError] =
    useState<SnapshotOperationFailure | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState<PrototypeInMemoryStats | null>(null);

  // Clear errors when repository is destroyed
  useEffect(() => {
    if (!repository) {
      setSetupError(null);
      setSetupSuccess(null);
      setRefreshError(null);
      setRefreshSuccess(null);
      setImportError(null);
      setImportSuccess(null);
      setExportSuccess(null);
    }
  }, [repository]);

  const setupSnapshot = async (params: ListPrototypesParams = {}) => {
    if (!repository) {
      setSetupError({
        ok: false,
        origin: 'unknown',
        message:
          'Repository is not initialized. Please create repository first.',
      });
      return;
    }

    setSetupLoading(true);
    setSetupError(null);
    setSetupSuccess(null);

    try {
      const result: SnapshotOperationResult =
        await repository.setupSnapshot(params);

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
    if (!repository) {
      setRefreshError({
        ok: false,
        origin: 'unknown',
        message:
          'Repository is not initialized. Please create repository first.',
      });
      return;
    }

    setRefreshLoading(true);
    setRefreshError(null);
    setRefreshSuccess(null);

    try {
      const result: SnapshotOperationResult =
        await repository.refreshSnapshot();

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

  const exportSnapshotToJson = () => {
    if (!repository) {
      console.error('Repository not initialized for export');
      return;
    }

    setExportSuccess(null);

    try {
      const snapshot: SerializableSnapshot =
        repository.getSerializableSnapshot();
      const prototypeCount = snapshot.prototypes.length;
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const fileName = `promidas-snapshot-${new Date().toISOString().replace(/:/g, '-')}.json`;
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.info(
        `Snapshot exported successfully with ${prototypeCount.toLocaleString()} prototypes`,
      );
      setExportSuccess(
        `Snapshot exported to ${fileName} (${prototypeCount.toLocaleString()} prototypes)`,
      );
    } catch (err) {
      console.error('Failed to export snapshot:', err);
    }
  };

  const exportSnapshotToTsv = () => {
    if (!repository) {
      console.error('Repository not initialized for export');
      return;
    }

    setExportSuccess(null);

    try {
      const snapshot: SerializableSnapshot =
        repository.getSerializableSnapshot();
      const prototypeCount = snapshot.prototypes.length;
      const headers = [
        'id',
        'prototypeNm',
        'teamNm',
        'users',
        'tags',
        'materials',
        'events',
        'awards',
        'status',
        'releaseFlg',
        'licenseType',
        'thanksFlg',
        'viewCount',
        'goodCount',
        'commentCount',
        'createDate',
        'updateDate',
        'releaseDate',
        'mainUrl',
        'officialLink',
        'videoUrl',
        'relatedLink',
        'relatedLink2',
        'relatedLink3',
        'relatedLink4',
        'relatedLink5',
      ];

      const sanitize = (value: unknown): string => {
        if (value === undefined || value === null) return '';
        const normalizedValue = Array.isArray(value)
          ? value.join('|')
          : String(value);
        return normalizedValue.replace(/\t/g, ' ').replace(/\r?\n/g, ' ');
      };

      const rows = snapshot.prototypes.map((prototype) => [
        sanitize(prototype.id),
        sanitize(prototype.prototypeNm),
        sanitize(prototype.teamNm),
        sanitize(prototype.users),
        sanitize(prototype.tags),
        sanitize(prototype.materials),
        sanitize(prototype.events),
        sanitize(prototype.awards),
        sanitize(prototype.status),
        sanitize(prototype.releaseFlg),
        sanitize(prototype.licenseType),
        sanitize(prototype.thanksFlg),
        sanitize(prototype.viewCount),
        sanitize(prototype.goodCount),
        sanitize(prototype.commentCount),
        sanitize(prototype.createDate),
        sanitize(prototype.updateDate),
        sanitize(prototype.releaseDate),
        sanitize(prototype.mainUrl),
        sanitize(prototype.officialLink),
        sanitize(prototype.videoUrl),
        sanitize(prototype.relatedLink),
        sanitize(prototype.relatedLink2),
        sanitize(prototype.relatedLink3),
        sanitize(prototype.relatedLink4),
        sanitize(prototype.relatedLink5),
      ]);

      const tsvContent =
        [headers.join('\t'), ...rows.map((row) => row.join('\t'))].join('\n') +
        '\n';

      const blob = new Blob([tsvContent], {
        type: 'text/tab-separated-values;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const fileName = `promidas-snapshot-${new Date().toISOString().replace(/:/g, '-')}.tsv`;
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.info(
        `Snapshot TSV exported successfully with ${prototypeCount.toLocaleString()} prototypes`,
      );
      setExportSuccess(
        `Snapshot TSV exported to ${fileName} (${prototypeCount.toLocaleString()} prototypes)`,
      );
    } catch (err) {
      console.error('Failed to export snapshot as TSV:', err);
    }
  };

  const importSnapshot = (data: SerializableSnapshot) => {
    if (!repository) {
      setImportError({
        ok: false,
        origin: 'unknown',
        message: 'Repository not initialized',
      });
      return;
    }

    setImportLoading(true);
    setImportError(null);
    setImportSuccess(null);

    try {
      const result: SnapshotOperationResult =
        repository.setupSnapshotFromSerializedData(data);

      logFetchResult('importSnapshot', result);

      if (!result.ok) {
        handleSnapshotOperationError(result, setImportError);
      } else {
        setImportSuccess('Snapshot imported successfully');
        setStats(result.stats);
      }
    } catch (err) {
      setImportError({
        ok: false,
        origin: 'unknown',
        message:
          err instanceof Error ? err.message : 'Failed to import snapshot',
      });
    } finally {
      setImportLoading(false);
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

  const clearImportState = () => {
    setImportError(null);
    setImportSuccess(null);
  };

  const clearExportState = () => {
    setExportSuccess(null);
  };

  return {
    setupLoading,
    refreshLoading,
    importLoading,
    setupError,
    setupSuccess,
    refreshError,
    refreshSuccess,
    importError,
    importSuccess,
    exportSuccess,
    stats,
    setupSnapshot,
    refreshSnapshot,
    exportSnapshotToJson,
    exportSnapshotToTsv,
    importSnapshot,
    clearSetupState,
    clearRefreshState,
    clearImportState,
    clearExportState,
  };
}
