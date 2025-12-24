import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDataFlowIndicators } from '../use-data-flow-indicators';

describe('useDataFlowIndicators', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should initialize all indicators as false', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      expect(result.current.isFetcherActive).toBe(false);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isRepositoryActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(false);
    });

    it('should provide state setters', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      expect(typeof result.current.setIsFetcherActive).toBe('function');
      expect(typeof result.current.setIsStoreActive).toBe('function');
      expect(typeof result.current.setIsRepositoryActive).toBe('function');
      expect(typeof result.current.setIsDisplayActive).toBe('function');
    });

    it('should provide handler functions', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      expect(typeof result.current.handleGetStoreInfo).toBe('function');
      expect(typeof result.current.handleUseSnapshot).toBe('function');
    });
  });

  describe('state setters', () => {
    it('should update Fetcher state', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      act(() => {
        result.current.setIsFetcherActive(true);
      });

      expect(result.current.isFetcherActive).toBe(true);
    });

    it('should update Store state', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      act(() => {
        result.current.setIsStoreActive(true);
      });

      expect(result.current.isStoreActive).toBe(true);
    });

    it('should update Repository state', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      act(() => {
        result.current.setIsRepositoryActive(true);
      });

      expect(result.current.isRepositoryActive).toBe(true);
    });

    it('should update Display state', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      act(() => {
        result.current.setIsDisplayActive(true);
      });

      expect(result.current.isDisplayActive).toBe(true);
    });
  });

  describe('handleGetStoreInfo', () => {
    it('should do nothing when isActive is false', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      act(() => {
        result.current.handleGetStoreInfo(false);
      });

      expect(result.current.isRepositoryActive).toBe(false);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(false);
    });

    it('should activate Repository immediately (0ms)', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      act(() => {
        result.current.handleGetStoreInfo(true);
      });

      expect(result.current.isRepositoryActive).toBe(true);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(false);
    });

    it('should activate Store after 100ms', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      act(() => {
        result.current.handleGetStoreInfo(true);
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isRepositoryActive).toBe(true);
      expect(result.current.isStoreActive).toBe(true);
      expect(result.current.isDisplayActive).toBe(false);
    });

    it('should deactivate Store after 200ms', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      act(() => {
        result.current.handleGetStoreInfo(true);
      });

      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(result.current.isRepositoryActive).toBe(true);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(false);
    });

    it('should deactivate Repository and activate Display after 300ms', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      act(() => {
        result.current.handleGetStoreInfo(true);
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.isRepositoryActive).toBe(false);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(true);
    });

    it('should deactivate Display after 400ms', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      act(() => {
        result.current.handleGetStoreInfo(true);
      });

      act(() => {
        vi.advanceTimersByTime(400);
      });

      expect(result.current.isRepositoryActive).toBe(false);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(false);
    });

    it('should follow complete timeline: Repository (0-300ms), Store (100-200ms), Display (300-400ms)', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      // Initial state
      expect(result.current.isRepositoryActive).toBe(false);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(false);

      // Trigger
      act(() => {
        result.current.handleGetStoreInfo(true);
      });

      // At 0ms: Repository ON
      expect(result.current.isRepositoryActive).toBe(true);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(false);

      // At 100ms: Repository ON, Store ON
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current.isRepositoryActive).toBe(true);
      expect(result.current.isStoreActive).toBe(true);
      expect(result.current.isDisplayActive).toBe(false);

      // At 200ms: Repository ON, Store OFF
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current.isRepositoryActive).toBe(true);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(false);

      // At 300ms: Repository OFF, Display ON
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current.isRepositoryActive).toBe(false);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(true);

      // At 400ms: All OFF
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current.isRepositoryActive).toBe(false);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(false);
    });
  });

  describe('handleUseSnapshot', () => {
    it('should do nothing when isActive is false', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      act(() => {
        result.current.handleUseSnapshot(false);
      });

      expect(result.current.isRepositoryActive).toBe(false);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(false);
    });

    it('should activate Repository immediately (0ms)', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      act(() => {
        result.current.handleUseSnapshot(true);
      });

      expect(result.current.isRepositoryActive).toBe(true);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(false);
    });

    it('should activate Store after 100ms', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      act(() => {
        result.current.handleUseSnapshot(true);
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isRepositoryActive).toBe(true);
      expect(result.current.isStoreActive).toBe(true);
      expect(result.current.isDisplayActive).toBe(false);
    });

    it('should deactivate Store after 200ms', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      act(() => {
        result.current.handleUseSnapshot(true);
      });

      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(result.current.isRepositoryActive).toBe(true);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(false);
    });

    it('should deactivate Repository and activate Display after 300ms', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      act(() => {
        result.current.handleUseSnapshot(true);
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.isRepositoryActive).toBe(false);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(true);
    });

    it('should deactivate Display after 400ms', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      act(() => {
        result.current.handleUseSnapshot(true);
      });

      act(() => {
        vi.advanceTimersByTime(400);
      });

      expect(result.current.isRepositoryActive).toBe(false);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(false);
    });

    it('should follow complete timeline: Repository (0-300ms), Store (100-200ms), Display (300-400ms)', () => {
      const { result } = renderHook(() => useDataFlowIndicators());

      // Initial state
      expect(result.current.isRepositoryActive).toBe(false);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(false);

      // Trigger
      act(() => {
        result.current.handleUseSnapshot(true);
      });

      // At 0ms: Repository ON
      expect(result.current.isRepositoryActive).toBe(true);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(false);

      // At 100ms: Repository ON, Store ON
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current.isRepositoryActive).toBe(true);
      expect(result.current.isStoreActive).toBe(true);
      expect(result.current.isDisplayActive).toBe(false);

      // At 200ms: Repository ON, Store OFF
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current.isRepositoryActive).toBe(true);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(false);

      // At 300ms: Repository OFF, Display ON
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current.isRepositoryActive).toBe(false);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(true);

      // At 400ms: All OFF
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current.isRepositoryActive).toBe(false);
      expect(result.current.isStoreActive).toBe(false);
      expect(result.current.isDisplayActive).toBe(false);
    });
  });

  describe('handleGetStoreInfo and handleUseSnapshot behavior parity', () => {
    it('should have identical timing behavior', () => {
      const { result: result1 } = renderHook(() => useDataFlowIndicators());
      const { result: result2 } = renderHook(() => useDataFlowIndicators());

      act(() => {
        result1.current.handleGetStoreInfo(true);
        result2.current.handleUseSnapshot(true);
      });

      // Both should have identical state at each time point
      expect(result1.current.isRepositoryActive).toBe(
        result2.current.isRepositoryActive,
      );
      expect(result1.current.isStoreActive).toBe(result2.current.isStoreActive);
      expect(result1.current.isDisplayActive).toBe(
        result2.current.isDisplayActive,
      );

      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(result1.current.isRepositoryActive).toBe(
        result2.current.isRepositoryActive,
      );
      expect(result1.current.isStoreActive).toBe(result2.current.isStoreActive);
      expect(result1.current.isDisplayActive).toBe(
        result2.current.isDisplayActive,
      );

      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(result1.current.isRepositoryActive).toBe(
        result2.current.isRepositoryActive,
      );
      expect(result1.current.isStoreActive).toBe(result2.current.isStoreActive);
      expect(result1.current.isDisplayActive).toBe(
        result2.current.isDisplayActive,
      );
    });
  });
});
