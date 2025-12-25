/**
 * @file Repository initialization error diagnostics.
 *
 * PROMIDAS repository creation can fail for configuration, storage, or network
 * reasons. This module normalizes errors into a consistent diagnostic shape and
 * throws a typed error to aid debugging in the demo.
 */

import type {
  ProtopediaInMemoryRepositoryConfig,
  PrototypeInMemoryStoreConfig,
} from '@f88/promidas';
import type { ProtopediaApiCustomClientConfig } from '@f88/promidas/fetcher';
import {
  ConfigurationError as PromidasStoreConfigurationError,
  DataSizeExceededError,
  LIMIT_DATA_SIZE_BYTES,
  SizeEstimationError,
  StoreError,
} from '@f88/promidas/store';
import { REPOSITORY_MAX_DATA_SIZE, REPOSITORY_TTL_MS } from './constants';

export type RepositoryInitErrorCategory =
  | 'STORE_MAX_DATA_SIZE_EXCEEDED'
  | 'STORE_SIZE_ESTIMATION_FAILED'
  | 'STORE_ERROR'
  | 'MISSING_TOKEN'
  | 'NETWORK_ERROR'
  | 'CORS_ERROR'
  | 'UNKNOWN';

export type RepositoryInitDiagnostics = {
  category: RepositoryInitErrorCategory;
  message: string;
  constants: {
    REPOSITORY_TTL_MS: number;
    REPOSITORY_MAX_DATA_SIZE: number;
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
    return error.message;
  }

  return `Unknown error: ${String(error)}`;
}

function categorizeRepositoryInitError(
  error: unknown,
  errorMessage: string,
  token: string | null,
): RepositoryInitErrorCategory {
  if (error instanceof DataSizeExceededError) {
    return 'STORE_MAX_DATA_SIZE_EXCEEDED';
  }

  if (error instanceof PromidasStoreConfigurationError) {
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

  const messageLower = errorMessage.toLowerCase();

  const tokenMissingByValue = token == null || token.length === 0;
  const tokenMissingByMessage =
    messageLower.includes('missing protopedia_api_v2_token') ||
    messageLower.includes('api token is not set');

  if (tokenMissingByValue || tokenMissingByMessage) {
    return 'MISSING_TOKEN';
  }

  if (
    messageLower.includes('maxdatasizebytes') &&
    messageLower.includes('must be <=')
  ) {
    return 'STORE_MAX_DATA_SIZE_EXCEEDED';
  }

  if (
    messageLower.includes('failed to fetch') ||
    messageLower.includes('networkerror') ||
    messageLower.includes('network error')
  ) {
    return 'NETWORK_ERROR';
  }

  if (
    messageLower.includes('cors') ||
    messageLower.includes('blocked by cors')
  ) {
    return 'CORS_ERROR';
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

  if (category === 'STORE_MAX_DATA_SIZE_EXCEEDED') {
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
  }

  if (
    category === 'STORE_SIZE_ESTIMATION_FAILED' &&
    error instanceof SizeEstimationError
  ) {
    hints.push(
      'Snapshot size estimation failed. This can happen with circular references or unsupported values (e.g. BigInt) in the stored data.',
    );

    if (error.cause) {
      hints.push(
        `Estimation error cause: ${normalizeErrorMessage(error.cause)}`,
      );
    }
  }

  if (category === 'STORE_ERROR' && error instanceof StoreError) {
    hints.push(`Store error: ${error.name}`);
    hints.push(`Store dataState: ${error.dataState}`);

    if (error instanceof DataSizeExceededError) {
      hints.push(
        `DataSizeExceededError details: dataSizeBytes=${error.dataSizeBytes}, maxDataSizeBytes=${error.maxDataSizeBytes}`,
      );
    }
  }

  if (category === 'MISSING_TOKEN') {
    hints.push('APIトークンが未設定または空です');
    hints.push(
      'ここはPROMIDASのデモサイトなので、トークン無しの動作を確認出来ますが、実際のAPI操作は出来ません。',
    );
  }

  if (category === 'CORS_ERROR') {
    hints.push(
      'Browser CORS may block custom headers. PROMIDAS v0.13.0 removes x-client-user-agent in browser runtimes to avoid preflight failures.',
    );
  }

  if (category === 'NETWORK_ERROR') {
    hints.push('Check connectivity and ProtoPedia API availability.');
    hints.push(
      'If running on GitHub Pages, verify the API endpoint allows your origin.',
    );
  }

  if (hints.length === 0) {
    hints.push('Inspect diagnostics for configuration mismatches.');
  }

  const diagnostics: RepositoryInitDiagnostics = {
    category,
    message: errorMessage,
    constants: {
      REPOSITORY_TTL_MS,
      REPOSITORY_MAX_DATA_SIZE,
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
