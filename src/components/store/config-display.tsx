import { Typography, Stack, Alert } from '@mui/material';
import { SectionCard } from '../common/section-card';
import type { StoreConfig } from '../../hooks/use-config';

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
  return (
    <SectionCard
      title="Configuration"
      description="現在のStore設定"
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
          <b>getConfig()</b> を実行してください
        </Typography>
      )}
      {repoConfig && !configLoading && (
        <Stack spacing={0}>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            alignItems="baseline"
          >
            <Typography variant="caption" color="text.secondary">
              TTL (Time To Live):
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {(repoConfig.ttlMs / 1000).toFixed(0)} seconds (
              {(repoConfig.ttlMs / 1000 / 60).toFixed(1)} minutes)
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            alignItems="baseline"
          >
            <Typography variant="caption" color="text.secondary">
              Max Data Size:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {(repoConfig.maxDataSizeBytes / 1024 / 1024).toFixed(2)} MB (
              {repoConfig.maxDataSizeBytes.toLocaleString()} bytes)
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            alignItems="baseline"
          >
            <Typography variant="caption" color="text.secondary">
              Log Level:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {repoConfig.logLevel || 'info'}
            </Typography>
          </Stack>
        </Stack>
      )}
    </SectionCard>
  );
}
