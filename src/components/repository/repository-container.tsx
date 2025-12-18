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
import { GetConfig } from '../store/get-config';
import { GetStats } from '../store/get-stats';
import { useState } from 'react';
import { useSnapshotManagement } from '../../hooks';
import { SNAPSHOT_LIMITS } from '../../App';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import type { ListPrototypesParams } from 'protopedia-api-v2-client';
import type { StoreConfig } from '../../hooks/use-config';

type FlowPattern =
  | 'get-store-info'
  | 'get-from-snapshot'
  | 'fetch-individual'
  | 'forced-fetch'
  | 'simple-display';

interface RepositoryContainerProps {
  isActive?: boolean;
  stats: PrototypeInMemoryStats | null;
  fetchStats: () => void;
  config: StoreConfig | null;
  configLoading: boolean;
  configError: string | null;
  fetchConfig: () => void;
  visualizeFlow: (
    operation: () => Promise<void> | void,
    pattern: FlowPattern,
  ) => Promise<void>;
}

export function RepositoryContainer({
  isActive = false,
  stats,
  fetchStats,
  configLoading,
  fetchConfig,
  visualizeFlow,
}: RepositoryContainerProps) {
  // Snapshot Management State
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

  // Hooks
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

  // Event Handlers
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
      fetchStats();
    }, 'forced-fetch');
  };

  const handleRefreshSnapshot = async () => {
    await visualizeFlow(async () => {
      await refreshSnapshot();
      fetchStats();
    }, 'forced-fetch');
  };

  const wrappedFetchConfig = () => {
    visualizeFlow(() => {
      fetchConfig();
    }, 'get-store-info');
  };

  const wrappedUpdateStats = () => {
    visualizeFlow(() => {
      fetchStats();
    }, 'get-store-info');
  };

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

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <GetConfig
            configLoading={configLoading}
            fetchConfig={wrappedFetchConfig}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GetStats fetchStats={wrappedUpdateStats} />
        </Grid>
      </Grid>

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

      <Analysis stats={stats} visualizeFlow={visualizeFlow} />

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
          <PrototypeIds stats={stats} visualizeFlow={visualizeFlow} />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <AllPrototypes stats={stats} visualizeFlow={visualizeFlow} />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <SearchById stats={stats} visualizeFlow={visualizeFlow} />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <SingleRandom stats={stats} visualizeFlow={visualizeFlow} />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <RandomPrototype stats={stats} visualizeFlow={visualizeFlow} />
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
}
