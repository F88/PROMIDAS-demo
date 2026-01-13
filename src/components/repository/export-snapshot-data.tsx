import { Alert, Typography } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import { ActionButton } from '../common/action-button';
import { SectionCard } from '../common/section-card';

interface ExportSnapshotDataProps {
  stats: PrototypeInMemoryStats | null;
  exportSuccess: string | null;
  handleExportSnapshot: () => void;
}

export function ExportSnapshotData({
  stats,
  exportSuccess,
  handleExportSnapshot,
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
        Save current snapshot to JSON file.
      </Typography>

      <ActionButton
        onClick={handleExportSnapshot}
        disabled={!hasData}
        startIcon={<CloudDownloadIcon />}
        variant="secondary"
      >
        Export
      </ActionButton>

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
