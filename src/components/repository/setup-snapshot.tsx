import { Stack, TextField, Grid, Alert } from '@mui/material';
import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';

interface SetupSnapshotProps {
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
  handleSetupSnapshot: () => void;
  handleResetSnapshotForm: () => void;
}

export function SetupSnapshot({
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
  handleSetupSnapshot,
  handleResetSnapshotForm,
}: SetupSnapshotProps) {
  return (
    <SectionCard
      title="setupSnapshot()"
      description="Initialize snapshot with filtering options"
      category="Snapshot"
    >
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6, sm: 4 }}>
          <TextField
            label="Limit"
            type="number"
            value={snapshotLimit}
            onChange={(e) => setSnapshotLimit(e.target.value)}
            fullWidth
            size="small"
            slotProps={{ htmlInput: { min: 1, max: 100 } }}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
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
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="User Name"
            type="text"
            value={snapshotUserNm}
            onChange={(e) => setSnapshotUserNm(e.target.value)}
            placeholder="Filter by user"
            fullWidth
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Tag Name"
            type="text"
            value={snapshotTagNm}
            onChange={(e) => setSnapshotTagNm(e.target.value)}
            placeholder="Filter by tag"
            fullWidth
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Event Name"
            type="text"
            value={snapshotEventNm}
            onChange={(e) => setSnapshotEventNm(e.target.value)}
            placeholder="Filter by event"
            fullWidth
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Material Name"
            type="text"
            value={snapshotMaterialNm}
            onChange={(e) => setSnapshotMaterialNm(e.target.value)}
            placeholder="Filter by material"
            fullWidth
            size="small"
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
          onClick={handleResetSnapshotForm}
          variant="secondary"
          disabled={snapshotLoading}
        >
          リセット
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
