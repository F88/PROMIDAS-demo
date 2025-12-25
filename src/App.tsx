import { useCallback, useEffect, useState } from 'react';

import { Box, Container, Grid, Link, Typography } from '@mui/material';

import { TOKEN_KEYS, TokenManager } from '@f88/promidas-utils/token';

import { resetRepository } from './lib/repository/protopedia-repository';

import { AppHeader } from './components/common/app-header';
import { ConfigContainer } from './components/config/config-container';
import { RepositorySettings } from './components/config/repository-settings';
import { TokenConfiguration } from './components/config/token-configuration';
import { FetcherContainer } from './components/fetcher/fetcher-container';
import { RepositoryContainer } from './components/repository/repository-container';
import { StoreContainer } from './components/store/store-container';

import {
  useConfig,
  useDownloadProgress,
  useHeaderStats,
  useStoreStats,
  type HeaderStats,
} from './hooks';
import { useDataFlowIndicators } from './hooks/use-data-flow-indicators';
import { useSnapshotEventHandlers } from './hooks/use-snapshot-event-handlers';

import './App.css';

const tokenStorage = TokenManager.forSessionStorage(
  TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
);

function isCacheAliveForTtlPolling(
  stats: HeaderStats | null,
): stats is HeaderStats {
  return (
    stats !== null &&
    stats.cachedAt !== null &&
    stats.isExpired === false &&
    stats.remainingTtlMs > 0
  );
}

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

/**
 * PromidasInfoSection - Display link to PROMIDAS documentation
 */
function PromidasInfoSection() {
  return (
    <>
      <Box
        sx={{
          py: 3,
          px: 2,
          textAlign: 'center',
          backgroundColor: '#0288d1',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'white',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          fontWeight={600}
          sx={{
            color: 'white',
            textAlign: 'center',
            my: 3,
            fontSize: {
              xs: '1.5rem', // h5相当 (小画面)
              sm: '2rem', // h4相当 (中画面)
              md: '2.5rem', // h3相当 (大画面)
              lg: '3rem', // h2相当 (特大画面)
            },
          }}
        >
          🛝 PROMIDAS Playground
        </Typography>

        <Link
          href="https://f88.github.io/promidas/"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            color: 'white',
            fontWeight: 500,
            fontSize: '1.1rem',
          }}
        >
          📚 PROMIDAS とは
        </Link>
      </Box>
    </>
  );
}

function App() {
  const [token, setTokenInput] = useState('');
  const [hasToken, setHasToken] = useState(false);

  // Initialize token from storage
  useEffect(() => {
    const initToken = async () => {
      const storedToken = await tokenStorage.get();
      if (storedToken) {
        setTokenInput(storedToken);
      }
      setHasToken(await tokenStorage.has());
    };
    void initToken();
  }, []);

  // Data flow visualization
  const {
    isFetcherActive,
    isStoreActive,
    isRepositoryActive,
    isDisplayActive,
    setIsFetcherActive,
    setIsStoreActive,
    setIsRepositoryActive,
    setIsDisplayActive,
    handleGetStoreInfo,
    handleUseSnapshot,
  } = useDataFlowIndicators();

  // Stats for header (updated every second for Remaining TTL)
  const {
    stats: headerStats,
    updateStats: updateHeaderStats,
    clearStats: clearHeaderStats,
  } = useHeaderStats();
  // Stats for store display (updated only when data actually changes)
  const {
    stats: storeStats,
    updateStats: updateStoreStats,
    clearStats: clearStoreStats,
  } = useStoreStats();

  const {
    config: repoConfig,
    loading: configLoading,
    error: configError,
    fetchConfig,
    clear: clearConfig,
  } = useConfig();

  const showStoreInfo = useCallback(() => {
    fetchConfig();
    updateHeaderStats();
    updateStoreStats();
  }, [fetchConfig, updateHeaderStats, updateStoreStats]);

  const hideStoreInfo = useCallback(() => {
    clearConfig();
    clearHeaderStats();
    clearStoreStats();
  }, [clearConfig, clearHeaderStats, clearStoreStats]);

  // Listen to repository events for real-time fetch visualization
  useSnapshotEventHandlers({
    setIsRepositoryActive,
    setIsStoreActive,
    updateHeaderStats,
    updateStoreStats,
  });

  // Control Fetcher active state based on download progress
  const downloadProgress = useDownloadProgress();
  useEffect(() => {
    const latestProgress = downloadProgress[downloadProgress.length - 1];
    if (!latestProgress) {
      setIsFetcherActive(false);
      return;
    }

    const isActive =
      latestProgress.status === 'request-start' ||
      latestProgress.status === 'started' ||
      latestProgress.status === 'in-progress';
    setIsFetcherActive(isActive);
  }, [downloadProgress, setIsFetcherActive]);

  // Initialize config and stats on mount
  useEffect(() => {
    const initializeWithToken = async () => {
      const hasToken = await tokenStorage.has();
      if (hasToken) {
        showStoreInfo();
        return;
      }

      hideStoreInfo();
    };

    void initializeWithToken();
  }, [showStoreInfo, hideStoreInfo]);

  // Periodically update stats to show remaining TTL changes
  useEffect(() => {
    if (!isCacheAliveForTtlPolling(headerStats)) {
      return;
    }

    const expiryBufferMs = 100;

    const expiryTimeoutId = window.setTimeout(() => {
      updateHeaderStats();
    }, headerStats.remainingTtlMs + expiryBufferMs);

    if (headerStats.remainingTtlMs < 1_000) {
      return () => window.clearTimeout(expiryTimeoutId);
    }

    const intervalId = window.setInterval(() => {
      updateHeaderStats();
    }, 1_000); // Update every 1 second

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(expiryTimeoutId);
    };
  }, [headerStats, updateHeaderStats]);

  const handleSaveToken = async () => {
    if (token.trim()) {
      await tokenStorage.save(token.trim());
      setHasToken(true);
      resetRepository();
      showStoreInfo();
    }
  };

  const handleDeleteToken = async () => {
    if (confirm('トークンを削除してよろしいですか？')) {
      await tokenStorage.remove();
      setHasToken(false);
      resetRepository();
      setTokenInput('');
      hideStoreInfo();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader
        stats={headerStats}
        config={repoConfig}
        dataFlowIndicator={{
          isFetcherActive,
          isStoreActive,
          isRepositoryActive,
          isDisplayActive,
        }}
      />

      <PromidasInfoSection />

      <Container
        component="main"
        maxWidth="xl"
        sx={{
          mt: 6,
          mb: 6,
        }}
      >
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 12,
              lg: 6,
            }}
          >
            <ConfigContainer>
              <Grid container spacing={2}>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <TokenConfiguration
                    token={token}
                    setToken={setTokenInput}
                    hasToken={hasToken}
                    onSaveToken={handleSaveToken}
                    onDeleteToken={handleDeleteToken}
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <RepositorySettings onSettingsSaved={showStoreInfo} />
                </Grid>
              </Grid>
            </ConfigContainer>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 12,
              lg: 6,
            }}
          >
            <Grid
              size={{
                xs: 12,
              }}
            >
              <FetcherContainer />
            </Grid>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <StoreContainer
              isActive={isStoreActive}
              stats={storeStats}
              fetchStats={updateStoreStats}
              config={repoConfig}
              configLoading={configLoading}
              configError={configError}
              fetchConfig={fetchConfig}
              onGetStoreInfo={handleGetStoreInfo}
              onDisplayChange={setIsDisplayActive}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <RepositoryContainer
              isActive={isRepositoryActive}
              stats={storeStats}
              fetchStats={updateStoreStats}
              config={repoConfig}
              configLoading={configLoading}
              configError={configError}
              fetchConfig={fetchConfig}
              onDisplayChange={setIsDisplayActive}
              onGetStoreInfo={handleGetStoreInfo}
              onUseSnapshot={handleUseSnapshot}
            />
          </Grid>
        </Grid>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: 'auto',
          textAlign: 'center',
          backgroundColor: '#0288d1',
          color: 'white',
        }}
      >
        <Typography variant="body2">
          Powered by{' '}
          <Link
            href="https://f88.github.io/promidas/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: 'white', fontWeight: 600 }}
          >
            PROMIDAS
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
