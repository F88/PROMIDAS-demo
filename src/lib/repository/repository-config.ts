/**
 * @file Repository/store/API client configuration builders.
 *
 * This module centralizes the demo app's configuration for PROMIDAS so the UI
 * can remain focused on interactions and presentation.
 */

import type {
  ProtopediaInMemoryRepositoryConfig,
  PrototypeInMemoryStoreConfig,
} from '@f88/promidas';
import type {
  ProtopediaApiCustomClientConfig,
  FetchProgressEvent,
} from '@f88/promidas/fetcher';
import type { LogLevel } from '@f88/promidas/logger';
import { emitDownloadProgress } from '../../hooks/use-download-progress';
import { createFetch } from './create-fetch';
import { loadStoreSettings } from './repository-settings';

type CreateRepositoryConfigResult = {
  storeConfig: PrototypeInMemoryStoreConfig;
  repositoryConfig: ProtopediaInMemoryRepositoryConfig;
  apiClientConfig: ProtopediaApiCustomClientConfig;
};

/**
 * Creates PROMIDAS configuration objects used to build the repository.
 */
export function createRepositoryConfigs(
  token: string | null,
  logLevel: LogLevel,
): CreateRepositoryConfigResult {
  const settings = loadStoreSettings();

  const storeConfig: PrototypeInMemoryStoreConfig = {
    ttlMs: settings.ttlMs,
    maxDataSizeBytes: settings.maxDataSizeBytes,
    logLevel,
  };

  const apiClientConfig: ProtopediaApiCustomClientConfig = {
    protoPediaApiClientOptions: {
      logLevel,
      token: token ?? undefined,
      fetch: createFetch(),
    },
    progressLog: true,
    progressCallback: (event: FetchProgressEvent) => {
      switch (event.type) {
        case 'request-start':
          console.info('[Download Progress] Request started');
          emitDownloadProgress({
            status: 'request-start',
          });
          break;
        case 'response-received':
          console.info('[Download Progress] Started', {
            estimatedBytes: event.estimatedTotal,
            limit: event.limit,
            prepareTimeMs: event.prepareTimeMs,
          });
          emitDownloadProgress({
            status: 'started',
            estimatedBytes: event.estimatedTotal,
            limit: event.limit,
            prepareTimeMs: event.prepareTimeMs,
          });
          break;
        case 'download-progress':
          console.info('[Download Progress] In progress', {
            receivedBytes: event.received,
            totalBytes: event.total,
            percentage: event.percentage,
          });
          emitDownloadProgress({
            status: 'in-progress',
            receivedBytes: event.received,
            estimatedBytes: event.total,
            percentage: event.percentage,
          });
          break;
        case 'complete':
          console.info('[Download Progress] Completed', {
            receivedBytes: event.received,
            estimatedBytes: event.estimatedTotal,
            downloadTimeMs: event.downloadTimeMs,
            totalTimeMs: event.totalTimeMs,
          });
          emitDownloadProgress({
            status: 'completed',
            receivedBytes: event.received,
            estimatedBytes: event.estimatedTotal,
            downloadTimeMs: event.downloadTimeMs,
            totalTimeMs: event.totalTimeMs,
          });
          break;
        case 'error':
          console.error('[Download Progress] Error', {
            error: event.error,
            receivedBytes: event.received,
            estimatedBytes: event.estimatedTotal,
            downloadTimeMs: event.downloadTimeMs,
            totalTimeMs: event.totalTimeMs,
          });
          emitDownloadProgress({
            status: 'error',
            errorMessage: event.error,
            receivedBytes: event.received,
            estimatedBytes: event.estimatedTotal,
            downloadTimeMs: event.downloadTimeMs,
            totalTimeMs: event.totalTimeMs,
          });
          break;
      }
    },
  };

  const repositoryConfig: ProtopediaInMemoryRepositoryConfig = {
    logLevel,
    enableEvents: true,
  };

  return { storeConfig, repositoryConfig, apiClientConfig };
}
