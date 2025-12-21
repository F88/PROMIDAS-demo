import type {
  ProtopediaInMemoryRepositoryConfig,
  PrototypeInMemoryStoreConfig,
} from '@f88/promidas';
import type { ProtopediaApiCustomClientConfig } from '@f88/promidas/fetcher';
import type { LogLevel } from '@f88/promidas/logger';
import { LIMIT_DATA_SIZE_BYTES } from '@f88/promidas/store';
import { emitDownloadProgress } from '../../hooks/use-download-progress';
import { REPOSITORY_TTL_MS } from './constants';
import { createFetch } from './create-fetch';

type CreateRepositoryConfigResult = {
  storeConfig: PrototypeInMemoryStoreConfig;
  repositoryConfig: ProtopediaInMemoryRepositoryConfig;
  apiClientConfig: ProtopediaApiCustomClientConfig;
};

export function createRepositoryConfigs(
  token: string,
  logLevel: LogLevel,
): CreateRepositoryConfigResult {
  const storeConfig: PrototypeInMemoryStoreConfig = {
    ttlMs: REPOSITORY_TTL_MS,
    // maxDataSizeBytes: LIMIT_DATA_SIZE_BYTES /* imported from @f88/promidas/store */,
    // maxDataSizeBytes: REPOSITORY_MAX_DATA_SIZE,
    maxDataSizeBytes: LIMIT_DATA_SIZE_BYTES,
    logLevel,
  };

  const repositoryConfig: ProtopediaInMemoryRepositoryConfig = {
    logLevel,
    enableEvents: true,
  };

  const apiClientConfig: ProtopediaApiCustomClientConfig = {
    protoPediaApiClientOptions: {
      logLevel,
      token,
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

  return { storeConfig, repositoryConfig, apiClientConfig };
}
