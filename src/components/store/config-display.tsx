import {
  Typography,
  Alert,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { SectionCard } from '../common/section-card';
import type { StoreConfig } from '../../hooks/use-config';
import { formatTime } from '../../utils/time-utils';

interface ConfigDisplayProps {
  repoConfig: StoreConfig | null;
  configLoading: boolean;
  configError: string | null;
}

export function ConfigDisplay({
  repoConfig,
  configLoading,
  configError,
}: ConfigDisplayProps) {
  const description = repoConfig
    ? `現在のStore設定 (${formatTime(repoConfig.fetchedAt)})`
    : '現在のStore設定';

  return (
    <SectionCard
      title="Configuration"
      description={description}
      category="Store"
    >
      {configError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {configError}
        </Alert>
      )}
      {!repoConfig && !configLoading && !configError && (
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ py: 2 }}
        >
          NO DATA
        </Typography>
      )}
      {repoConfig && !configLoading && (
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                sx={{ color: 'text.secondary', fontWeight: 400 }}
              >
                TTL (Time To Live)
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>
                {(repoConfig.ttlMs / 1000).toFixed(0)} seconds
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                sx={{ color: 'text.secondary', fontWeight: 400 }}
              >
                Max Data Size
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>
                {(repoConfig.maxDataSizeBytes / 1024 / 1024).toFixed(2)} MB
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                sx={{ color: 'text.secondary', fontWeight: 400 }}
              >
                Log Level
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>
                {repoConfig.logLevel || 'info'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </SectionCard>
  );
}
