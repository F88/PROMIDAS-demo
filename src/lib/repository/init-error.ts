/**
 * @file Repository initialization error diagnostics.
 *
 * PROMIDAS repository creation can fail for configuration, storage, or network
 * reasons. This module normalizes errors into a consistent diagnostic shape and
 * throws a typed error to aid debugging in the demo.
 */
import {
  ConfigurationError,
  DataSizeExceededError,
  LIMIT_DATA_SIZE_BYTES,
  SizeEstimationError,
  StoreError,
} from 'promidas/store';
import { toErrorMessage } from 'promidas-utils/builder';

import {
  DEFAULT_REPOSITORY_MAX_DATA_SIZE,
  DEFAULT_REPOSITORY_TTL_MS,
} from './constants';

import type {
  ProtopediaInMemoryRepositoryConfig,
  PrototypeInMemoryStoreConfig,
} from 'promidas';
import type { ProtopediaApiCustomClientConfig } from 'promidas/fetcher';

export type RepositoryInitErrorCategory =
  | 'STORE_MAX_DATA_SIZE_EXCEEDED'
  | 'STORE_SIZE_ESTIMATION_FAILED'
  | 'STORE_ERROR'
  | 'MISSING_TOKEN'
  | 'UNKNOWN';

export type RepositoryInitDiagnostics = {
  category: RepositoryInitErrorCategory;
  message: string;
  constants: {
    DEFAULT_REPOSITORY_TTL_MS: number;
    DEFAULT_REPOSITORY_MAX_DATA_SIZE: number; // ← REPOSITORY_MAX_DATA_SIZE から変更
    LIMIT_DATA_SIZE_BYTES: number;
  };
  effectiveConfig: {
    storeConfig: PrototypeInMemoryStoreConfig;
    repositoryConfig: ProtopediaInMemoryRepositoryConfig;
    apiClientConfig: {
      progressLog: boolean;
      hasCustomFetch: boolean;
      tokenPresent: boolean;
      tokenLength: number;
    };
  };
  runtime: {
    isBrowser: boolean;
    userAgent?: string;
  };
  hints: string[];
};

export type RepositoryInitErrorResolverInput = {
  error: unknown;
  token: string | null;
  storeConfig: PrototypeInMemoryStoreConfig;
  repositoryConfig: ProtopediaInMemoryRepositoryConfig;
  apiClientConfig: ProtopediaApiCustomClientConfig;
};

function formatBytes(bytes: number): string {
  const mib = bytes / 1024 / 1024;

  if (Number.isFinite(mib)) {
    return `${bytes} bytes (${mib.toFixed(2)} MiB)`;
  }

  return `${bytes} bytes`;
}

function normalizeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return toErrorMessage(error);
  }

  return `Unknown error: ${String(error)}`;
}

function categorizeRepositoryInitError(
  error: unknown,
  errorMessage: string,
  token: string | null,
): RepositoryInitErrorCategory {
  // Check for store-related errors first (most specific)
  if (error instanceof DataSizeExceededError) {
    return 'STORE_MAX_DATA_SIZE_EXCEEDED';
  }

  if (error instanceof ConfigurationError) {
    const messageLower = errorMessage.toLowerCase();

    if (
      messageLower.includes('maxdatasizebytes') &&
      messageLower.includes('must be <=')
    ) {
      return 'STORE_MAX_DATA_SIZE_EXCEEDED';
    }

    return 'STORE_ERROR';
  }

  if (error instanceof SizeEstimationError) {
    return 'STORE_SIZE_ESTIMATION_FAILED';
  }

  if (error instanceof StoreError) {
    return 'STORE_ERROR';
  }

  // Check for token-related errors
  const messageLower = errorMessage.toLowerCase();
  const tokenMissingByValue = token == null || token.length === 0;
  const tokenMissingByMessage =
    messageLower.includes('missing protopedia_api_v2_token') ||
    messageLower.includes('api token is not set');

  if (tokenMissingByValue || tokenMissingByMessage) {
    return 'MISSING_TOKEN';
  }

  // Fallback check for maxDataSizeBytes in error message
  if (
    messageLower.includes('maxdatasizebytes') &&
    messageLower.includes('must be <=')
  ) {
    return 'STORE_MAX_DATA_SIZE_EXCEEDED';
  }

  return 'UNKNOWN';
}

export class RepositoryConfigurationError extends Error {
  public override readonly name = 'RepositoryConfigurationError';

  public readonly diagnostics: RepositoryInitDiagnostics;

  public constructor(
    message: string,
    diagnostics: RepositoryInitDiagnostics,
    options?: { cause?: unknown },
  ) {
    super(message);

    this.diagnostics = diagnostics;

    if (options?.cause !== undefined) {
      (this as unknown as { cause: unknown }).cause = options.cause;
    }
  }
}

/**
 * Converts an unknown repository initialization failure into a typed error.
 *
 * This function never returns and always throws `RepositoryConfigurationError`.
 */
export function resolveRepositoryInitFailure(
  input: RepositoryInitErrorResolverInput,
): never {
  const { error, token, storeConfig, repositoryConfig, apiClientConfig } =
    input;

  const errorMessage = normalizeErrorMessage(error);
  const category = categorizeRepositoryInitError(error, errorMessage, token);

  const isBrowser =
    typeof window !== 'undefined' && typeof window.document !== 'undefined';
  const userAgent =
    typeof globalThis.navigator !== 'undefined'
      ? globalThis.navigator.userAgent
      : undefined;

  const hints: string[] = [];

  switch (category) {
    case 'STORE_MAX_DATA_SIZE_EXCEEDED': {
      const maxDataSizeBytes = storeConfig.maxDataSizeBytes;

      if (error instanceof DataSizeExceededError) {
        hints.push(
          `Snapshot data size (${formatBytes(
            error.dataSizeBytes,
          )}) exceeds configured maxDataSizeBytes (${formatBytes(
            error.maxDataSizeBytes,
          )}).`,
        );
      }

      hints.push(
        `Reduce storeConfig.maxDataSizeBytes to <= LIMIT_DATA_SIZE_BYTES (${formatBytes(
          LIMIT_DATA_SIZE_BYTES,
        )}).`,
      );

      if (
        typeof maxDataSizeBytes === 'number' &&
        maxDataSizeBytes > LIMIT_DATA_SIZE_BYTES
      ) {
        hints.push(
          `Current maxDataSizeBytes is intentionally above the limit (${formatBytes(
            maxDataSizeBytes,
          )}).`,
        );
      }
      break;
    }

    case 'STORE_SIZE_ESTIMATION_FAILED': {
      if (error instanceof SizeEstimationError) {
        hints.push(
          'Snapshot size estimation failed. This can happen with circular references or unsupported values (e.g. BigInt) in the stored data.',
        );

        if (error.cause) {
          hints.push(
            `Estimation error cause: ${normalizeErrorMessage(error.cause)}`,
          );
        }
      }
      break;
    }

    case 'STORE_ERROR': {
      if (error instanceof StoreError) {
        hints.push(`Store error: ${error.name}`);
        hints.push(`Store dataState: ${error.dataState}`);

        if (error instanceof DataSizeExceededError) {
          hints.push(
            `DataSizeExceededError details: dataSizeBytes=${error.dataSizeBytes}, maxDataSizeBytes=${error.maxDataSizeBytes}`,
          );
        }
      }
      break;
    }

    case 'MISSING_TOKEN': {
      hints.push('APIトークンが未設定または空です');
      hints.push(
        'ここはPROMIDASのデモサイトなので、トークン無しの動作を確認出来ますが、実際のAPI操作は出来ません。',
      );
      break;
    }

    case 'UNKNOWN': {
      break;
    }

    default: {
      // Exhaustiveness check: ensures all cases are handled
      const _exhaustiveCheck: never = category;
      console.error('Unhandled category:', _exhaustiveCheck);
      break;
    }
  }

  if (hints.length === 0) {
    hints.push('Inspect diagnostics for configuration mismatches.');
  }

  const diagnostics: RepositoryInitDiagnostics = {
    category,
    message: errorMessage,
    constants: {
      DEFAULT_REPOSITORY_TTL_MS,
      DEFAULT_REPOSITORY_MAX_DATA_SIZE,
      LIMIT_DATA_SIZE_BYTES,
    },
    effectiveConfig: {
      storeConfig,
      repositoryConfig,
      apiClientConfig: {
        progressLog: apiClientConfig.progressLog ?? false,
        hasCustomFetch:
          typeof apiClientConfig.protoPediaApiClientOptions?.fetch ===
          'function',
        tokenPresent: token != null && token?.length > 0,
        tokenLength: token?.length ?? 0,
      },
    },
    runtime: {
      isBrowser,
      userAgent,
    },
    hints,
  };

  // For expected errors like MISSING_TOKEN, use lighter logging
  if (category === 'MISSING_TOKEN') {
    console.warn('[PROMIDAS Playground] Repository initialization failed:', {
      category,
      message: errorMessage,
      hints,
    });
  } else {
    console.error('[PROMIDAS Playground] Repository initialization failed', {
      diagnostics,
      error,
      stack: error instanceof Error ? error.stack : undefined,
    });
  }

  // Throw user-friendly error message with hints only
  const userMessage = hints.length > 0 ? hints.join('\n') : errorMessage;

  throw new RepositoryConfigurationError(userMessage, diagnostics, {
    cause: error,
  });
}
