/**
 * @file Repository-related configuration constants for the demo app.
 */

/**
 * In-memory repository time-to-live in milliseconds.
 */
// export const REPOSITORY_TTL_MS = 10 * 1_000;
export const REPOSITORY_TTL_MS = 60 * 1_000;

/**
 * Maximum data size used by the demo for local sizing/diagnostics.
 *
 * Note: PROMIDAS also enforces its own internal `LIMIT_DATA_SIZE_BYTES`.
 */
export const REPOSITORY_MAX_DATA_SIZE = 10 * 1024 * 1024;
