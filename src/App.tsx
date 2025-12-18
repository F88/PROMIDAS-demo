import { useState, useEffect } from 'react';
import { Container, Grid, Link, Box, Stack, Typography } from '@mui/material';
import { useRandomPrototype } from './hooks/use-random-prototype';
import { useRepositoryStats } from './hooks/use-repository-stats';
import { useSnapshotManagement } from './hooks/use-snapshot-management';
import { usePrototypeSearch } from './hooks/use-prototype-search';
import { usePrototypeIds } from './hooks/use-prototype-ids';
import { useSingleRandom } from './hooks/use-single-random';
import { useConfig } from './hooks/use-config';
import { useAllPrototypes } from './hooks/use-all-prototypes';
import { usePrototypeAnalysis } from './hooks/use-prototype-analysis';
import { StoreContainer } from './components/store/store-container';
import { StatsDashboard } from './components/common/stats-dashboard';
import { RepositoryContainer } from './components/repository/repository-container';
import { FetcherContainer } from './components/fetcher/fetcher-container';
import { ConfigContainer } from './components/config/config-container';
import { TokenConfiguration } from './components/config/token-configuration';
import { DataFlowIndicator } from './components/common/data-flow-indicator';
import {
  hasApiToken,
  getApiToken,
  setApiToken,
  removeApiToken,
} from './lib/token-storage';
import { resetRepository } from './lib/protopedia-repository';
import './App.css';
import type { ListPrototypesParams } from 'protopedia-api-v2-client';

function App() {
  const [searchId, setSearchId] = useState('7917');
  const [snapshotLimit, setSnapshotLimit] = useState('10');
  const [snapshotOffset, setSnapshotOffset] = useState('0');
  const [snapshotUserNm, setSnapshotUserNm] = useState('');
  const [snapshotTagNm, setSnapshotTagNm] = useState('');
  const [snapshotEventNm, setSnapshotEventNm] = useState('');
  const [snapshotMaterialNm, setSnapshotMaterialNm] = useState('');
  const [token, setTokenInput] = useState(getApiToken() || '');

  // Data flow visualization states
  const [isFetcherActive, setIsFetcherActive] = useState(false);
  const [isStoreActive, setIsStoreActive] = useState(false);
  const [isRepositoryActive, setIsRepositoryActive] = useState(false);
  const [isDisplayActive, setIsDisplayActive] = useState(false);

  const {
    prototype: randomPrototype,
    loading: randomLoading,
    error: randomError,
    fetchRandom,
    clear: clearRandom,
  } = useRandomPrototype();
  const { stats, updateStats } = useRepositoryStats();
  const {
    setupLoading,
    refreshLoading,
    setupError,
    setupSuccess,
    refreshError,
    refreshSuccess,
    setupSnapshot,
    refreshSnapshot,
  } = useSnapshotManagement();
  const {
    prototype: searchPrototype,
    loading: searchLoading,
    error: searchError,
    searchById,
    clear: clearSearch,
  } = usePrototypeSearch();
  const {
    ids: prototypeIds,
    loading: idsLoading,
    error: idsError,
    fetchIds,
    clear: clearIds,
  } = usePrototypeIds();
  const {
    prototype: singleRandomPrototype,
    loading: singleRandomLoading,
    error: singleRandomError,
    fetchSingleRandom,
    clear: clearSingleRandom,
  } = useSingleRandom();
  const {
    config: repoConfig,
    loading: configLoading,
    error: configError,
    fetchConfig,
  } = useConfig();
  const {
    prototypes: allPrototypes,
    loading: allLoading,
    error: allError,
    fetchAll,
    clear: clearAll,
  } = useAllPrototypes();
  const {
    analysis,
    loading: analysisLoading,
    error: analysisError,
    analyze,
    clear: clearAnalysis,
  } = usePrototypeAnalysis();

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

  const handleResetSnapshotForm = () => {
    setSnapshotLimit('10');
    setSnapshotOffset('0');
    setSnapshotUserNm('');
    setSnapshotTagNm('');
    setSnapshotEventNm('');
    setSnapshotMaterialNm('');
  };

  const handleSetupSnapshot = async () => {
    let limit = parseInt(snapshotLimit) || 10;
    if (limit > 100) {
      limit = 100;
      setSnapshotLimit('100');
    }
    const offset = parseInt(snapshotOffset) || 0;
    const params: ListPrototypesParams = { limit, offset };

    if (snapshotUserNm) params.userNm = snapshotUserNm;
    if (snapshotTagNm) params.tagNm = snapshotTagNm;
    if (snapshotEventNm) params.eventNm = snapshotEventNm;
    if (snapshotMaterialNm) params.materialNm = snapshotMaterialNm;

    await visualizeFlow(async () => {
      await setupSnapshot(params);
      updateStats();
    }, 'forced-fetch');
  };

  const handleRefreshSnapshot = async () => {
    await visualizeFlow(async () => {
      await refreshSnapshot();
      updateStats();
    }, 'forced-fetch');
  };

  const handleFetchRandom = () => {
    clearSearch();
    visualizeFlow(() => {
      fetchRandom();
    }, 'get-from-snapshot');
  };

  const handleSearch = () => {
    const id = parseInt(searchId);
    if (!isNaN(id)) {
      visualizeFlow(() => {
        searchById(id);
      }, 'get-from-snapshot');
    }
  };

  const wrappedFetchSingleRandom = () => {
    visualizeFlow(() => {
      fetchSingleRandom();
    }, 'get-from-snapshot');
  };

  const wrappedFetchIds = () => {
    visualizeFlow(() => {
      fetchIds();
    }, 'get-from-snapshot');
  };

  const wrappedFetchConfig = () => {
    visualizeFlow(() => {
      fetchConfig();
    }, 'get-store-info');
  };

  const wrappedFetchAll = () => {
    visualizeFlow(() => {
      fetchAll();
    }, 'get-from-snapshot');
  };

  const wrappedAnalyze = () => {
    visualizeFlow(() => {
      analyze();
    }, 'get-from-snapshot');
  };

  const wrappedUpdateStats = () => {
    visualizeFlow(() => {
      updateStats();
    }, 'get-store-info');
  };

  const handleTokenChange = () => {
    // Clear all prototypes and refresh stats
    clearRandom();
    clearSearch();
    clearIds();
    clearSingleRandom();
    clearAll();
    clearAnalysis();
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
      <Box
        component="header"
        sx={{
          py: 3,
          px: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          sx={{ maxWidth: 1400, margin: '0 auto 1rem' }}
        >
          <Box
            sx={{
              flex: 1,
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              fontWeight={700}
              sx={{ mb: 0.5 }}
            >
              PROMIDAS Demo
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
              ProtoPedia Resource Organized Management In-memory Data Access
              Store
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
              }}
            >
              📚 PROMIDAS とは
            </Link>
          </Box>
          <StatsDashboard stats={stats} config={repoConfig} />
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <DataFlowIndicator
            isFetcherActive={isFetcherActive}
            isStoreActive={isStoreActive}
            isRepositoryActive={isRepositoryActive}
            isDisplayActive={isDisplayActive}
          />
        </Box>
      </Box>

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
              snapshotLimit={snapshotLimit}
              setSnapshotLimit={setSnapshotLimit}
              snapshotOffset={snapshotOffset}
              setSnapshotOffset={setSnapshotOffset}
              snapshotUserNm={snapshotUserNm}
              setSnapshotUserNm={setSnapshotUserNm}
              snapshotTagNm={snapshotTagNm}
              setSnapshotTagNm={setSnapshotTagNm}
              snapshotEventNm={snapshotEventNm}
              setSnapshotEventNm={setSnapshotEventNm}
              snapshotMaterialNm={snapshotMaterialNm}
              setSnapshotMaterialNm={setSnapshotMaterialNm}
              setupLoading={setupLoading}
              refreshLoading={refreshLoading}
              setupSuccess={setupSuccess}
              setupError={setupError}
              refreshSuccess={refreshSuccess}
              refreshError={refreshError}
              stats={stats}
              handleSetupSnapshot={handleSetupSnapshot}
              handleResetSnapshotForm={handleResetSnapshotForm}
              handleRefreshSnapshot={handleRefreshSnapshot}
              randomPrototype={randomPrototype}
              randomLoading={randomLoading}
              randomError={randomError}
              handleFetchRandom={handleFetchRandom}
              clearRandom={clearRandom}
              searchId={searchId}
              setSearchId={setSearchId}
              searchPrototype={searchPrototype}
              searchLoading={searchLoading}
              searchError={searchError}
              handleSearch={handleSearch}
              clearSearch={clearSearch}
              singleRandomPrototype={singleRandomPrototype}
              singleRandomLoading={singleRandomLoading}
              singleRandomError={singleRandomError}
              fetchSingleRandom={wrappedFetchSingleRandom}
              clearSingleRandom={clearSingleRandom}
              prototypeIds={prototypeIds}
              idsLoading={idsLoading}
              idsError={idsError}
              fetchIds={wrappedFetchIds}
              clearIds={clearIds}
              allPrototypes={allPrototypes}
              allLoading={allLoading}
              allError={allError}
              fetchAll={wrappedFetchAll}
              clearAll={clearAll}
              analysis={analysis}
              analysisLoading={analysisLoading}
              analysisError={analysisError}
              analyze={wrappedAnalyze}
              clearAnalysis={clearAnalysis}
            />
          </Grid>

          {!randomPrototype &&
            !searchPrototype &&
            !singleRandomPrototype &&
            !prototypeIds &&
            !repoConfig &&
            !allPrototypes &&
            !analysis &&
            !randomLoading &&
            !searchLoading &&
            !singleRandomLoading &&
            !idsLoading &&
            !configLoading &&
            !allLoading &&
            !analysisLoading &&
            stats &&
            stats.size > 0 && (
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    color: '#666',
                  }}
                >
                  <Typography>
                    Click any button above to explore the PROMIDAS API
                  </Typography>
                </Box>
              </Grid>
            )}

          {(!stats || stats.size === 0) && !setupLoading && !refreshLoading && (
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
