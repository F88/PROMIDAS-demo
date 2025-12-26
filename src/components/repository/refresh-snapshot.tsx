import { Stack, Alert } from '@mui/material';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import type { SnapshotOperationFailure } from '@f88/promidas/repository';
import { getStoreState } from '@f88/promidas-utils/store';
import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';
import { localizeSnapshotOperationError } from '../../utils/snapshot-error-utils';

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
  const localizedSnapshotError = localizeSnapshotOperationError(snapshotError);

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
