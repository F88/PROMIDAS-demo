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
import type { ProtopediaApiCustomClientConfig } from '@f88/promidas/fetcher';
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
    progressCallback: {
      onStart: (estimatedTotal, limit, prepareTime) => {
        console.debug('[Download Progress] Started', {
          estimatedBytes: estimatedTotal,
          limit,
          prepareTimeMs: Math.round(prepareTime * 1000),
        });
        emitDownloadProgress({
          status: 'started',
          estimatedBytes: estimatedTotal,
          limit,
          prepareTimeMs: Math.round(prepareTime * 1000),
        });
      },
      onProgress: (received, total, percentage) => {
        console.debug('[Download Progress] In progress', {
          receivedBytes: received,
          totalBytes: total,
          percentage,
        });
        emitDownloadProgress({
          status: 'in-progress',
          receivedBytes: received,
          estimatedBytes: total,
          percentage,
        });
      },
      onComplete: (received, estimatedTotal, downloadTime, totalTime) => {
        console.debug('[Download Progress] Completed', {
          receivedBytes: received,
          estimatedBytes: estimatedTotal,
          downloadTimeMs: Math.round(downloadTime * 1000),
          totalTimeMs: Math.round(totalTime * 1000),
        });
        emitDownloadProgress({
          status: 'completed',
          receivedBytes: received,
          estimatedBytes: estimatedTotal,
          downloadTimeMs: Math.round(downloadTime * 1000),
          totalTimeMs: Math.round(totalTime * 1000),
        });
      },
    },
  };

  const repositoryConfig: ProtopediaInMemoryRepositoryConfig = {
    logLevel,
    enableEvents: true,
  };

  return { storeConfig, repositoryConfig, apiClientConfig };
}
