/**
 * @file Unit tests for the singleton repository accessor.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

type Repo = { dispose?: () => void };

const mocks = vi.hoisted(() => {
  return {
    getApiToken: vi.fn<() => string | null>(),
    createRepositoryConfigs: vi.fn(),
    resolveRepositoryInitFailure: vi.fn(),

    setStoreConfig: vi.fn(),
    setApiClientConfig: vi.fn(),
    setRepositoryConfig: vi.fn(),

    build: vi.fn<() => Repo>(),
  };
});

vi.mock('../../token/token-storage', () => {
  return {
    getApiToken: mocks.getApiToken,
  };
});

vi.mock('../../repository/repository-config', () => {
  return {
    createRepositoryConfigs: mocks.createRepositoryConfigs,
  };
});

vi.mock('../../repository/init-error', () => {
  return {
    resolveRepositoryInitFailure: mocks.resolveRepositoryInitFailure,
  };
});

vi.mock('@f88/promidas', () => {
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
} from '../../repository/protopedia-repository';

describe('protopedia-repository', () => {
  beforeEach(() => {
    resetRepository();

    mocks.getApiToken.mockReset();
    mocks.createRepositoryConfigs.mockReset();
    mocks.resolveRepositoryInitFailure.mockReset();

    mocks.setStoreConfig.mockReset();
    mocks.setApiClientConfig.mockReset();
    mocks.setRepositoryConfig.mockReset();

    mocks.build.mockReset();
  });

  describe('singleton lifecycle', () => {
    it('returns a singleton instance until reset', () => {
      mocks.getApiToken.mockReturnValue('token');

      const repo1: Repo = { dispose: vi.fn() };
      const repo2: Repo = { dispose: vi.fn() };

      mocks.build.mockReturnValueOnce(repo1).mockReturnValueOnce(repo2);

      mocks.createRepositoryConfigs.mockReturnValue({
        storeConfig: { ttlMs: 1 },
        repositoryConfig: { enableEvents: true },
        apiClientConfig: { progressLog: true },
      });

      const a = getProtopediaRepository();
      const b = getProtopediaRepository();

      expect(a).toBe(repo1);
      expect(b).toBe(repo1);
      expect(mocks.build).toHaveBeenCalledTimes(1);

      resetRepository();

      expect(repo1.dispose).toHaveBeenCalledTimes(1);

      const c = getProtopediaRepository();
      expect(c).toBe(repo2);
      expect(mocks.build).toHaveBeenCalledTimes(2);
    });
  });
});
