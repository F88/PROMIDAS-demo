/**
 * @file Unit tests for the singleton repository accessor.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

type Repo = { dispose?: () => void };

const mocks = vi.hoisted(() => {
  return {
    tokenStorageGet: vi.fn<() => Promise<string | null>>(),
    createRepositoryConfigs: vi.fn(),
    resolveRepositoryInitFailure: vi.fn(),

    setStoreConfig: vi.fn(),
    setApiClientConfig: vi.fn(),
    setRepositoryConfig: vi.fn(),

    build: vi.fn<() => Repo>(),
  };
});

vi.mock('promidas-utils/token', () => {
  return {
    TokenManager: {
      forSessionStorage: () => ({
        get: mocks.tokenStorageGet,
        save: vi.fn(),
        remove: vi.fn(),
        has: vi.fn(),
      }),
    },
    TOKEN_KEYS: {
      PROTOPEDIA_API_V2_TOKEN: 'protopedia_api_v2_token',
    },
  };
});

vi.mock('../repository-config', () => {
  return {
    createRepositoryConfigs: mocks.createRepositoryConfigs,
  };
});

vi.mock('../init-error', () => {
  return {
    resolveRepositoryInitFailure: mocks.resolveRepositoryInitFailure,
  };
});

vi.mock('promidas', () => {
  class PromidasRepositoryBuilder {
    public setStoreConfig(config: unknown) {
      mocks.setStoreConfig(config);
      return this;
    }

    public setApiClientConfig(config: unknown) {
      mocks.setApiClientConfig(config);
      return this;
    }

    public setRepositoryConfig(config: unknown) {
      mocks.setRepositoryConfig(config);
      return this;
    }

    public build() {
      return mocks.build();
    }
  }

  return { PromidasRepositoryBuilder };
});

import {
  getProtopediaRepository,
  resetRepository,
} from '../protopedia-repository';

describe('protopedia-repository', () => {
  beforeEach(() => {
    resetRepository();

    mocks.tokenStorageGet.mockReset();
    mocks.createRepositoryConfigs.mockReset();
    mocks.resolveRepositoryInitFailure.mockReset();

    mocks.setStoreConfig.mockReset();
    mocks.setApiClientConfig.mockReset();
    mocks.setRepositoryConfig.mockReset();

    mocks.build.mockReset();
  });

  describe('singleton lifecycle', () => {
    it('returns a singleton instance until reset', async () => {
      mocks.tokenStorageGet.mockResolvedValue('token');

      const repo1: Repo = { dispose: vi.fn() };
      const repo2: Repo = { dispose: vi.fn() };

      mocks.build.mockReturnValueOnce(repo1).mockReturnValueOnce(repo2);

      mocks.createRepositoryConfigs.mockResolvedValue({
        storeConfig: { ttlMs: 1 },
        repositoryConfig: { enableEvents: true },
        apiClientConfig: { progressLog: true },
      });

      const a = await getProtopediaRepository();
      const b = await getProtopediaRepository();

      expect(a).toBe(repo1);
      expect(b).toBe(repo1);
      expect(mocks.build).toHaveBeenCalledTimes(1);

      resetRepository();

      expect(repo1.dispose).toHaveBeenCalledTimes(1);

      const c = await getProtopediaRepository();
      expect(c).toBe(repo2);
      expect(mocks.build).toHaveBeenCalledTimes(2);
    });
  });
});
