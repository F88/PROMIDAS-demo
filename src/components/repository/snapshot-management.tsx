import { Stack, TextField, Grid, Alert } from '@mui/material';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import { SNAPSHOT_LIMITS } from '../../App';
import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';

interface SnapshotManagementProps {
  snapshotLimit: string;
  setSnapshotLimit: (value: string) => void;
  snapshotOffset: string;
  setSnapshotOffset: (value: string) => void;
  snapshotUserNm: string;
  setSnapshotUserNm: (value: string) => void;
  snapshotTagNm: string;
  setSnapshotTagNm: (value: string) => void;
  snapshotEventNm: string;
  setSnapshotEventNm: (value: string) => void;
  snapshotMaterialNm: string;
  setSnapshotMaterialNm: (value: string) => void;
  snapshotLoading: boolean;
  snapshotSuccess: string | null;
  snapshotError: string | null;
  stats: PrototypeInMemoryStats | null;
  handleSetupSnapshot: () => void;
  handleRefreshSnapshot: () => void;
}

export function SnapshotManagement({
  snapshotLimit,
  setSnapshotLimit,
  snapshotOffset,
  setSnapshotOffset,
  snapshotUserNm,
  setSnapshotUserNm,
  snapshotTagNm,
  setSnapshotTagNm,
  snapshotEventNm,
  setSnapshotEventNm,
  snapshotMaterialNm,
  setSnapshotMaterialNm,
  snapshotLoading,
  snapshotSuccess,
  snapshotError,
  stats,
  handleSetupSnapshot,
  handleRefreshSnapshot,
}: SnapshotManagementProps) {
  return (
    <SectionCard title="setupSnapshot() / refreshSnapshot()">
      <Grid
        container
        spacing={2}
        // sx={{ mb: 2 }}
      >
        <Grid size={{ xs: 6, sm: 2 }}>
          <TextField
            label="Limit"
            type="number"
            value={snapshotLimit}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              setSnapshotLimit(
                value > SNAPSHOT_LIMITS.MAX_LIMIT
                  ? SNAPSHOT_LIMITS.MAX_LIMIT.toString()
                  : e.target.value,
              );
            }}
            fullWidth
            size="small"
            slotProps={{
              htmlInput: {
                min: SNAPSHOT_LIMITS.MIN_LIMIT,
                max: SNAPSHOT_LIMITS.MAX_LIMIT,
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 2 }}>
          <TextField
            label="Offset"
            type="number"
            value={snapshotOffset}
            onChange={(e) => setSnapshotOffset(e.target.value)}
            fullWidth
            size="small"
            slotProps={{ htmlInput: { min: 0 } }}
          />
        </Grid>
      </Grid>
      <Grid
        container
        //
        spacing={2}
        // sx={{ mb: 2 }}
      >
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            label="User Name"
            type="text"
            value={snapshotUserNm}
            onChange={(e) => setSnapshotUserNm(e.target.value)}
            placeholder="Filter by user"
            fullWidth
            size="small"
            slotProps={{ htmlInput: { maxLength: 20 } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            label="Tag Name"
            type="text"
            value={snapshotTagNm}
            onChange={(e) => setSnapshotTagNm(e.target.value)}
            placeholder="Filter by tag"
            fullWidth
            size="small"
            slotProps={{ htmlInput: { maxLength: 20 } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            label="Event Name"
            type="text"
            value={snapshotEventNm}
            onChange={(e) => setSnapshotEventNm(e.target.value)}
            placeholder="Filter by event"
            fullWidth
            size="small"
            slotProps={{ htmlInput: { maxLength: 20 } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            label="Material Name"
            type="text"
            value={snapshotMaterialNm}
            onChange={(e) => setSnapshotMaterialNm(e.target.value)}
            placeholder="Filter by material"
            fullWidth
            size="small"
            slotProps={{ htmlInput: { maxLength: 20 } }}
          />
        </Grid>
      </Grid>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <ActionButton
          onClick={handleSetupSnapshot}
          disabled={snapshotLoading}
          loading={snapshotLoading}
        >
          実行
        </ActionButton>
        <ActionButton
          onClick={handleRefreshSnapshot}
          disabled={snapshotLoading || !stats || stats.size === 0}
          loading={snapshotLoading}
          variant="secondary"
        >
          更新
        </ActionButton>
      </Stack>
      {snapshotSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {snapshotSuccess}
        </Alert>
      )}
      {snapshotError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {snapshotError}
        </Alert>
      )}
    </SectionCard>
  );
}
