import { Typography, Grid } from '@mui/material';
import { ContainerWrapper } from '../common/container-wrapper';
import { SetupSnapshot } from './setup-snapshot';
import { RefreshSnapshot } from './refresh-snapshot';
import { ExportSnapshotData } from './export-snapshot-data';
import { ImportSnapshotData } from './import-snapshot-data';
import { RandomPrototype } from './random-prototype';
import { SearchById } from './search-by-id';
import { SingleRandom } from './single-random';
import { PrototypeIds } from './prototype-ids';
import { AllPrototypes } from './all-prototypes';
import { Analysis } from './analysis';
import { GetConfig } from '../store/get-config';
import { GetStats } from '../store/get-stats';
import { useCallback, useState } from 'react';
import { useSnapshotManagement } from '../../hooks';
import { SETUP_SNAPSHOT } from '../../App';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import type { SerializableSnapshot } from '@f88/promidas/repository/types';
import type { ListPrototypesParams } from 'protopedia-api-v2-client';
import type { StoreConfig } from '../../hooks/use-config';

interface RepositoryContainerProps {
  isActive?: boolean;
  stats: PrototypeInMemoryStats | null;
  fetchStats: () => void;
  config: StoreConfig | null;
  configLoading: boolean;
  configError: string | null;
  fetchConfig: () => void;
  onDisplayChange?: (isDisplaying: boolean) => void;
  onGetStoreInfo?: (isActive: boolean) => void;
  onUseSnapshot?: (isActive: boolean) => void;
}

export function RepositoryContainer({
  isActive = false,
  stats,
  fetchStats,
  configLoading,
  fetchConfig,
  onGetStoreInfo,
  onUseSnapshot,
}: RepositoryContainerProps) {
  // Snapshot Management State
  const [snapshotLimit, setSnapshotLimit] = useState(
    SETUP_SNAPSHOT.LIMIT.DEFAULT.toString(),
  );
  const [snapshotOffset, setSnapshotOffset] = useState(
    SETUP_SNAPSHOT.OFFSET.DEFAULT.toString(),
  );
  const [snapshotUserNm, setSnapshotUserNm] = useState('');
  const [snapshotTagNm, setSnapshotTagNm] = useState('');
  const [snapshotEventNm, setSnapshotEventNm] = useState('');
  const [snapshotMaterialNm, setSnapshotMaterialNm] = useState('');

  // Hooks
  const {
    setupLoading,
    refreshLoading,
    importLoading,
    setupError,
    setupSuccess,
    refreshError,
    refreshSuccess,
    importError,
    importSuccess,
    exportSuccess,
    setupSnapshot,
    refreshSnapshot,
    exportSnapshotToJson,
    exportSnapshotToTsv,
    importSnapshot,
    clearSetupState,
    clearImportState,
    clearExportState,
    // clearRefreshState,
  } = useSnapshotManagement();

  // Event Handlers
  const handleResetSnapshotForm = () => {
    setSnapshotLimit(SETUP_SNAPSHOT.LIMIT.DEFAULT.toString());
    setSnapshotOffset(SETUP_SNAPSHOT.OFFSET.DEFAULT.toString());
    setSnapshotUserNm('');
    setSnapshotTagNm('');
    setSnapshotEventNm('');
    setSnapshotMaterialNm('');
    clearSetupState();
    clearImportState();
    clearExportState();
  };

  const handleSetupSnapshot = async () => {
    const limit = parseInt(snapshotLimit) || 10;
    const offset = parseInt(snapshotOffset) || 0;
    const params: ListPrototypesParams = { limit, offset };

    if (snapshotUserNm) params.userNm = snapshotUserNm;
    if (snapshotTagNm) params.tagNm = snapshotTagNm;
    if (snapshotEventNm) params.eventNm = snapshotEventNm;
    if (snapshotMaterialNm) params.materialNm = snapshotMaterialNm;

    await setupSnapshot(params);
    fetchStats();
  };

  const handleRefreshSnapshot = async () => {
    await refreshSnapshot();
    fetchStats();
  };

  const handleImportSnapshot = async (data: SerializableSnapshot) => {
    importSnapshot(data);
    fetchStats();
  };

  const handleUseSnapshot = useCallback(
    (isActive: boolean) => {
      onUseSnapshot?.(isActive);
    },
    [onUseSnapshot],
  );

  return (
    <ContainerWrapper type="repository" label="Repository" isActive={isActive}>
      {/* Store, Snapshot */}
      <Grid
        container
        spacing={2}
        size={{
          xs: 12,
          // sm: 6,
          // md: 6,
        }}
      >
        {/* Store management */}
        <Grid
          // container
          size={{
            xs: 12,
            sm: 12,
            md: 6,
            lg: 6,
            xl: 6,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              my: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            Store management
          </Typography>
          <Grid
            container
            spacing={2}
            size={{
              xs: 12,
              sm: 12,
              md: 12,
              lg: 12,
              xl: 12,
            }}
          >
            <Grid
              size={{
                xs: 6,
                sm: 6,
                md: 6,
                lg: 6,
                xl: 6,
              }}
            >
              <GetConfig
                configLoading={configLoading}
                fetchConfig={fetchConfig}
                onGetStoreInfo={onGetStoreInfo}
              />
            </Grid>
            <Grid
              size={{
                xs: 6,
                sm: 6,
                md: 6,
                lg: 6,
                xl: 6,
              }}
            >
              <GetStats
                fetchStats={fetchStats}
                onGetStoreInfo={onGetStoreInfo}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Snapshot Management */}

        <Grid
          // container
          // spacing={2}
          size={{
            xs: 12,
            sm: 12,
            md: 6,
            lg: 6,
            xl: 6,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              // mt: 2,
              // mb: 1,
              my: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            Snapshot Management
          </Typography>
          <Grid
            container
            spacing={2}
            size={{
              xs: 12,
              sm: 12,
              md: 12,
              lg: 12,
              xl: 12,
            }}
          >
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 6,
                lg: 6,
                xl: 6,
              }}
            >
              <SetupSnapshot
                stats={stats}
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
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 6,
                lg: 6,
                xl: 6,
              }}
            >
              <RefreshSnapshot
                snapshotLoading={refreshLoading}
                snapshotSuccess={refreshSuccess}
                snapshotError={refreshError}
                stats={stats}
                handleRefreshSnapshot={handleRefreshSnapshot}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 6,
                lg: 6,
                xl: 6,
              }}
            >
              <ExportSnapshotData
                stats={stats}
                exportSuccess={exportSuccess}
                handleExportSnapshotToJson={exportSnapshotToJson}
                handleExportSnapshotToTsv={exportSnapshotToTsv}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 6,
                lg: 6,
                xl: 6,
              }}
            >
              <ImportSnapshotData
                importLoading={importLoading}
                importSuccess={importSuccess}
                importError={importError}
                handleImportSnapshot={handleImportSnapshot}
                clearImportState={clearImportState}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Analysis Operations */}
      <Typography
        variant="h6"
        sx={{
          // mt: 3,
          // mb: 1,
          my: 2,
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

      <Grid container spacing={2}>
        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Analysis stats={stats} onUseSnapshot={handleUseSnapshot} />
        </Grid>
      </Grid>

      {/* Query Operations */}
      <Typography
        variant="h6"
        sx={{
          // mt: 3,
          // mb: 1,
          my: 2,
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

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, xl: 4 }}>
          <PrototypeIds stats={stats} onUseSnapshot={handleUseSnapshot} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, xl: 4 }}>
          <AllPrototypes stats={stats} onUseSnapshot={handleUseSnapshot} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, xl: 4 }}>
          <SearchById stats={stats} onUseSnapshot={handleUseSnapshot} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, xl: 4 }}>
          <SingleRandom stats={stats} onUseSnapshot={handleUseSnapshot} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, xl: 4 }}>
          <RandomPrototype stats={stats} onUseSnapshot={handleUseSnapshot} />
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
}
