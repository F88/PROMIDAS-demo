import { Box, Container, Grid, Link, Stack, Typography } from '@mui/material';
import type { ListPrototypesParams } from 'protopedia-api-v2-client';
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
import {
  useRandomPrototype,
  useRepositoryStats,
  useSnapshotManagement,
  usePrototypeSearch,
  usePrototypeIds,
  useSingleRandom,
  useConfig,
  useAllPrototypes,
  usePrototypeAnalysis,
} from './hooks';

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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
  const [searchId, setSearchId] = useState('1');
  const [snapshotLimit, setSnapshotLimit] = useState(
    SNAPSHOT_LIMITS.DEFAULT_LIMIT.toString(),
  );
  const [snapshotOffset, setSnapshotOffset] = useState(
    SNAPSHOT_LIMITS.DEFAULT_OFFSET.toString(),
  );
  const [snapshotUserNm, setSnapshotUserNm] = useState('');
  const [snapshotTagNm, setSnapshotTagNm] = useState('');
  const [snapshotEventNm, setSnapshotEventNm] = useState('');
  const [snapshotMaterialNm, setSnapshotMaterialNm] = useState('');
  const [randomSampleSize, setRandomSampleSize] = useState('3');
  const [token, setTokenInput] = useState(getApiToken() || '');

  // Data flow visualization states
  const [isFetcherActive, setIsFetcherActive] = useState(false);
  const [isStoreActive, setIsStoreActive] = useState(false);
  const [isRepositoryActive, setIsRepositoryActive] = useState(false);
  const [isDisplayActive, setIsDisplayActive] = useState(false);

  const {
    prototypes: randomPrototypes,
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
    setSnapshotLimit(SNAPSHOT_LIMITS.DEFAULT_LIMIT.toString());
    setSnapshotOffset(SNAPSHOT_LIMITS.DEFAULT_OFFSET.toString());
    setSnapshotUserNm('');
    setSnapshotTagNm('');
    setSnapshotEventNm('');
    setSnapshotMaterialNm('');
  };

  const handleSetupSnapshot = async () => {
    let limit = parseInt(snapshotLimit) || 10;
    if (limit > 1000) {
      limit = 1000;
      setSnapshotLimit(limit.toString());
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
    const size = parseInt(randomSampleSize) || 1;
    clearSearch();
    visualizeFlow(() => {
      fetchRandom(size);
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
              randomPrototypes={randomPrototypes}
              randomLoading={randomLoading}
              randomError={randomError}
              randomSampleSize={randomSampleSize}
              setRandomSampleSize={setRandomSampleSize}
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

          {!randomPrototypes.length &&
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
