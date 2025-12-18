import { Box, Stack, Chip } from '@mui/material';

interface DataFlowIndicatorProps {
  isFetcherActive: boolean;
  isStoreActive: boolean;
  isRepositoryActive: boolean;
  isDisplayActive: boolean;
}

interface FlowItemProps {
  icon: string;
  label: string;
  isActive: boolean;
}

function FlowItem({ icon, label, isActive }: FlowItemProps) {
  return (
    <Chip
      icon={<span>{icon}</span>}
      label={<Box sx={{ display: { xs: 'none', sm: 'inline' } }}>{label}</Box>}
      size="small"
      sx={{
        backgroundColor: isActive
          ? 'rgba(255, 255, 255, 0.2)'
          : 'rgba(255, 255, 255, 0.1)',
        color: 'white',
        border: isActive
          ? '2px solid rgba(255, 255, 255, 0.4)'
          : '2px solid transparent',
        fontWeight: 600,
        fontSize: '0.75rem',
        transition: 'all 0.3s ease',
        boxShadow: isActive ? '0 0 15px rgba(255, 255, 255, 0.3)' : 'none',
        '& .MuiChip-icon': {
          fontSize: '1.25rem',
          animation: isActive
            ? 'indicatorPulse 0.8s ease-in-out infinite'
            : 'none',
        },
        '@keyframes indicatorPulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
      }}
    />
  );
}

export function DataFlowIndicator({
  isFetcherActive,
  isStoreActive,
  isRepositoryActive,
  isDisplayActive,
}: DataFlowIndicatorProps) {
  return (
    <Box
      sx={{
        p: 1.5,
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        backdropFilter: 'blur(10px)',
        width: 'fit-content',
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <FlowItem icon="📡" label="Fetcher" isActive={isFetcherActive} />
          <FlowItem icon="💾" label="Store" isActive={isStoreActive} />
          <FlowItem
            icon="📚"
            label="Repository"
            isActive={isRepositoryActive}
          />
          <FlowItem icon="🖥️" label="Display" isActive={isDisplayActive} />
        </Stack>
      </Stack>
    </Box>
  );
}
