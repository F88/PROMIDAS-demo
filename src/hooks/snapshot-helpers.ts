/**
 * @file Helper functions for snapshot operations in PROMIDAS Playground
 *
 * **IMPORTANT - DO NOT REMOVE CONSOLE LOGS**:
 * All console.debug and console.error statements are intentional
 * and essential for the demo site.
 */

import type {
  SnapshotOperationFailure,
  SnapshotOperationResult,
  SnapshotOperationSuccess,
} from 'promidas/repository';

/**
 * Log the result of a snapshot operation for demo site debugging.
 *
 * **DO NOT REMOVE**: This is a demo site feature to help users understand
 * PROMIDAS API responses. All console.debug and console.error calls in this
 * file are intentional for demonstration purposes.
 *
 * @param operationName - Name of the operation (e.g., "setupSnapshot")
 * @param result - The SnapshotOperationResult to log
 */
export function logFetchResult(
  operationName: string,
  result: SnapshotOperationResult,
): void {
  if (result.ok) {
    console.debug(
      `[PROMIDAS Playground] ${operationName} succeeded`,
      result as SnapshotOperationSuccess,
    );
  } else {
    console.error(
      `[PROMIDAS Playground] ${operationName} failed`,
      result as SnapshotOperationResult,
    );
  }
}

/**
 * Handle snapshot operation error for demo site.
 *
 * **DO NOT REMOVE**: This is a demo site feature that stores
 * SnapshotOperationFailure for detailed error display.
 *
 * @param result - The SnapshotOperationResult to check
 * @param setError - setState function to set error object
 */
export function handleSnapshotOperationError(
  result: SnapshotOperationResult,
  setError: (error: SnapshotOperationFailure | null) => void,
): void {
  if (!result.ok) {
    setError(result);
  }
}
