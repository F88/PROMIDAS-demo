import { Stack, Alert, Typography } from '@mui/material';
import { PrototypeCard } from '../common/prototype-card';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';
import { getStoreState } from '../../utils/store-state-utils';
import { useSingleRandom } from '../../hooks';

type FlowPattern =
  | 'get-store-info'
  | 'get-from-snapshot'
  | 'fetch-individual'
  | 'forced-fetch'
  | 'simple-display';

interface SingleRandomProps {
  stats: PrototypeInMemoryStats | null;
  visualizeFlow: (
    operation: () => Promise<void> | void,
    pattern: FlowPattern,
  ) => Promise<void>;
}

export function SingleRandom({ stats, visualizeFlow }: SingleRandomProps) {
  const {
    prototype: singleRandomPrototype,
    loading: singleRandomLoading,
    error: singleRandomError,
    fetchSingleRandom,
    clear: clearSingleRandom,
    hasExecuted: singleRandomHasExecuted,
  } = useSingleRandom();

  const wrappedFetchSingleRandom = () => {
    visualizeFlow(() => {
      fetchSingleRandom();
    }, 'get-from-snapshot');
  };

  const disabled = singleRandomLoading || getStoreState(stats) === 'not-stored';

  return (
    <SectionCard
      title="getRandomPrototypeFromSnapshot()"
      description="ランダムに1件を取得"
      category="Query"
    >
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <ActionButton
          onClick={wrappedFetchSingleRandom}
          disabled={disabled}
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
      {singleRandomHasExecuted &&
        !singleRandomPrototype &&
        !singleRandomLoading &&
        !singleRandomError && (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ py: 2 }}
          >
            No results found
          </Typography>
        )}
      {singleRandomPrototype && !singleRandomLoading && (
        <PrototypeCard prototype={singleRandomPrototype} />
      )}
    </SectionCard>
  );
}
