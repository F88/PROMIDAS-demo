import type { PrototypeInMemoryStats } from '@f88/promidas';
import { toLocalizedMessage } from '@f88/promidas-utils/repository';
import { getStoreState } from '@f88/promidas-utils/store';
import type { SnapshotOperationFailure } from '@f88/promidas/repository';

import { Alert, Stack } from '@mui/material';

import { ActionButton } from '../common/action-button';
import { SectionCard } from '../common/section-card';

interface RefreshSnapshotProps {
  snapshotLoading: boolean;
  snapshotSuccess: string | null;
  snapshotError: SnapshotOperationFailure | null;
  stats: PrototypeInMemoryStats | null;
  handleRefreshSnapshot: () => void;
}

export function RefreshSnapshot({
  snapshotLoading,
  snapshotSuccess,
  snapshotError,
  stats,
  handleRefreshSnapshot,
}: RefreshSnapshotProps) {
  const localizedSnapshotError = toLocalizedMessage(snapshotError);

  const disabled = snapshotLoading || getStoreState(stats) === 'not-stored';

  return (
    <SectionCard
      title="refreshSnapshot"
      description="Snapshotを更新"
      category="Snapshot"
    >
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
          onClick={handleRefreshSnapshot}
          disabled={disabled}
          loading={snapshotLoading}
        >
          実行
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
