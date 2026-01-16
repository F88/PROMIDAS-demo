/**
 * @file Unit tests for repository initialization diagnostics.
 */

import { LIMIT_DATA_SIZE_BYTES } from 'promidas/store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  RepositoryConfigurationError,
  resolveRepositoryInitFailure,
} from '../init-error';

function createMinimalInput(overrides?: {
  error?: unknown;
  token?: string;
  storeConfig?: unknown;
  repositoryConfig?: unknown;
  apiClientConfig?: unknown;
}) {
  return {
    error: overrides?.error ?? new Error('Unknown error'),
    token: overrides?.token ?? 'token',
    storeConfig:
      overrides?.storeConfig ??
      ({
        ttlMs: 1,
        maxDataSizeBytes: LIMIT_DATA_SIZE_BYTES,
        logLevel: 'debug',
      } as unknown),
    repositoryConfig:
      overrides?.repositoryConfig ??
      ({
        logLevel: 'debug',
        enableEvents: true,
      } as unknown),
    apiClientConfig:
      overrides?.apiClientConfig ??
      ({
        protoPediaApiClientOptions: {
          logLevel: 'debug',
          token: overrides?.token ?? 'token',
        },
        progressLog: false,
      } as unknown),
  };
}

describe('init-error', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      // silence expected errors in tests
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('categorization', () => {
    it('categorizes missing token errors via message', () => {
      const input = createMinimalInput({
        error: new Error(
          'API token is not set. Please configure it in Settings.',
        ),
        token: '',
      });

      try {
        resolveRepositoryInitFailure(input as never);
        throw new Error('Expected resolveRepositoryInitFailure to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryConfigurationError);
        const repoError = error as RepositoryConfigurationError;
        expect(repoError.diagnostics.category).toBe('MISSING_TOKEN');
        expect(repoError.diagnostics.hints.length).toBeGreaterThan(0);
      }
    });

    it('categorizes store max size errors via message and includes hint', () => {
      const input = createMinimalInput({
        error: new Error('maxDataSizeBytes must be <= 1234'),
      });

      try {
        resolveRepositoryInitFailure(input as never);
        throw new Error('Expected resolveRepositoryInitFailure to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryConfigurationError);
        const repoError = error as RepositoryConfigurationError;
        expect(repoError.diagnostics.category).toBe(
          'STORE_MAX_DATA_SIZE_EXCEEDED',
        );
        expect(repoError.diagnostics.hints.join('\n')).toContain(
          'Reduce storeConfig.maxDataSizeBytes',
        );
      }
    });
  });

  describe('diagnostics serialization', () => {
    it('throws user-friendly hints instead of diagnostic JSON', () => {
      const storeConfig: Record<string, unknown> = {
        ttlMs: 1,
        maxDataSizeBytes: LIMIT_DATA_SIZE_BYTES,
        logLevel: 'debug',
      };
      storeConfig.self = storeConfig;

      const input = createMinimalInput({
        error: new Error('maxDataSizeBytes must be <= 1234'),
        storeConfig,
      });

      try {
        resolveRepositoryInitFailure(input as never);
        throw new Error('Expected resolveRepositoryInitFailure to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryConfigurationError);
        // Error message should be user-friendly hints, not diagnostic JSON
        expect((error as Error).message).toContain(
          'Reduce storeConfig.maxDataSizeBytes',
        );
        expect((error as Error).message).not.toContain('Diagnostics:');
      }
    });
  });
});
