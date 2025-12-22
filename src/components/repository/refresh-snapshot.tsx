import { Stack, Alert } from '@mui/material';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';
import { localizeSnapshotOperationError } from '../../utils/snapshot-error-utils';

interface RefreshSnapshotProps {
  snapshotLoading: boolean;
  snapshotSuccess: string | null;
  snapshotError: string | null;
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

  return (
    <SectionCard
      title="refreshSnapshot()"
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
          disabled={snapshotLoading || !stats || stats.size === 0}
          loading={snapshotLoading}
        >
          実行
        </ActionButton>
      </Stack>
      {snapshotSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {snapshotSuccess}
        </Alert>
      )}
      {snapshotError && (
        <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {localizedSnapshotError}
        </Alert>
      )}
    </SectionCard>
  );
}
