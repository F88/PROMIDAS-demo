import { Stack } from '@mui/material';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';

interface RefreshSnapshotProps {
  snapshotLoading: boolean;
  stats: PrototypeInMemoryStats | null;
  handleRefreshSnapshot: () => void;
}

export function RefreshSnapshot({
  snapshotLoading,
  stats,
  handleRefreshSnapshot,
}: RefreshSnapshotProps) {
  return (
    <SectionCard
      title="refreshSnapshot()"
      description="Update snapshot with latest data"
      category="Snapshot"
    >
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <ActionButton
          onClick={handleRefreshSnapshot}
          disabled={snapshotLoading || !stats || stats.size === 0}
          loading={snapshotLoading}
        >
          実行
        </ActionButton>
      </Stack>
    </SectionCard>
  );
}
