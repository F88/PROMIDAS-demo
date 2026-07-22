/**
 * @file Unit tests for repository configuration builder utilities.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DEFAULT_REPOSITORY_MAX_DATA_SIZE,
  DEFAULT_REPOSITORY_TTL_MS,
} from '../constants';
import { createRepositoryConfigs } from '../repository-config';

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
    it('creates configs with expected store defaults', async () => {
      const { storeConfig, repositoryConfig, apiClientConfig } =
        await createRepositoryConfigs('token', 'debug');

      expect(storeConfig.ttlMs).toBe(DEFAULT_REPOSITORY_TTL_MS);
      expect(storeConfig.maxDataSizeBytes).toBe(
        DEFAULT_REPOSITORY_MAX_DATA_SIZE,
      );
      expect(repositoryConfig.enableEvents).toBe(true);

      expect(apiClientConfig.progressLog).toBe(true);
      expect(typeof apiClientConfig.protoPediaApiClientOptions?.fetch).toBe(
        'function',
      );
    });
  });

  describe('custom fetch', () => {
    it('forwards RequestInit.headers as-is', async () => {
      const { apiClientConfig } = await createRepositoryConfigs(
        'token',
        'debug',
      );
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
    describe('success flow', () => {
      it('emits events for complete download lifecycle', async () => {
        const { apiClientConfig } = await createRepositoryConfigs(
          'token',
          'debug',
        );
        const cb = apiClientConfig.progressCallback;

        if (!cb) {
          throw new Error('Expected progressCallback to be defined');
        }

        cb({ type: 'request-start' });
        cb({
          type: 'response-received',
          status: 200,
          estimatedTotal: 100,
          limit: 200,
          prepareTimeMs: 1234,
        });
        cb({
          type: 'download-progress',
          status: 200,
          received: 10,
          total: 100,
          percentage: 10,
        });
        cb({
          type: 'complete',
          status: 200,
          received: 100,
          estimatedTotal: 100,
          downloadTimeMs: 2345,
          totalTimeMs: 3456,
        });

        expect(mocks.emitDownloadProgress).toHaveBeenCalledWith({
          status: 'started',
          httpStatus: 200,
          estimatedBytes: 100,
          limit: 200,
          prepareTimeMs: 1234,
        });

        expect(mocks.emitDownloadProgress).toHaveBeenCalledWith({
          status: 'in-progress',
          httpStatus: 200,
          receivedBytes: 10,
          estimatedBytes: 100,
          percentage: 10,
        });

        expect(mocks.emitDownloadProgress).toHaveBeenCalledWith({
          status: 'completed',
          httpStatus: 200,
          receivedBytes: 100,
          estimatedBytes: 100,
          downloadTimeMs: 2345,
          totalTimeMs: 3456,
        });
      });

      it('forwards a non-2xx HTTP status on a completed error body (#126)', async () => {
        const { apiClientConfig } = await createRepositoryConfigs(
          'token',
          'debug',
        );
        const cb = apiClientConfig.progressCallback;

        if (!cb) {
          throw new Error('Expected progressCallback to be defined');
        }

        // A 401 error body (e.g. 97-byte JSON) still finishes downloading:
        // the transport reports a completed transfer carrying status 401.
        cb({ type: 'request-start' });
        cb({
          type: 'response-received',
          status: 401,
          estimatedTotal: 25_000_000,
          limit: 100,
          prepareTimeMs: 100,
        });
        cb({
          type: 'complete',
          status: 401,
          received: 97,
          estimatedTotal: 25_000_000,
          downloadTimeMs: 119,
          totalTimeMs: 200,
        });

        expect(mocks.emitDownloadProgress).toHaveBeenCalledWith({
          status: 'completed',
          httpStatus: 401,
          receivedBytes: 97,
          estimatedBytes: 25_000_000,
          downloadTimeMs: 119,
          totalTimeMs: 200,
        });
      });
    });

    describe('error handling', () => {
      it('emits error event when stream reading fails (PROMIDAS v0.15.0)', async () => {
        const { apiClientConfig } = await createRepositoryConfigs(
          'token',
          'debug',
        );
        const cb = apiClientConfig.progressCallback;

        if (!cb) {
          throw new Error('Expected progressCallback to be defined');
        }

        cb({ type: 'request-start' });
        cb({
          type: 'response-received',
          status: 200,
          estimatedTotal: 50000,
          limit: 100,
          prepareTimeMs: 500,
        });
        cb({
          type: 'download-progress',
          status: 200,
          received: 12345,
          total: 50000,
          percentage: 24.69,
        });
        cb({
          type: 'error',
          status: 200,
          error: 'Network error occurred',
          received: 12345,
          estimatedTotal: 50000,
          downloadTimeMs: 1500,
          totalTimeMs: 2000,
        });

        expect(mocks.emitDownloadProgress).toHaveBeenCalledWith({
          status: 'error',
          httpStatus: 200,
          errorMessage: 'Network error occurred',
          receivedBytes: 12345,
          estimatedBytes: 50000,
          downloadTimeMs: 1500,
          totalTimeMs: 2000,
        });
      });
    });
  });
});
