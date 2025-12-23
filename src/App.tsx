import { Box, Container, Grid, Link, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import './App.css';
import { AppHeader } from './components/common/app-header';
import { ConfigContainer } from './components/config/config-container';
import { TokenConfiguration } from './components/config/token-configuration';
import { RepositorySettings } from './components/config/repository-settings';
import { FetcherContainer } from './components/fetcher/fetcher-container';
import { RepositoryContainer } from './components/repository/repository-container';
import { StoreContainer } from './components/store/store-container';
import { resetRepository } from './lib/repository/protopedia-repository';
import {
  getApiToken,
  hasApiToken,
  removeApiToken,
  setApiToken,
} from './lib/token/token-storage';
import {
  useRepositoryStats,
  useConfig,
  useRepositoryEvents,
  useDownloadProgress,
  type RepositoryStats,
} from './hooks';

function isCacheAliveForTtlPolling(
  stats: RepositoryStats | null,
): stats is RepositoryStats {
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
    <Box
      sx={{
        py: 4,
        px: 2,
        textAlign: 'center',
        backgroundColor: 'rgba(52, 131, 75, 0.7)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'white',
      }}
    >
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
  );
}

function App() {
  const [token, setTokenInput] = useState(getApiToken() || '');

  // Data flow visualization states
  const [isFetcherActive, setIsFetcherActive] = useState(false);
  const [isStoreActive, setIsStoreActive] = useState(false);
  const [isRepositoryActive, setIsRepositoryActive] = useState(false);
  const [isDisplayActive, setIsDisplayActive] = useState(false);

  const { stats, updateStats, clearStats } = useRepositoryStats();
  const {
    config: repoConfig,
    loading: configLoading,
    error: configError,
    fetchConfig,
    clear: clearConfig,
  } = useConfig();

  const showStoreInfo = () => {
    fetchConfig();
    updateStats();
  };

  const hideStoreInfo = () => {
    clearConfig();
    clearStats();
  };

  // Listen to repository events for real-time fetch visualization
  useRepositoryEvents({
    onSnapshotStarted: () => {
      console.debug('[Repository Event] Snapshot Started');
      setIsRepositoryActive(true);
      setIsStoreActive(true);
    },
    onSnapshotCompleted: (stats) => {
      console.debug('[Repository Event] Snapshot Completed', stats);
      setIsRepositoryActive(false);
      setIsStoreActive(false);
      updateStats();
    },
    onSnapshotFailed: () => {
      console.debug('[Repository Event] Snapshot Failed');
      setIsRepositoryActive(false);
      setIsStoreActive(false);
    },
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
  }, [downloadProgress]);

  // Initialize config and stats on mount
  useEffect(() => {
    if (hasApiToken()) {
      showStoreInfo();
      return;
    }

    hideStoreInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Periodically update stats to show remaining TTL changes
  useEffect(() => {
    if (!isCacheAliveForTtlPolling(stats)) {
      return;
    }

    const expiryBufferMs = 100;

    const expiryTimeoutId = window.setTimeout(() => {
      updateStats();
    }, stats.remainingTtlMs + expiryBufferMs);

    if (stats.remainingTtlMs < 1_000) {
      return () => window.clearTimeout(expiryTimeoutId);
    }

    const intervalId = window.setInterval(() => {
      updateStats();
    }, 1_000); // Update every 1 second

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(expiryTimeoutId);
    };
  }, [stats, updateStats]);

  const handleSaveToken = () => {
    if (token.trim()) {
      setApiToken(token.trim());
      resetRepository();
      showStoreInfo();
    }
  };

  const handleDeleteToken = () => {
    if (confirm('トークンを削除してよろしいですか？')) {
      removeApiToken();
      resetRepository();
      setTokenInput('');
      hideStoreInfo();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader
        stats={stats}
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
                    hasToken={hasApiToken()}
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
              stats={stats}
              fetchStats={updateStats}
              config={repoConfig}
              configLoading={configLoading}
              configError={configError}
              fetchConfig={fetchConfig}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <RepositoryContainer
              isActive={isRepositoryActive}
              stats={stats}
              fetchStats={updateStats}
              config={repoConfig}
              configLoading={configLoading}
              configError={configError}
              fetchConfig={fetchConfig}
              onDisplayChange={setIsDisplayActive}
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
