/**
 * @file User settings storage manager.
 *
 * Provides centralized management of user-configurable settings across the application.
 * Currently stores repository.store settings (ttlMs, maxDataSizeBytes) in separate localStorage keys.
 * Designed for future extensibility to support additional settings sections (theme, UI preferences, etc.).
 *
 * @remarks
 * Implementation approach:
 * - UserSettings type: Hierarchical structure for all user preferences
 * - Storage strategy: Individual localStorage keys per setting value (e.g., 'promidas-demo:store-ttl-ms')
 * - Lazy initialization: ConfigStorage instances are created on first use to avoid module-level crashes
 */

import { ConfigManager, type ConfigStorage } from 'promidas-utils/config';

import {
  DEFAULT_REPOSITORY_MAX_DATA_SIZE,
  DEFAULT_REPOSITORY_TTL_MS,
} from '../repository/constants';

import type { RepositoryStoreSettings } from '../repository/types';

/**
 * User settings type definition.
 *
 * @remarks
 * Designed for extensibility. Future sections can include:
 * - repository.api: API endpoint settings
 * - theme: UI theme preferences
 * - ui: UI behavior preferences
 */
export type UserSettings = {
  /**
   * Repository-related settings.
   */
  repository: {
    /**
     * Repository store settings.
     */
    store: RepositoryStoreSettings;

    // Future sections:
    // /**
    //  * API settings.
    //  */
    // api?: {
    //   /**
    //    * Base URL for API endpoints.
    //    */
    //   baseUrl: string;
    //   /**
    //    * Request timeout in milliseconds.
    //    */
    //   timeout: number;
    // };
  };

  // Future sections:
  // /**
  //  * Theme settings.
  //  */
  // theme?: {
  //   /**
  //    * Color scheme preference.
  //    */
  //   colorScheme: 'light' | 'dark' | 'auto';
  //   /**
  //    * Primary color.
  //    */
  //   primaryColor?: string;
  // };
  //
  // /**
  //  * UI behavior settings.
  //  */
  // ui?: {
  //   /**
  //    * Display language.
  //    */
  //   language: 'ja' | 'en';
  //   /**
  //    * Show tutorial on first visit.
  //    */
  //   showTutorial: boolean;
  // };
};

const STORAGE_KEY_TTL_MS = 'promidas-demo:store-ttl-ms';
const STORAGE_KEY_MAX_DATA_SIZE = 'promidas-demo:store-max-data-size';

/**
 * User settings storage manager.
 *
 * @remarks
 * Manages UserSettings with a hierarchical structure. Currently implements
 * repository.store settings storage using individual localStorage keys.
 * Each setting value is stored separately for granular control.
 *
 * Uses lazy initialization pattern to prevent module loading crashes
 * in non-browser environments where localStorage is unavailable.
 *
 * @example
 * ```typescript
 * // Load settings
 * const settings = await userSettingsStorage.load();
 * console.log(settings.repository.store.ttlMs);
 *
 * // Save settings
 * await userSettingsStorage.save({
 *   repository: {
 *     store: { ttlMs: 60000, maxDataSizeBytes: 10485760 }
 *   }
 * });
 *
 * // Reset to defaults
 * await userSettingsStorage.reset();
 * ```
 */
export class UserSettingsStorage {
  private ttlMsConfig: ConfigStorage | null = null;
  private maxDataSizeBytesConfig: ConfigStorage | null = null;

  /**
   * Get default user settings.
   *
   * @returns Default settings for all sections.
   */
  getDefaults(): UserSettings {
    return {
      repository: {
        store: {
          ttlMs: DEFAULT_REPOSITORY_TTL_MS,
          maxDataSizeBytes: DEFAULT_REPOSITORY_MAX_DATA_SIZE,
        },
      },
    };
  }

  /**
   * Initialize repository store storage instances lazily.
   *
   * @returns Object containing ConfigStorage instances for repository.store settings.
   *
   * @remarks
   * Creates ConfigStorage instances for:
   * - ttlMs: 'promidas-demo:store-ttl-ms'
   * - maxDataSizeBytes: 'promidas-demo:store-max-data-size'
   *
   * This lazy initialization pattern prevents module loading crashes
   * in non-browser environments where localStorage is unavailable.
   * Instances are cached after first creation.
   */
  private getRepositoryStoreStorageInstances() {
    if (!this.ttlMsConfig || !this.maxDataSizeBytesConfig) {
      this.ttlMsConfig = ConfigManager.forLocalStorage(STORAGE_KEY_TTL_MS);
      this.maxDataSizeBytesConfig = ConfigManager.forLocalStorage(
        STORAGE_KEY_MAX_DATA_SIZE,
      );
    }
    return {
      ttlMsConfig: this.ttlMsConfig,
      maxDataSizeBytesConfig: this.maxDataSizeBytesConfig,
    };
  }

  /**
   * Load user settings from localStorage.
   *
   * @returns Stored settings, or defaults if not found or invalid.
   *
   * @remarks
   * - Returns defaults if localStorage is unavailable
   * - Validates loaded values (must be finite positive numbers)
   * - Falls back to defaults for any invalid values
   */
  async load(): Promise<UserSettings> {
    const defaults = this.getDefaults();

    try {
      const { ttlMsConfig, maxDataSizeBytesConfig } =
        this.getRepositoryStoreStorageInstances();

      const ttlMsStr = await ttlMsConfig.get();
      const maxDataSizeStr = await maxDataSizeBytesConfig.get();

      const ttlMs = ttlMsStr
        ? parseInt(ttlMsStr, 10)
        : defaults.repository.store.ttlMs;
      const maxDataSizeBytes = maxDataSizeStr
        ? parseInt(maxDataSizeStr, 10)
        : defaults.repository.store.maxDataSizeBytes;

      return {
        repository: {
          store: {
            ttlMs:
              Number.isFinite(ttlMs) && ttlMs > 0
                ? ttlMs
                : defaults.repository.store.ttlMs,
            maxDataSizeBytes:
              Number.isFinite(maxDataSizeBytes) && maxDataSizeBytes > 0
                ? maxDataSizeBytes
                : defaults.repository.store.maxDataSizeBytes,
          },
        },
      };
    } catch (error) {
      console.error(
        '[Promidas Playground] Failed to load store settings: ',
        error,
      );
      return defaults;
    }
  }

  /**
   * Save user settings to localStorage.
   *
   * @param settings - Settings to save.
   *
   * @remarks
   * Silently fails if localStorage is unavailable (logs error to console).
   */
  async save(settings: UserSettings): Promise<void> {
    try {
      const { ttlMsConfig, maxDataSizeBytesConfig } =
        this.getRepositoryStoreStorageInstances();

      await ttlMsConfig.save(settings.repository.store.ttlMs.toString());
      await maxDataSizeBytesConfig.save(
        settings.repository.store.maxDataSizeBytes.toString(),
      );
    } catch (error) {
      console.error(
        '[Promidas Playground] Failed to save store settings:',
        error,
      );
    }
  }

  /**
   * Reset repository store settings to defaults.
   *
   * @remarks
   * Removes stored settings from localStorage.
   * Silently fails if localStorage is unavailable (logs error to console).
   * After reset, {@link load} will return default values.
   */
  async reset(): Promise<void> {
    try {
      const { ttlMsConfig, maxDataSizeBytesConfig } =
        this.getRepositoryStoreStorageInstances();

      await ttlMsConfig.remove();
      await maxDataSizeBytesConfig.remove();
    } catch (error) {
      console.error(
        '[Promidas Playground] Failed to reset store settings:',
        error,
      );
    }
  }
}

export const userSettingsStorage = new UserSettingsStorage();
