/**
 * @file Repository store settings persistence.
 *
 * Manages ttlMs and maxDataSizeBytes configuration in localStorage.
 */

import { REPOSITORY_MAX_DATA_SIZE, REPOSITORY_TTL_MS } from './constants';

const STORAGE_KEY_TTL_MS = 'promidas-demo:store-ttl-ms';
const STORAGE_KEY_MAX_DATA_SIZE = 'promidas-demo:store-max-data-size';

export type RepositoryStoreSettings = {
  ttlMs: number;
  maxDataSizeBytes: number;
};

/**
 * Get default repository store settings.
 */
export function getDefaultStoreSettings(): RepositoryStoreSettings {
  return {
    ttlMs: REPOSITORY_TTL_MS,
    maxDataSizeBytes: REPOSITORY_MAX_DATA_SIZE,
  };
}

/**
 * Load repository store settings from localStorage.
 */
export function loadStoreSettings(): RepositoryStoreSettings {
  const defaults = getDefaultStoreSettings();

  try {
    const ttlMsStr = localStorage.getItem(STORAGE_KEY_TTL_MS);
    const maxDataSizeStr = localStorage.getItem(STORAGE_KEY_MAX_DATA_SIZE);

    const ttlMs = ttlMsStr ? parseInt(ttlMsStr, 10) : defaults.ttlMs;
    const maxDataSizeBytes = maxDataSizeStr
      ? parseInt(maxDataSizeStr, 10)
      : defaults.maxDataSizeBytes;

    return {
      ttlMs: Number.isFinite(ttlMs) && ttlMs > 0 ? ttlMs : defaults.ttlMs,
      maxDataSizeBytes:
        Number.isFinite(maxDataSizeBytes) && maxDataSizeBytes > 0
          ? maxDataSizeBytes
          : defaults.maxDataSizeBytes,
    };
  } catch {
    return defaults;
  }
}

/**
 * Save repository store settings to localStorage.
 */
export function saveStoreSettings(settings: RepositoryStoreSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_TTL_MS, settings.ttlMs.toString());
    localStorage.setItem(
      STORAGE_KEY_MAX_DATA_SIZE,
      settings.maxDataSizeBytes.toString(),
    );
  } catch (error) {
    console.error('Failed to save store settings:', error);
  }
}

/**
 * Reset repository store settings to defaults.
 */
export function resetStoreSettings(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_TTL_MS);
    localStorage.removeItem(STORAGE_KEY_MAX_DATA_SIZE);
  } catch (error) {
    console.error('Failed to reset store settings:', error);
  }
}
