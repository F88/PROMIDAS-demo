import {
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { useEffect } from 'react';
import { SectionCard } from '../common/section-card';
import type { RepositoryStats } from '../../hooks/use-repository-stats';
import { formatTime } from '../../utils/time-utils';

interface StatsDisplayProps {
  stats: RepositoryStats | null;
  onGetStoreInfo?: (isActive: boolean) => void;
}

export function StatsDisplay({ stats, onGetStoreInfo }: StatsDisplayProps) {
  // Control store/repo indicator when data is displayed
  useEffect(() => {
    const fetchedAt = stats?.fetchedAt;
    if (fetchedAt == null) {
      return;
    }

    onGetStoreInfo?.(true);
  }, [stats?.fetchedAt, onGetStoreInfo]);

  const description = stats
    ? `現在のSnapshot統計 (${formatTime(stats.fetchedAt)})`
    : '現在のSnapshot統計';

  return (
    <SectionCard title="Statistics" description={description} category="Store">
      {!stats && (
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ py: 2 }}
        >
          NO DATA
        </Typography>
      )}
      {stats && (
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                sx={{ color: 'text.secondary', fontWeight: 400 }}
              >
                Snapshot Size
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>
                {stats.size.toLocaleString()} prototypes
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                sx={{ color: 'text.secondary', fontWeight: 400 }}
              >
                Cached At
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>
                {stats.cachedAt
                  ? new Date(stats.cachedAt).toLocaleString()
                  : 'Not cached'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                sx={{ color: 'text.secondary', fontWeight: 400 }}
              >
                Expired
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>
                {stats.isExpired ? 'True' : 'False'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                sx={{ color: 'text.secondary', fontWeight: 400 }}
              >
                Remaining TTL
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>
                {stats.remainingTtlMs > 0
                  ? `${(stats.remainingTtlMs / 1000).toFixed(1)} seconds`
                  : 'Expired'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                sx={{ color: 'text.secondary', fontWeight: 400 }}
              >
                Data Size
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>
                {(stats.dataSizeBytes / 1024 / 1024).toFixed(2)} MB
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                sx={{ color: 'text.secondary', fontWeight: 400 }}
              >
                Refresh In Flight
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>
                {stats.refreshInFlight ? 'True' : 'False'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </SectionCard>
  );
}
