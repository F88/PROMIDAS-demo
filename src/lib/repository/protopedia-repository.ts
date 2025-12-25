/**
 * @file Singleton repository accessors for the demo app.
 *
 * The demo holds an in-memory PROMIDAS repository instance for reuse across
 * components. `resetRepository` exists mainly for tests and manual resets.
 */

import {
  type ProtopediaInMemoryRepository,
  PromidasRepositoryBuilder,
} from '@f88/promidas';
import { TOKEN_KEYS, TokenManager } from '@f88/promidas-utils/token';
import type { LogLevel } from '@f88/promidas/logger';

import { resolveRepositoryInitFailure } from './init-error';
import { createRepositoryConfigs } from './repository-config';

export { REPOSITORY_MAX_DATA_SIZE, REPOSITORY_TTL_MS } from './constants';

let repository: ProtopediaInMemoryRepository | null = null;

/**
 * Returns a singleton `ProtopediaInMemoryRepository` instance.
 *
 * Throws if the API token is not configured.
 */
export async function getProtopediaRepository(): Promise<ProtopediaInMemoryRepository> {
  if (!repository) {
    const tokenStorage = TokenManager.forSessionStorage(
      TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
    );
    const token: string | null = await tokenStorage.get();

    // For demo site, set log level to debug to help with troubleshooting
    const LOG_LEVEL_FOR_DEMO_SITE: LogLevel = 'debug';

    const { storeConfig, repositoryConfig, apiClientConfig } =
      createRepositoryConfigs(token ?? '', LOG_LEVEL_FOR_DEMO_SITE);

    try {
      repository = new PromidasRepositoryBuilder()
        .setStoreConfig(storeConfig)
        .setApiClientConfig(apiClientConfig)
        .setRepositoryConfig(repositoryConfig)
        .build();
    } catch (error) {
      resolveRepositoryInitFailure({
        error,
        token,
        storeConfig,
        repositoryConfig,
        apiClientConfig,
      });
    }
  }

  return repository;
}

/**
 * Disposes and clears the cached repository instance.
 */
export function resetRepository(): void {
  if (repository) {
    // Cleanup event listeners if repository has dispose method
    if ('dispose' in repository && typeof repository.dispose === 'function') {
      repository.dispose();
    }
  }
  repository = null;
}
