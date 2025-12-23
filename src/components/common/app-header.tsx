import { Box, Stack, Typography } from '@mui/material';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import type { StoreConfig } from '../../hooks/use-config';
import { StatsDashboard } from './stats-dashboard';
import { DataFlowIndicator } from './data-flow-indicator';

interface AppHeaderProps {
  stats: PrototypeInMemoryStats | null;
  config: StoreConfig | null;
  dataFlowIndicator: {
    isFetcherActive: boolean;
    isStoreActive: boolean;
    isRepositoryActive: boolean;
    isDisplayActive: boolean;
  };
}

export function AppHeader({
  stats,
  config,
  dataFlowIndicator: {
    isFetcherActive,
    isStoreActive,
    isRepositoryActive,
    isDisplayActive,
  },
}: AppHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        py: 2,
        px: 2,
        backgroundColor: 'rgba(34, 87, 47, 0.7)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <Stack
        direction={'column'}
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ maxWidth: 1400, margin: '0 auto', mb: 1 }}
      >
        <StatsDashboard stats={stats} config={config} />
        <DataFlowIndicator
          isFetcherActive={isFetcherActive}
          isStoreActive={isStoreActive}
          isRepositoryActive={isRepositoryActive}
          isDisplayActive={isDisplayActive}
        />
      </Stack>
    </Box>
  );
}
