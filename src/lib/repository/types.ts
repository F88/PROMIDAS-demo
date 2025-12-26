/**
 * @file Type definitions for repository-related structures.
 */

/**
 * Repository store settings type.
 */
export type RepositoryStoreSettings = {
  /**
   * Cache TTL in milliseconds.
   */
  ttlMs: number;
  /**
   * Maximum data size in bytes.
   */
  maxDataSizeBytes: number;
};
