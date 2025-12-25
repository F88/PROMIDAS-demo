import { useEffect } from 'react';
import type { ListPrototypesParams } from 'protopedia-api-v2-client';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import type { SnapshotOperationFailure } from '@f88/promidas/repository';
import { useProtopediaRepository } from './repository-context';

interface RepositoryEventHandlers {
  onSnapshotStarted?: (params?: ListPrototypesParams) => void;
  onSnapshotCompleted?: (stats: PrototypeInMemoryStats) => void;
  onSnapshotFailed?: (error: SnapshotOperationFailure) => void;
}

export function useRepositoryEvents({
  onSnapshotStarted,
  onSnapshotCompleted,
  onSnapshotFailed,
}: RepositoryEventHandlers = {}) {
  const repository = useProtopediaRepository();

  useEffect(() => {
    // Skip if no repository is available
    if (!repository) {
      return;
    }

    // Events are only available when enableEvents: true in repository config
    if (!repository.events) {
      console.warn(
        '[useRepositoryEvents] Events not enabled in repository config',
      );
      return;
    }

    const handleSnapshotStarted = (params?: ListPrototypesParams) => {
      console.debug('[Repository Event] snapshotStarted', params);
      onSnapshotStarted?.(params);
    };

    const handleSnapshotCompleted = (stats: PrototypeInMemoryStats) => {
      console.debug('[Repository Event] snapshotCompleted', {
        size: stats.size,
        isExpired: stats.isExpired,
        cachedAt: stats.cachedAt,
      });
      onSnapshotCompleted?.(stats);
    };

    const handleSnapshotFailed = (error: SnapshotOperationFailure) => {
      console.debug('[Repository Event] snapshotFailed', {
        origin: error.origin,
        message: error.message,
        ...(error.origin === 'fetcher' && {
          code: error.code,
          status: error.status,
        }),
        ...(error.origin === 'store' && {
          code: error.code,
          dataState: error.dataState,
        }),
      });
      onSnapshotFailed?.(error);
    };

    // Register event listeners via events property
    repository.events.on('snapshotStarted', handleSnapshotStarted);
    repository.events.on('snapshotCompleted', handleSnapshotCompleted);
    repository.events.on('snapshotFailed', handleSnapshotFailed);

    // Cleanup on unmount
    return () => {
      repository.events?.off('snapshotStarted', handleSnapshotStarted);
      repository.events?.off('snapshotCompleted', handleSnapshotCompleted);
      repository.events?.off('snapshotFailed', handleSnapshotFailed);
    };
  }, [repository, onSnapshotStarted, onSnapshotCompleted, onSnapshotFailed]);
}
