import { Typography, Stack, Grid } from '@mui/material';
import { ContainerWrapper } from '../common/container-wrapper';
import { SetupSnapshot } from './setup-snapshot';
import { RefreshSnapshot } from './refresh-snapshot';
import { RandomPrototype } from './random-prototype';
import { SearchById } from './search-by-id';
import { SingleRandom } from './single-random';
import { PrototypeIds } from './prototype-ids';
import { AllPrototypes } from './all-prototypes';
import { Analysis } from './analysis';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import type { NormalizedPrototype } from '@f88/promidas/types';

interface RepositoryContainerProps {
  isActive?: boolean;

  // Snapshot Management
  snapshotLimit: string;
  setSnapshotLimit: (value: string) => void;
  snapshotOffset: string;
  setSnapshotOffset: (value: string) => void;
  snapshotUserNm: string;
  setSnapshotUserNm: (value: string) => void;
  snapshotTagNm: string;
  setSnapshotTagNm: (value: string) => void;
  snapshotEventNm: string;
  setSnapshotEventNm: (value: string) => void;
  snapshotMaterialNm: string;
  setSnapshotMaterialNm: (value: string) => void;
  setupLoading: boolean;
  refreshLoading: boolean;
  setupSuccess: string | null;
  setupError: string | null;
  refreshSuccess: string | null;
  refreshError: string | null;
  handleSetupSnapshot: () => void;
  handleResetSnapshotForm: () => void;
  handleRefreshSnapshot: () => void;

  // Random Prototype
  randomPrototype: NormalizedPrototype | null;
  randomLoading: boolean;
  randomError: string | null;
  handleFetchRandom: () => void;
  clearRandom: () => void;

  // Search By ID
  searchId: string;
  setSearchId: (value: string) => void;
  searchPrototype: NormalizedPrototype | null;
  searchLoading: boolean;
  searchError: string | null;
  handleSearch: () => void;
  clearSearch: () => void;

  // Single Random
  singleRandomPrototype: NormalizedPrototype | null;
  singleRandomLoading: boolean;
  singleRandomError: string | null;
  fetchSingleRandom: () => void;
  clearSingleRandom: () => void;

  // Prototype IDs
  prototypeIds: readonly number[] | null;
  idsLoading: boolean;
  idsError: string | null;
  fetchIds: () => void;
  clearIds: () => void;

  // All Prototypes
  allPrototypes: NormalizedPrototype[] | null;
  allLoading: boolean;
  allError: string | null;
  fetchAll: () => void;
  clearAll: () => void;

  // Analysis
  analysis: { min: number | null; max: number | null } | null;
  analysisLoading: boolean;
  analysisError: string | null;
  analyze: () => void;
  clearAnalysis: () => void;

  // Common
  stats: PrototypeInMemoryStats | null;
}

export function RepositoryContainer({
  isActive = false,
  snapshotLimit,
  setSnapshotLimit,
  snapshotOffset,
  setSnapshotOffset,
  snapshotUserNm,
  setSnapshotUserNm,
  snapshotTagNm,
  setSnapshotTagNm,
  snapshotEventNm,
  setSnapshotEventNm,
  snapshotMaterialNm,
  setSnapshotMaterialNm,
  setupLoading,
  refreshLoading,
  setupSuccess,
  setupError,
  refreshSuccess,
  refreshError,
  handleSetupSnapshot,
  handleResetSnapshotForm,
  handleRefreshSnapshot,
  randomPrototype,
  randomLoading,
  randomError,
  handleFetchRandom,
  clearRandom,
  searchId,
  setSearchId,
  searchPrototype,
  searchLoading,
  searchError,
  handleSearch,
  clearSearch,
  singleRandomPrototype,
  singleRandomLoading,
  singleRandomError,
  fetchSingleRandom,
  clearSingleRandom,
  prototypeIds,
  idsLoading,
  idsError,
  fetchIds,
  clearIds,
  allPrototypes,
  allLoading,
  allError,
  fetchAll,
  clearAll,
  analysis,
  analysisLoading,
  analysisError,
  analyze,
  clearAnalysis,
  stats,
}: RepositoryContainerProps) {
  return (
    <ContainerWrapper type="repository" label="Repository" isActive={isActive}>
      {/* Management Operations */}
      <Typography
        variant="h6"
        sx={{
          mt: 2,
          mb: 1,
          fontSize: '1.1rem',
          fontWeight: 600,
        }}
      >
        Snapshot Management
      </Typography>

      <Stack spacing={2}>
        {/* Setup Snapshot */}
        <SetupSnapshot
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
          snapshotLoading={setupLoading}
          snapshotSuccess={setupSuccess}
          snapshotError={setupError}
          handleSetupSnapshot={handleSetupSnapshot}
          handleResetSnapshotForm={handleResetSnapshotForm}
        />

        {/* Refresh Snapshot */}
        <RefreshSnapshot
          snapshotLoading={refreshLoading}
          snapshotSuccess={refreshSuccess}
          snapshotError={refreshError}
          stats={stats}
          handleRefreshSnapshot={handleRefreshSnapshot}
        />
      </Stack>

      {/* Analysis Operations */}
      <Typography
        variant="h6"
        sx={{
          mt: 3,
          mb: 1,
          fontSize: '1.1rem',
          fontWeight: 600,
        }}
      >
        Snapshot Analysis{' '}
        <Typography
          component="span"
          sx={{ fontSize: '0.85rem', fontWeight: 400, opacity: 0.7 }}
        >
          (returns data even if TTL expired)
        </Typography>
      </Typography>

      <Analysis
        analysis={analysis}
        analysisLoading={analysisLoading}
        analysisError={analysisError}
        stats={stats}
        analyze={analyze}
        clearAnalysis={clearAnalysis}
      />

      {/* Query Operations */}
      <Typography
        variant="h6"
        sx={{
          mt: 3,
          mb: 1,
          fontSize: '1.1rem',
          fontWeight: 600,
        }}
      >
        Snapshot Query{' '}
        <Typography
          component="span"
          sx={{ fontSize: '0.85rem', fontWeight: 400, opacity: 0.7 }}
        >
          (returns data even if TTL expired)
        </Typography>
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <RandomPrototype
            randomPrototype={randomPrototype}
            randomLoading={randomLoading}
            randomError={randomError}
            stats={stats}
            handleFetchRandom={handleFetchRandom}
            clearRandom={clearRandom}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <SearchById
            searchId={searchId}
            setSearchId={setSearchId}
            searchPrototype={searchPrototype}
            searchLoading={searchLoading}
            searchError={searchError}
            stats={stats}
            handleSearch={handleSearch}
            clearSearch={clearSearch}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <SingleRandom
            singleRandomPrototype={singleRandomPrototype}
            singleRandomLoading={singleRandomLoading}
            singleRandomError={singleRandomError}
            stats={stats}
            fetchSingleRandom={fetchSingleRandom}
            clearSingleRandom={clearSingleRandom}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <PrototypeIds
            prototypeIds={prototypeIds}
            idsLoading={idsLoading}
            idsError={idsError}
            stats={stats}
            fetchIds={fetchIds}
            clearIds={clearIds}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <AllPrototypes
            allPrototypes={allPrototypes}
            allLoading={allLoading}
            allError={allError}
            stats={stats}
            fetchAll={fetchAll}
            clearAll={clearAll}
          />
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
}
