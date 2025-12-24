import { Stack, TextField, Grid, Alert, Collapse } from '@mui/material';
import { useState } from 'react';
import type { SnapshotOperationFailure } from '@f88/promidas/repository';
import { SETUP_SNAPSHOT } from '../../App';
import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';
import { clampNumericInput } from '../../utils/number-utils';
import { localizeSnapshotOperationError } from '../../utils/snapshot-error-utils';

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
  snapshotError: SnapshotOperationFailure | null;
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
  const [areFiltersExpanded, setAreFiltersExpanded] = useState(false);
  const localizedSnapshotError = localizeSnapshotOperationError(snapshotError);

  return (
    <SectionCard
      title="setupSnapshot"
      description="Snapshotを初期化"
      category="Snapshot"
    >
      <Grid
        container
        spacing={2}
        sx={{
          mb: 2,
        }}
      >
        <Grid
          size={{
            xs: 6,
          }}
        >
          <TextField
            label="Limit"
            type="number"
            value={snapshotLimit}
            onChange={(e) => {
              setSnapshotLimit(
                clampNumericInput(
                  e.target.value,
                  SETUP_SNAPSHOT.LIMIT.MIN,
                  SETUP_SNAPSHOT.LIMIT.MAX,
                ),
              );
            }}
            // fullWidth
            size="small"
            slotProps={{
              htmlInput: {
                min: SETUP_SNAPSHOT.LIMIT.MIN,
                max: SETUP_SNAPSHOT.LIMIT.MAX,
              },
            }}
            sx={{ maxWidth: 200 }}
          />
        </Grid>
        <Grid
          size={{
            xs: 6,
            // sm: 3
          }}
        >
          <TextField
            label="Offset"
            type="number"
            value={snapshotOffset}
            onChange={(e) => {
              setSnapshotOffset(
                clampNumericInput(
                  e.target.value,
                  SETUP_SNAPSHOT.OFFSET.MIN,
                  SETUP_SNAPSHOT.LIMIT.MAX,
                ),
              );
            }}
            // fullWidth
            size="small"
            slotProps={{
              htmlInput: {
                min: SETUP_SNAPSHOT.OFFSET.MIN,
                max: SETUP_SNAPSHOT.LIMIT.MAX,
              },
            }}
            sx={{ maxWidth: 200 }}
          />
        </Grid>
      </Grid>

      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
        <ActionButton
          onClick={() => setAreFiltersExpanded((prev) => !prev)}
          variant="secondary"
          disabled={snapshotLoading}
        >
          {areFiltersExpanded ? 'フィルタを隠す' : 'フィルタを表示'}
        </ActionButton>
      </Stack>

      <Collapse in={areFiltersExpanded}>
        <Grid
          container
          spacing={2}
          sx={{
            mb: 2,
          }}
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
      </Collapse>

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
        <Alert
          severity="success"
          sx={{
            mt: 2,
          }}
        >
          {snapshotSuccess}
        </Alert>
      )}
      {snapshotError && (
        <Alert
          severity="error"
          sx={{
            mt: 2,
            whiteSpace: 'pre-line',
          }}
        >
          {localizedSnapshotError}
        </Alert>
      )}
    </SectionCard>
  );
}
