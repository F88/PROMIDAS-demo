/**
 * Constants for snapshot configuration
 */
export const SETUP_SNAPSHOT = {
  LIMIT: {
    MAX: 10_000,
    MIN: 0,
    DEFAULT: 10,
  },
  OFFSET: {
    MIN: 0,
    DEFAULT: 0,
  },
} as const;
