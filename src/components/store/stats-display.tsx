import { Typography, Stack } from '@mui/material';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import { SectionCard } from '../common/section-card';

interface StatsDisplayProps {
  stats: PrototypeInMemoryStats | null;
}

export function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <SectionCard
      title="Statistics"
      description="現在のSnapshot統計"
      category="Store"
    >
      {!stats && (
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ py: 2 }}
        >
          <b>setupSnapshot()</b> を実行してください
        </Typography>
      )}
      {stats && (
        <Stack spacing={0}>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            alignItems="baseline"
          >
            <Typography variant="caption" color="text.secondary">
              Snapshot Size:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {stats.size} prototypes
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            alignItems="baseline"
          >
            <Typography variant="caption" color="text.secondary">
              Cached At:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {stats.cachedAt
                ? new Date(stats.cachedAt).toLocaleString()
                : 'Not cached'}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            alignItems="center"
          >
            <Typography variant="caption" color="text.secondary">
              Expired:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {stats.isExpired ? 'True' : 'False'}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            alignItems="baseline"
          >
            <Typography variant="caption" color="text.secondary">
              Remaining TTL:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {stats.remainingTtlMs > 0
                ? `${(stats.remainingTtlMs / 1000).toFixed(1)} seconds`
                : 'Expired'}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            alignItems="baseline"
          >
            <Typography variant="caption" color="text.secondary">
              Data Size:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {(stats.dataSizeBytes / 1024).toFixed(2)} KB
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            alignItems="center"
          >
            <Typography variant="caption" color="text.secondary">
              Refresh In Flight:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {stats.refreshInFlight ? 'True' : 'False'}
            </Typography>
          </Stack>
        </Stack>
      )}
    </SectionCard>
  );
}
