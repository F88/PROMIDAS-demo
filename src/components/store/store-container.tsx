import { Grid } from '@mui/material';
import { ContainerWrapper } from '../common/container-wrapper';
import { ConfigDisplay } from './config-display';
import type { RepositoryStats } from '../../hooks/use-repository-stats';
// import { GetStats } from './get-stats';
// import { GetConfig } from './get-config';
import { StatsDisplay } from './stats-display';
import type { StoreConfig } from '../../hooks/use-config';

interface StoreContainerProps {
  stats: RepositoryStats | null;
  fetchStats: () => void;
  config: StoreConfig | null;
  configLoading: boolean;
  configError: string | null;
  fetchConfig: () => void;
  isActive?: boolean;
}

export function StoreContainer({
  stats,
  // fetchStats,
  config,
  configLoading,
  configError,
  // fetchConfig,
  isActive = false,
}: StoreContainerProps) {
  return (
    <ContainerWrapper type="store" label="Store" isActive={isActive}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ConfigDisplay
            repoConfig={config}
            configLoading={configLoading}
            configError={configError}
          />
        </Grid>
        {/* <Grid size={{ xs: 12, md: 6 }}>
          <GetConfig configLoading={configLoading} fetchConfig={fetchConfig} />
        </Grid> */}
        <Grid size={{ xs: 12, md: 6 }}>
          <StatsDisplay stats={stats} />
        </Grid>
        {/* <Grid size={{ xs: 12, md: 6 }}>
          <GetStats fetchStats={fetchStats} />
        </Grid> */}
      </Grid>
    </ContainerWrapper>
  );
}
