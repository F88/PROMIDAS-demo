import { Stack, Alert } from '@mui/material';
import { PrototypeCard } from '../PrototypeCard';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';

interface RandomPrototypeProps {
  randomPrototype: any;
  randomLoading: boolean;
  randomError: string | null;
  stats: PrototypeInMemoryStats | null;
  handleFetchRandom: () => void;
  clearRandom: () => void;
}

export function RandomPrototype({
  randomPrototype,
  randomLoading,
  randomError,
  stats,
  handleFetchRandom,
  clearRandom,
}: RandomPrototypeProps) {
  return (
    <SectionCard
      title="getRandomSampleFromSnapshot()"
      description="Get multiple random prototypes from snapshot"
      category="Query"
    >
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <ActionButton
          onClick={handleFetchRandom}
          disabled={randomLoading || !stats || stats.size === 0}
          loading={randomLoading}
        >
          実行
        </ActionButton>
        <ActionButton
          disabled={randomPrototype == null}
          onClick={clearRandom}
          variant="secondary"
        >
          クリア
        </ActionButton>
      </Stack>
      {randomError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {randomError}
        </Alert>
      )}
      {randomPrototype && !randomLoading && (
        <PrototypeCard prototype={randomPrototype} />
      )}
    </SectionCard>
  );
}
