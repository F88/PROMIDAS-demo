/**
 * @file Unit tests for UserSettingsStorage.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

// eslint-disable-next-line import/order -- intentional grouping with vitest import
import {
  DEFAULT_REPOSITORY_MAX_DATA_SIZE,
  DEFAULT_REPOSITORY_TTL_MS,
} from '../../repository/constants';

import { UserSettingsStorage } from '../user-settings-storage';

const mocks = vi.hoisted(() => {
  return {
    ttlMsGet: vi.fn<() => Promise<string | null>>(),
    ttlMsSave: vi.fn<(value: string) => Promise<void>>(),
    ttlMsRemove: vi.fn<() => Promise<void>>(),
    maxDataSizeGet: vi.fn<() => Promise<string | null>>(),
    maxDataSizeSave: vi.fn<(value: string) => Promise<void>>(),
    maxDataSizeRemove: vi.fn<() => Promise<void>>(),
  };
});

vi.mock('promidas-utils/config', () => {
  return {
    ConfigManager: {
      forLocalStorage: (key: string) => {
        if (key === 'promidas-demo:store-ttl-ms') {
          return {
            get: mocks.ttlMsGet,
            save: mocks.ttlMsSave,
            remove: mocks.ttlMsRemove,
          };
        }
        if (key === 'promidas-demo:store-max-data-size') {
          return {
            get: mocks.maxDataSizeGet,
            save: mocks.maxDataSizeSave,
            remove: mocks.maxDataSizeRemove,
          };
        }
        throw new Error(`Unexpected storage key: ${key}`);
      },
    },
  };
});

describe('UserSettingsStorage', () => {
  let storage: UserSettingsStorage;

  beforeEach(() => {
    storage = new UserSettingsStorage();
    vi.clearAllMocks();
  });

  describe('getDefaults', () => {
    it('returns default user settings', () => {
      const defaults = storage.getDefaults();

      expect(defaults).toEqual({
        repository: {
          store: {
            ttlMs: DEFAULT_REPOSITORY_TTL_MS,
            maxDataSizeBytes: DEFAULT_REPOSITORY_MAX_DATA_SIZE,
          },
        },
      });
    });
  });

  describe('load', () => {
    it('returns defaults when no stored values exist', async () => {
      mocks.ttlMsGet.mockResolvedValue(null);
      mocks.maxDataSizeGet.mockResolvedValue(null);

      const settings = await storage.load();

      expect(settings).toEqual({
        repository: {
          store: {
            ttlMs: DEFAULT_REPOSITORY_TTL_MS,
            maxDataSizeBytes: DEFAULT_REPOSITORY_MAX_DATA_SIZE,
          },
        },
      });
      expect(mocks.ttlMsGet).toHaveBeenCalledOnce();
      expect(mocks.maxDataSizeGet).toHaveBeenCalledOnce();
    });

    it('loads stored values successfully', async () => {
      const customTtl = 120000;
      const customDataSize = 20971520;

      mocks.ttlMsGet.mockResolvedValue(customTtl.toString());
      mocks.maxDataSizeGet.mockResolvedValue(customDataSize.toString());

      const settings = await storage.load();

      expect(settings).toEqual({
        repository: {
          store: {
            ttlMs: customTtl,
            maxDataSizeBytes: customDataSize,
          },
        },
      });
    });

    it('validates loaded values and falls back to defaults for invalid ttlMs', async () => {
      mocks.ttlMsGet.mockResolvedValue('-100'); // Invalid: negative
      mocks.maxDataSizeGet.mockResolvedValue('10485760');

      const settings = await storage.load();

      expect(settings.repository.store.ttlMs).toBe(DEFAULT_REPOSITORY_TTL_MS);
      expect(settings.repository.store.maxDataSizeBytes).toBe(10485760);
    });

    it('validates loaded values and falls back to defaults for zero ttlMs', async () => {
      mocks.ttlMsGet.mockResolvedValue('0');
      mocks.maxDataSizeGet.mockResolvedValue('10485760');

      const settings = await storage.load();

      expect(settings.repository.store.ttlMs).toBe(DEFAULT_REPOSITORY_TTL_MS);
    });

    it('validates loaded values and falls back to defaults for non-numeric values', async () => {
      mocks.ttlMsGet.mockResolvedValue('not-a-number');
      mocks.maxDataSizeGet.mockResolvedValue('also-not-a-number');

      const settings = await storage.load();

      expect(settings).toEqual({
        repository: {
          store: {
            ttlMs: DEFAULT_REPOSITORY_TTL_MS,
            maxDataSizeBytes: DEFAULT_REPOSITORY_MAX_DATA_SIZE,
          },
        },
      });
    });

    it('returns defaults when storage throws error', async () => {
      mocks.ttlMsGet.mockRejectedValue(new Error('Storage unavailable'));

      const settings = await storage.load();

      expect(settings).toEqual({
        repository: {
          store: {
            ttlMs: DEFAULT_REPOSITORY_TTL_MS,
            maxDataSizeBytes: DEFAULT_REPOSITORY_MAX_DATA_SIZE,
          },
        },
      });
    });
  });

  describe('save', () => {
    it('saves user settings to storage', async () => {
      const customSettings = {
        repository: {
          store: {
            ttlMs: 120000,
            maxDataSizeBytes: 20971520,
          },
        },
      };

      mocks.ttlMsSave.mockResolvedValue(undefined);
      mocks.maxDataSizeSave.mockResolvedValue(undefined);

      await storage.save(customSettings);

      expect(mocks.ttlMsSave).toHaveBeenCalledWith('120000');
      expect(mocks.maxDataSizeSave).toHaveBeenCalledWith('20971520');
    });

    it('handles storage errors gracefully', async () => {
      const settings = {
        repository: {
          store: {
            ttlMs: 60000,
            maxDataSizeBytes: 10485760,
          },
        },
      };

      mocks.ttlMsSave.mockRejectedValue(new Error('Save failed'));

      // Should not throw
      await expect(storage.save(settings)).resolves.toBeUndefined();
    });
  });

  describe('reset', () => {
    it('removes stored values', async () => {
      mocks.ttlMsRemove.mockResolvedValue(undefined);
      mocks.maxDataSizeRemove.mockResolvedValue(undefined);

      await storage.reset();

      expect(mocks.ttlMsRemove).toHaveBeenCalledOnce();
      expect(mocks.maxDataSizeRemove).toHaveBeenCalledOnce();
    });

    it('handles storage errors gracefully', async () => {
      mocks.ttlMsRemove.mockRejectedValue(new Error('Remove failed'));

      // Should not throw
      await expect(storage.reset()).resolves.toBeUndefined();
    });
  });

  describe('lazy initialization', () => {
    it('reuses ConfigStorage instances across multiple calls', async () => {
      const forLocalStorageSpy = vi.spyOn(
        await import('promidas-utils/config').then((m) => m.ConfigManager),
        'forLocalStorage',
      );

      mocks.ttlMsGet.mockResolvedValue('60000');
      mocks.maxDataSizeGet.mockResolvedValue('10485760');

      // First call
      await storage.load();
      const firstCallCount = forLocalStorageSpy.mock.calls.length;

      // Second call
      await storage.load();
      const secondCallCount = forLocalStorageSpy.mock.calls.length;

      // Should not create new instances on second call
      expect(secondCallCount).toBe(firstCallCount);
    });
  });
});
