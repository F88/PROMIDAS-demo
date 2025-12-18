import { Box, Typography, Stack, Chip } from "@mui/material";
import type { PrototypeInMemoryStats } from "@f88/promidas";
import { SectionCard } from "../common/section-card";

interface StatsDisplayProps {
  stats: PrototypeInMemoryStats | null;
}

export function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <SectionCard
      title="Statistics"
      description="Current snapshot statistics"
      category="Store"
    >
      {!stats && (
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ py: 2 }}
        >
          No stats available. Please setup a snapshot first.
        </Typography>
      )}
      {stats && (
        <Stack spacing={1.5}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Snapshot Size:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {stats.size} prototypes
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Cached At:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {stats.cachedAt
                ? new Date(stats.cachedAt).toLocaleString()
                : "Not cached"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Status:
            </Typography>
            <Chip
              label={stats.isExpired ? "Expired" : "Valid"}
              color={stats.isExpired ? "error" : "success"}
              size="small"
            />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Remaining TTL:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {stats.remainingTtlMs > 0
                ? `${(stats.remainingTtlMs / 1000).toFixed(1)} seconds`
                : "Expired"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Data Size:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {(stats.dataSizeBytes / 1024).toFixed(2)} KB
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Refresh Status:
            </Typography>
            <Chip
              label={stats.refreshInFlight ? "In Progress" : "Idle"}
              color={stats.refreshInFlight ? "warning" : "default"}
              size="small"
            />
          </Box>
        </Stack>
      )}
    </SectionCard>
  );
}
