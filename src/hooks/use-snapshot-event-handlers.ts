/**
 * @file Custom hook for handling snapshot operation events
 *
 * This hook manages the synchronization between snapshot operation events
 * (started, completed, failed) and the application state (indicators and stats).
 * It provides a centralized way to handle repository events related to
 * snapshot operations.
 */

import { useCallback } from 'react';

import { useRepositoryEvents } from './use-repository-events';

import type { PrototypeInMemoryStats } from 'promidas';

interface UseSnapshotEventHandlersParams {
  setIsRepositoryActive: (active: boolean) => void;
  setIsStoreActive: (active: boolean) => void;
  updateHeaderStats: () => void;
  updateStoreStats: () => void;
}

/**
 * Custom hook for handling snapshot operation events and updating UI state
 *
 * This hook listens to PROMIDAS repository events and updates:
 * - Data flow indicators (Repository and Store)
 * - Header and store statistics
 *
 * @param params - State updater functions for indicators and stats
 */
export function useSnapshotEventHandlers({
  setIsRepositoryActive,
  setIsStoreActive,
  updateHeaderStats,
  updateStoreStats,
}: UseSnapshotEventHandlersParams): void {
  const handleSnapshotStarted = useCallback(() => {
    console.info('[Repository Event] Snapshot Started');
    setIsRepositoryActive(true);
    setIsStoreActive(true);
  }, [setIsRepositoryActive, setIsStoreActive]);

  const handleSnapshotCompleted = useCallback(
    (stats: PrototypeInMemoryStats) => {
      console.info('[Repository Event] Snapshot Completed', stats);
      setIsRepositoryActive(false);
      setIsStoreActive(false);
      updateHeaderStats();
      updateStoreStats();
    },
    [
      setIsRepositoryActive,
      setIsStoreActive,
      updateHeaderStats,
      updateStoreStats,
    ],
  );

  const handleSnapshotFailed = useCallback(() => {
    console.info('[Repository Event] Snapshot Failed');
    setIsRepositoryActive(false);
    setIsStoreActive(false);
  }, [setIsRepositoryActive, setIsStoreActive]);

  useRepositoryEvents({
    onSnapshotStarted: handleSnapshotStarted,
    onSnapshotCompleted: handleSnapshotCompleted,
    onSnapshotFailed: handleSnapshotFailed,
  });
}
