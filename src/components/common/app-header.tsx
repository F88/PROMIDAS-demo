import { Box, Stack, Typography } from '@mui/material';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import type { StoreConfig } from '../../hooks/use-config';
import { StatsDashboard } from './stats-dashboard';
import { DataFlowIndicator } from './data-flow-indicator';

interface AppHeaderProps {
  stats: PrototypeInMemoryStats | null;
  config: StoreConfig | null;
  isFetcherActive: boolean;
  isStoreActive: boolean;
  isRepositoryActive: boolean;
  isDisplayActive: boolean;
}

export function AppHeader({
  stats,
  config,
  isFetcherActive,
  isStoreActive,
  isRepositoryActive,
  isDisplayActive,
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
        <Typography
          variant="h4"
          component="h1"
          fontWeight={600}
          sx={{
            color: 'white',
            textAlign: 'center',
            fontSize: {
              xs: '1.5rem', // h5相当 (小画面)
              sm: '2rem', // h4相当 (中画面)
              md: '2.5rem', // h3相当 (大画面)
              lg: '3rem', // h2相当 (特大画面)
            },
          }}
        >
          PROMIDAS Demo
        </Typography>
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
