import { Box, Stack, Chip, Typography } from '@mui/material';

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
      label={label}
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
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2 }}
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: 'white',
            opacity: 0.9,
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
          }}
        >
          Data Flow Status:
        </Typography>
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <FlowItem icon="📡" label="Fetcher" isActive={isFetcherActive} />
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', mx: 0.5 }}>
            →
          </Typography>
          <FlowItem icon="💾" label="Store" isActive={isStoreActive} />
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', mx: 0.5 }}>
            →
          </Typography>
          <FlowItem
            icon="📚"
            label="Repository"
            isActive={isRepositoryActive}
          />
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', mx: 0.5 }}>
            →
          </Typography>
          <FlowItem icon="🖥️" label="Display" isActive={isDisplayActive} />
        </Stack>
      </Stack>
    </Box>
  );
}
