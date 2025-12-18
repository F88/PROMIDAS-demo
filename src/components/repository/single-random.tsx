import { Stack, Alert } from '@mui/material';
import { PrototypeCard } from '../prototype-card';
import type { PrototypeInMemoryStats, Prototype } from '@f88/promidas';
import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';

interface SingleRandomProps {
  singleRandomPrototype: Prototype | null;
  singleRandomLoading: boolean;
  singleRandomError: string | null;
  stats: PrototypeInMemoryStats | null;
  fetchSingleRandom: () => void;
  clearSingleRandom: () => void;
}

export function SingleRandom({
  singleRandomPrototype,
  singleRandomLoading,
  singleRandomError,
  stats,
  fetchSingleRandom,
  clearSingleRandom,
}: SingleRandomProps) {
  return (
    <SectionCard
      title="getRandomPrototypeFromSnapshot()"
      description="Optimized for single random item"
      category="Query"
    >
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <ActionButton
          onClick={fetchSingleRandom}
          disabled={singleRandomLoading || !stats || stats.size === 0}
          loading={singleRandomLoading}
        >
          実行
        </ActionButton>
        <ActionButton
          disabled={singleRandomPrototype == null}
          onClick={clearSingleRandom}
          variant="secondary"
        >
          クリア
        </ActionButton>
      </Stack>
      {singleRandomError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {singleRandomError}
        </Alert>
      )}
      {singleRandomPrototype && !singleRandomLoading && (
        <PrototypeCard prototype={singleRandomPrototype} />
      )}
    </SectionCard>
  );
}
