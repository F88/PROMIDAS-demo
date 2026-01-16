import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Alert, Stack, Typography } from '@mui/material';

import { ActionButton } from '../common/action-button';
import { SectionCard } from '../common/section-card';

import type { PrototypeInMemoryStats } from 'promidas';

interface ExportSnapshotDataProps {
  stats: PrototypeInMemoryStats | null;
  exportSuccess: string | null;
  handleExportSnapshotToJson: () => void;
  handleExportSnapshotToTsv: () => void;
}

export function ExportSnapshotData({
  stats,
  exportSuccess,
  handleExportSnapshotToJson,
  handleExportSnapshotToTsv,
}: ExportSnapshotDataProps) {
  const hasData = stats && stats.size > 0;

  return (
    <SectionCard title="Export Snapshot">
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 2,
        }}
      >
        現在のスナップショットを保存
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        sx={
          {
            // mb: 2,
          }
        }
      >
        <ActionButton
          variant="secondary"
          onClick={handleExportSnapshotToJson}
          disabled={!hasData}
          startIcon={<CloudDownloadIcon />}
        >
          JSON
        </ActionButton>

        <ActionButton
          variant="secondary"
          onClick={handleExportSnapshotToTsv}
          disabled={!hasData}
          startIcon={<CloudDownloadIcon />}
        >
          TSV
        </ActionButton>
      </Stack>

      {exportSuccess && (
        <Alert
          severity="success"
          sx={{
            mt: 2,
          }}
        >
          {exportSuccess}
        </Alert>
      )}
    </SectionCard>
  );
}
