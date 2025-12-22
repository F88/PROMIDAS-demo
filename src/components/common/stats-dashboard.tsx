import { Box, Typography, Chip, Stack, LinearProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StorageIcon from '@mui/icons-material/Storage';
import TimerIcon from '@mui/icons-material/Timer';
import MemoryIcon from '@mui/icons-material/Memory';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import type { StoreConfig } from '../../hooks/use-config';
import { getStoreState, type StoreState } from '../../utils/store-state-utils';

interface StatsDashboardProps {
  stats: PrototypeInMemoryStats | null;
  config: StoreConfig | null;
}

interface StyledChipProps {
  label: string;
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
  fontWeight?: number;
}

function StyledChip({ label, color = 'default', fontWeight }: StyledChipProps) {
  return (
    <Chip
      label={label}
      color={color}
      size="small"
      sx={(theme) => ({
        fontWeight,
        transition: theme.transitions.create(
          ['background-color', 'color', 'border-color'],
          {
            duration: theme.transitions.duration.shorter,
            easing: theme.transitions.easing.easeInOut,
          },
        ),
        height: 24,
        fontSize: '0.75rem',
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
        },
        '& .MuiChip-label': {
          px: 1,
          py: 0,
        },
      })}
    />
  );
}

interface StatsChipProps {
  state: StoreState;
}

function StateChip({ state }: StatsChipProps) {
  if (state === 'not-stored') {
    return <StyledChip label="Not Stored" color="default" fontWeight={600} />;
  }

  return (
    <StyledChip
      label={state === 'expired' ? 'Expired' : 'Stored'}
      color={state === 'expired' ? 'error' : 'success'}
    />
  );
}

interface ContainerBoxProps {
  children: React.ReactNode;
  gap?: number;
}

function ContainerBox({ children, gap = 2 }: ContainerBoxProps) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap,
        p: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
      }}
    >
      {children}
    </Box>
  );
}

interface StoredStatsContentProps {
  storeState: StoreState;
  stats: PrototypeInMemoryStats;
  config: StoreConfig | null;
}

interface StatItemProps {
  label: string;
  value: string | number;
  progressPercent?: number;
  progressColor?: 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
  iconColor?: string;
}

function getTtlProgressColor(
  remainingPercent: number,
): 'success' | 'warning' | 'error' {
  if (remainingPercent >= 50) return 'success';
  if (remainingPercent >= 20) return 'warning';
  return 'error';
}

function getMemoryProgressColor(
  usagePercent: number,
): 'success' | 'warning' | 'error' {
  if (usagePercent <= 50) return 'success';
  if (usagePercent <= 80) return 'warning';
  return 'error';
}

function StatItem({
  label,
  value,
  progressPercent,
  progressColor,
  icon,
  iconColor,
}: StatItemProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: progressPercent !== undefined ? 0.5 : 0,
        }}
      >
        {icon && (
          <Box
            sx={(theme) => ({
              mr: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: iconColor || 'text.secondary',
              transition: theme.transitions.create('color', {
                duration: theme.transitions.duration.shorter,
                easing: theme.transitions.easing.easeInOut,
              }),
              '@media (prefers-reduced-motion: reduce)': {
                transition: 'none',
              },
            })}
          >
            {icon}
          </Box>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
          {label}:
        </Typography>
        <Typography
          variant="body2"
          component="span"
          fontWeight={600}
          color="text.primary"
          sx={(theme) => ({
            transition: theme.transitions.create('color', {
              duration: theme.transitions.duration.shorter,
              easing: theme.transitions.easing.easeInOut,
            }),
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
            },
          })}
        >
          {value}
        </Typography>
      </Box>
      {progressPercent !== undefined && progressColor && (
        <LinearProgress
          variant="determinate"
          value={progressPercent}
          color={progressColor}
          sx={(theme) => ({
            height: 4,
            borderRadius: 2,
            '& .MuiLinearProgress-bar': {
              transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.standard,
                easing: theme.transitions.easing.easeOut,
              }),
            },
            '@media (prefers-reduced-motion: reduce)': {
              '& .MuiLinearProgress-bar': {
                transition: 'none',
              },
            },
          })}
        />
      )}
    </Box>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
}

function StoredStatsContent({
  storeState,
  stats,
  config,
}: StoredStatsContentProps) {
  const ttlDisplay = config
    ? (() => {
        const remainingSec = (stats.remainingTtlMs / 1000).toFixed(1);
        const totalSec = (config.ttlMs / 1000).toFixed(1);
        return stats.remainingTtlMs > 0
          ? `${remainingSec}s / ${totalSec}s`
          : `Expired (${totalSec}s)`;
      })()
    : stats.remainingTtlMs > 0
      ? `${(stats.remainingTtlMs / 1000).toFixed(1)}s`
      : 'Expired';

  const ttlRemainingPercent = config
    ? (stats.remainingTtlMs / config.ttlMs) * 100
    : undefined;

  const ttlProgressColor =
    ttlRemainingPercent !== undefined
      ? getTtlProgressColor(ttlRemainingPercent)
      : undefined;

  const memoryDisplay = config
    ? (() => {
        const used = formatBytes(stats.dataSizeBytes);
        const max = formatBytes(config.maxDataSizeBytes);
        const percent = (
          (stats.dataSizeBytes / config.maxDataSizeBytes) *
          100
        ).toFixed(1);
        return `${used} / ${max} (${percent}%)`;
      })()
    : 'N/A';

  const memoryUsagePercent = config
    ? (stats.dataSizeBytes / config.maxDataSizeBytes) * 100
    : undefined;

  const memoryProgressColor =
    memoryUsagePercent !== undefined
      ? getMemoryProgressColor(memoryUsagePercent)
      : undefined;

  const cachedAtDisplay =
    stats.cachedAt !== null
      ? new Date(stats.cachedAt).toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      : 'N/A';

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        animation: `fadeIn ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeOut}`,
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
        },
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(-5px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      })}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <StateChip state={storeState} />
          {stats.refreshInFlight && (
            <StyledChip label="Refreshing" color="warning" />
          )}
        </Stack>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <StatItem
            label="Cached"
            value={cachedAtDisplay}
            icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
            iconColor="info.main"
          />
          <StatItem
            label="Size"
            value={stats.size.toLocaleString()}
            icon={<StorageIcon sx={{ fontSize: 16 }} />}
            iconColor="primary.main"
          />
        </Stack>
      </Box>
      <StatItem
        label="TTL"
        value={ttlDisplay}
        progressPercent={ttlRemainingPercent}
        progressColor={ttlProgressColor}
        icon={<TimerIcon sx={{ fontSize: 16 }} />}
        iconColor={
          ttlProgressColor ? `${ttlProgressColor}.main` : 'text.secondary'
        }
      />
      {config && (
        <StatItem
          label="Mem"
          value={memoryDisplay}
          progressPercent={memoryUsagePercent}
          progressColor={memoryProgressColor}
          icon={<MemoryIcon sx={{ fontSize: 16 }} />}
          iconColor={
            memoryProgressColor
              ? `${memoryProgressColor}.main`
              : 'text.secondary'
          }
        />
      )}
    </Box>
  );
}

export function StatsDashboard({ stats, config }: StatsDashboardProps) {
  const storeState = getStoreState(stats);

  return (
    <ContainerBox gap={storeState === 'not-stored' ? 1 : 2}>
      {storeState === 'not-stored' ? (
        <>
          <StateChip state={storeState} />
          <Typography variant="caption" color="text.secondary">
            No data in store
          </Typography>
        </>
      ) : (
        <StoredStatsContent
          storeState={storeState}
          stats={stats!}
          config={config}
        />
      )}
    </ContainerBox>
  );
}
