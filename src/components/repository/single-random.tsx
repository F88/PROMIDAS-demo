import { Stack, Alert, Typography, Box } from '@mui/material';
import { useEffect } from 'react';
import { PrototypeCard } from '../common/prototype-card';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';
import { getStoreState } from '../../utils/store-state-utils';
import { useSingleRandom } from '../../hooks';

interface SingleRandomProps {
  stats: PrototypeInMemoryStats | null;
  onDisplayChange?: (isDisplaying: boolean) => void;
}

export function SingleRandom({ stats, onDisplayChange }: SingleRandomProps) {
  const {
    prototype: singleRandomPrototype,
    loading: singleRandomLoading,
    error: singleRandomError,
    fetchSingleRandom,
    clear: clearSingleRandom,
    hasExecuted: singleRandomHasExecuted,
  } = useSingleRandom();

  // Control display indicator based on data visibility
  useEffect(() => {
    if (singleRandomPrototype && !singleRandomLoading) {
      onDisplayChange?.(true);
      const timer = setTimeout(() => {
        onDisplayChange?.(false);
      }, 1000);
      return () => clearTimeout(timer);
    }

    // Hide indicator on error or when no data
    if (singleRandomError || !singleRandomPrototype) {
      onDisplayChange?.(false);
    }
  }, [
    singleRandomPrototype,
    singleRandomLoading,
    singleRandomError,
    onDisplayChange,
  ]);

  const wrappedFetchSingleRandom = () => {
    fetchSingleRandom();
  };

  const disabled = singleRandomLoading || getStoreState(stats) === 'not-stored';

  return (
    <SectionCard
      title="getRandomPrototypeFromSnapshot"
      description="ランダムに1件を取得"
      category="Query"
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
        <>
          <Box
            sx={{
              mt: 2,
            }}
          >
            <PrototypeCard prototype={singleRandomPrototype} />
          </Box>
        </>
      )}
    </SectionCard>
  );
}
