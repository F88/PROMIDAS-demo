/**
 * @file Unit tests for repository configuration builder utilities.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  return {
    emitDownloadProgress: vi.fn(),
  };
});

vi.mock('../../../hooks/use-download-progress', () => {
  return {
    emitDownloadProgress: mocks.emitDownloadProgress,
  };
});

import { createRepositoryConfigs } from '../../repository/repository-config';
import { REPOSITORY_TTL_MS } from '../../repository/constants';
import { LIMIT_DATA_SIZE_BYTES } from '@f88/promidas/store';

describe('repository-config', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    mocks.emitDownloadProgress.mockClear();
    globalThis.fetch = vi.fn(async () => {
      return { ok: true } as unknown as Response;
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('store defaults', () => {
    it('creates configs with expected store defaults', () => {
      const { storeConfig, repositoryConfig, apiClientConfig } =
        createRepositoryConfigs('token', 'debug');

      expect(storeConfig.ttlMs).toBe(REPOSITORY_TTL_MS);
      expect(storeConfig.maxDataSizeBytes).toBe(LIMIT_DATA_SIZE_BYTES);
      expect(repositoryConfig.enableEvents).toBe(true);

      expect(apiClientConfig.progressLog).toBe(true);
      expect(typeof apiClientConfig.protoPediaApiClientOptions?.fetch).toBe(
        'function',
      );
    });
  });

  describe('custom fetch', () => {
    it('forwards RequestInit.headers as-is', async () => {
      const { apiClientConfig } = createRepositoryConfigs('token', 'debug');
      const customFetch = apiClientConfig.protoPediaApiClientOptions?.fetch;

      expect(customFetch).toBeDefined();

      const headersObject = {
        'x-client-user-agent': 'promidas-demo',
        authorization: 'Bearer test',
      };

      await customFetch?.('https://example.com', {
        headers: headersObject,
      });

      expect(globalThis.fetch).toHaveBeenCalledTimes(1);

      const fetchMock = globalThis.fetch as unknown as {
        mock: { calls: Array<readonly [unknown, RequestInit | undefined]> };
      };
      const init = fetchMock.mock.calls[0]?.[1];

      if (!init) {
        throw new Error('Expected fetch to be called with init');
      }

      expect(init.headers).toBe(headersObject);
    });
  });

  describe('download progress', () => {
    it('progress callbacks emit download progress events', () => {
      const { apiClientConfig } = createRepositoryConfigs('token', 'debug');
      const cb = apiClientConfig.progressCallback;

      if (!cb?.onStart || !cb.onProgress || !cb.onComplete) {
        throw new Error('Expected progressCallback to be defined');
      }

      cb.onStart(100, 200, 1.234);
      cb.onProgress(10, 100, 10);
      cb.onComplete(100, 100, 2.345, 3.456);

      expect(mocks.emitDownloadProgress).toHaveBeenCalledWith({
        status: 'started',
        estimatedBytes: 100,
        limit: 200,
        prepareTimeMs: 1234,
      });

      expect(mocks.emitDownloadProgress).toHaveBeenCalledWith({
        status: 'in-progress',
        receivedBytes: 10,
        estimatedBytes: 100,
        percentage: 10,
      });

      expect(mocks.emitDownloadProgress).toHaveBeenCalledWith({
        status: 'completed',
        receivedBytes: 100,
        estimatedBytes: 100,
        downloadTimeMs: 2345,
        totalTimeMs: 3456,
      });
    });
  });
});
