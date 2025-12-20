import { useState, useEffect } from 'react';

interface DownloadProgress {
  status: 'idle' | 'started' | 'in-progress' | 'completed';
  estimatedBytes?: number;
  receivedBytes?: number;
  percentage?: number;
  prepareTimeMs?: number;
  downloadTimeMs?: number;
  totalTimeMs?: number;
  limit?: number;
  increment?: number;
  timestamp: number;
}

// Global event emitter for download progress
const progressListeners = new Set<(progress: DownloadProgress[]) => void>();
let progressHistory: DownloadProgress[] = [];
let previousBytes = 0;

export function emitDownloadProgress(
  progress: Omit<DownloadProgress, 'timestamp'>,
) {
  const progressWithTimestamp = {
    ...progress,
    timestamp: Date.now(),
  };

  // Clear history when starting a new download
  if (progress.status === 'started') {
    progressHistory = [progressWithTimestamp];
    previousBytes = 0;
  } else {
    // Calculate increment for in-progress events
    if (
      progress.status === 'in-progress' &&
      progress.receivedBytes !== undefined
    ) {
      const increment = progress.receivedBytes - previousBytes;
      progressHistory = [
        ...progressHistory,
        { ...progressWithTimestamp, increment },
      ];
      previousBytes = progress.receivedBytes;
    } else {
      progressHistory = [...progressHistory, progressWithTimestamp];
    }
  }

  progressListeners.forEach((listener) => listener([...progressHistory]));
}

export function useDownloadProgress() {
  const [progressLog, setProgressLog] = useState<DownloadProgress[]>(() => [
    ...progressHistory,
  ]);

  useEffect(() => {
    const listener = (history: DownloadProgress[]) => {
      setProgressLog(history);
    };

    progressListeners.add(listener);

    return () => {
      progressListeners.delete(listener);
    };
  }, []);

  return progressLog;
}
