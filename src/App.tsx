import { Box, Container, Grid, Link, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import './App.css';
import { AppHeader } from './components/common/app-header';
import { ConfigContainer } from './components/config/config-container';
import { TokenConfiguration } from './components/config/token-configuration';
import { FetcherContainer } from './components/fetcher/fetcher-container';
import { RepositoryContainer } from './components/repository/repository-container';
import { StoreContainer } from './components/store/store-container';
import { resetRepository } from './lib/protopedia-repository';
import {
  getApiToken,
  hasApiToken,
  removeApiToken,
  setApiToken,
} from './lib/token-storage';
import { useRepositoryStats, useConfig } from './hooks';

/**
 * Constants for snapshot configuration
 */
export const SNAPSHOT_LIMITS = {
  MAX_LIMIT: 1000,
  MIN_LIMIT: 1,
  DEFAULT_LIMIT: 10,
  MIN_OFFSET: 0,
  DEFAULT_OFFSET: 0,
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

  const { stats, updateStats } = useRepositoryStats();
  const {
    config: repoConfig,
    loading: configLoading,
    error: configError,
    fetchConfig,
  } = useConfig();

  // Initialize config and stats on mount
  useEffect(() => {
    fetchConfig();
    updateStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Periodically update stats to show remaining TTL changes
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateStats();
    }, 1_000); // Update every 1 seconds

    return () => clearInterval(intervalId);
  }, [updateStats]);

  // Visualize data flow with flexible step control
  type FlowStep = 'fetcher' | 'store' | 'repository' | 'display';

  const visualizeDataFlow = async (
    operation: () => Promise<void> | void,
    sequence: FlowStep[],
  ) => {
    const delays: Record<FlowStep, number> = {
      fetcher: 300,
      store: 600,
      repository: 400,
      display: 1000,
    };

    const setters: Record<FlowStep, (active: boolean) => void> = {
      fetcher: setIsFetcherActive,
      store: setIsStoreActive,
      repository: setIsRepositoryActive,
      display: setIsDisplayActive,
    };

    let operationExecuted = false;

    for (const step of sequence) {
      setters[step](true);

      // Execute operation on the first step
      if (!operationExecuted) {
        await operation();
        operationExecuted = true;
      }

      await new Promise((resolve) => setTimeout(resolve, delays[step]));
      setters[step](false);
    }
  };

  // Convenience wrapper for common flow patterns
  type FlowPattern =
    | 'get-store-info'
    | 'get-from-snapshot'
    | 'fetch-individual'
    | 'forced-fetch'
    | 'simple-display';

  const visualizeFlow = async (
    operation: () => Promise<void> | void,
    pattern: FlowPattern,
  ) => {
    const patterns: Record<FlowPattern, FlowStep[]> = {
      // Repository gets Store info (config/stats) and returns to Display
      'get-store-info': ['repository', 'store', 'repository', 'display'],
      // Repository gets data from snapshot in Store, returns to Display
      'get-from-snapshot': ['repository', 'store', 'repository', 'display'],
      // Repository checks Store (miss), fetches individual via Fetcher, saves to Store, returns to Display
      'fetch-individual': [
        'repository',
        'store',
        'fetcher',
        'repository',
        'store',
        'display',
      ],
      // Repository forces fetch via Fetcher, saves to Store (success/fail), returns to Display
      'forced-fetch': [
        'repository',
        'fetcher',
        'repository',
        'store',
        'repository',
        'display',
      ],
      // Simple display without data flow (for UI-only operations)
      'simple-display': ['display'],
    };

    return visualizeDataFlow(operation, patterns[pattern]);
  };

  const wrappedFetchConfig = () => {
    visualizeFlow(() => {
      fetchConfig();
    }, 'get-store-info');
  };

  const wrappedUpdateStats = () => {
    visualizeFlow(() => {
      updateStats();
    }, 'get-store-info');
  };

  const handleTokenChange = () => {
    // Refresh stats after token change
    updateStats();
  };

  const handleSaveToken = () => {
    if (token.trim()) {
      setApiToken(token.trim());
      resetRepository();
      handleTokenChange();
    }
  };

  const handleDeleteToken = () => {
    if (confirm('トークンを削除してよろしいですか？')) {
      removeApiToken();
      resetRepository();
      setTokenInput('');
      handleTokenChange();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader
        stats={stats}
        config={repoConfig}
        isFetcherActive={isFetcherActive}
        isStoreActive={isStoreActive}
        isRepositoryActive={isRepositoryActive}
        isDisplayActive={isDisplayActive}
      />

      <PromidasInfoSection />

      <Container component="main" maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ConfigContainer>
              <TokenConfiguration
                token={token}
                setToken={setTokenInput}
                hasToken={hasApiToken()}
                onSaveToken={handleSaveToken}
                onDeleteToken={handleDeleteToken}
              />
            </ConfigContainer>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FetcherContainer isActive={isFetcherActive} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <StoreContainer
              isActive={isStoreActive}
              stats={stats}
              fetchStats={wrappedUpdateStats}
              config={repoConfig}
              configLoading={configLoading}
              configError={configError}
              fetchConfig={wrappedFetchConfig}
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
              visualizeFlow={visualizeFlow}
            />
          </Grid>

          {(!stats || stats.size === 0) && (
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  color: '#666',
                }}
              >
                <Typography>
                  No snapshot loaded. Please setup a snapshot first.
                </Typography>
              </Box>
            </Grid>
          )}
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
            href="https://github.com/F88/promidas"
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
