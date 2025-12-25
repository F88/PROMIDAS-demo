/**
 * @file React Context for sharing the singleton ProtopediaInMemoryRepository instance
 */

/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { ProtopediaInMemoryRepository } from '@f88/promidas';
import {
  getProtopediaRepository,
  resetRepository,
} from '../lib/repository/protopedia-repository';
import { useToken } from './use-token';

interface RepositoryContextValue {
  repository: ProtopediaInMemoryRepository | null;
  error: Error | null;
  isInitializing: boolean;
  ensureRepository: () => Promise<ProtopediaInMemoryRepository>;
  resetRepositoryInstance: () => void;
}

const RepositoryContext = createContext<RepositoryContextValue | undefined>(
  undefined,
);

interface RepositoryProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages the singleton repository instance.
 * All child components can access the same repository via useProtopediaRepository().
 */
export function RepositoryProvider({ children }: RepositoryProviderProps) {
  const { token, isLoading: isTokenLoading } = useToken();
  const [repository, setRepository] =
    useState<ProtopediaInMemoryRepository | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const pendingInitRef = useRef<Promise<ProtopediaInMemoryRepository> | null>(
    null,
  );
  const lastTokenRef = useRef<string | null>(null);

  const ensureRepository = useCallback(async () => {
    if (repository) {
      return repository;
    }

    if (pendingInitRef.current) {
      return pendingInitRef.current;
    }

    setIsInitializing(true);

    const initPromise = getProtopediaRepository()
      .then((repo) => {
        setRepository(repo);
        setError(null);
        return repo;
      })
      .catch((err) => {
        console.error(
          '[RepositoryProvider] Failed to initialize repository:',
          err,
        );
        setRepository(null);
        setError(err instanceof Error ? err : new Error(String(err)));
        throw err;
      })
      .finally(() => {
        setIsInitializing(false);
        pendingInitRef.current = null;
      });

    pendingInitRef.current = initPromise;
    return initPromise;
  }, [repository]);

  const resetRepositoryInstance = useCallback(() => {
    pendingInitRef.current = null;
    resetRepository();
    setRepository(null);
    setError(null);
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    // Skip if still loading token
    if (isTokenLoading) {
      return;
    }

    // Only reset/re-init when token actually changes
    if (token === lastTokenRef.current) {
      return;
    }

    // Reset repository when token changes
    resetRepository();
    pendingInitRef.current = null;
    lastTokenRef.current = token ?? null;

    // Defer state updates to avoid synchronous setState in effect
    queueMicrotask(() => {
      setRepository(null);
      setError(null);
      setIsInitializing(false);
    });

    // Do not attempt initialization until a token exists
    if (!token) {
      return;
    }

    queueMicrotask(() => {
      void ensureRepository();
    });
  }, [token, isTokenLoading, ensureRepository]);

  return (
    <RepositoryContext.Provider
      value={{
        repository,
        error,
        isInitializing,
        ensureRepository,
        resetRepositoryInstance,
      }}
    >
      {children}
    </RepositoryContext.Provider>
  );
}

/**
 * Hook for accessing the singleton repository instance.
 * Returns null while loading or when repository initialization fails (e.g., no token).
 * Must be used within a RepositoryProvider.
 */
export function useProtopediaRepository(): ProtopediaInMemoryRepository | null {
  const context = useContext(RepositoryContext);
  if (context === undefined) {
    throw new Error(
      'useProtopediaRepository must be used within a RepositoryProvider',
    );
  }
  return context.repository;
}

/**
 * Hook that ensures the repository is initialized on-demand.
 */
export function useEnsureProtopediaRepository(): () => Promise<ProtopediaInMemoryRepository> {
  const context = useContext(RepositoryContext);
  if (context === undefined) {
    throw new Error(
      'useEnsureProtopediaRepository must be used within a RepositoryProvider',
    );
  }
  return context.ensureRepository;
}

/**
 * Hook that resets the repository and clears cached state.
 */
export function useResetProtopediaRepository(): () => void {
  const context = useContext(RepositoryContext);
  if (context === undefined) {
    throw new Error(
      'useResetProtopediaRepository must be used within a RepositoryProvider',
    );
  }
  return context.resetRepositoryInstance;
}

/**
 * Hook for accessing repository error state.
 * Useful for displaying error messages when repository initialization fails.
 */
export function useRepositoryError(): Error | null {
  const context = useContext(RepositoryContext);
  if (context === undefined) {
    throw new Error(
      'useRepositoryError must be used within a RepositoryProvider',
    );
  }
  return context.error;
}

/**
 * Hook for checking if repository is currently being initialized.
 */
export function useRepositoryInitializing(): boolean {
  const context = useContext(RepositoryContext);
  if (context === undefined) {
    throw new Error(
      'useRepositoryInitializing must be used within a RepositoryProvider',
    );
  }
  return context.isInitializing;
}
