import type { PrototypeInMemoryStats } from '@f88/promidas';
import { toLocalizedMessage } from '@f88/promidas-utils/repository';
import type { SnapshotOperationFailure } from '@f88/promidas/repository';

import { Alert, Stack } from '@mui/material';

import { useProtopediaRepository } from '../../hooks';
import { ActionButton } from '../common/action-button';
import { SectionCard } from '../common/section-card';

interface RefreshSnapshotProps {
  stats: PrototypeInMemoryStats | null;
  snapshotLoading: boolean;
  snapshotSuccess: string | null;
  snapshotError: SnapshotOperationFailure | null;
  handleRefreshSnapshot: () => void;
}

export function RefreshSnapshot({
  stats,
  snapshotLoading,
  snapshotSuccess,
  snapshotError,
  handleRefreshSnapshot,
}: RefreshSnapshotProps) {
  const localizedSnapshotError = toLocalizedMessage(snapshotError);

  const repository = useProtopediaRepository();
  const disabled = snapshotLoading || repository === null;
  // const disabled = snapshotLoading;

  console.debug('[RefreshSnapshot] stats:', stats, 'repository:', repository);

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
