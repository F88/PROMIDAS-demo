import { useEffect } from 'react';

import type { PrototypeInMemoryStats } from '@f88/promidas';
import { getStoreState } from '@f88/promidas-utils/store';

import { Alert, Box, Stack, Typography } from '@mui/material';

import { useSingleRandom } from '../../hooks';

import { ActionButton } from '../common/action-button';
import { PrototypeCard } from '../common/prototype-card';
import { SectionCard } from '../common/section-card';

interface SingleRandomProps {
  stats: PrototypeInMemoryStats | null;
  onUseSnapshot?: (isActive: boolean) => void;
}

export function SingleRandom({ stats, onUseSnapshot }: SingleRandomProps) {
  const {
    prototype: singleRandomPrototype,
    loading: singleRandomLoading,
    error: singleRandomError,
    fetchSingleRandom,
    clear: clearSingleRandom,
    hasExecuted: singleRandomHasExecuted,
  } = useSingleRandom();

  // Clear results and errors when repository is destroyed
  useEffect(() => {
    if (getStoreState(stats) === 'not-stored') {
      clearSingleRandom();
    }
  }, [stats, clearSingleRandom]);

  // Control store/repo indicator when data is retrieved
  useEffect(() => {
    if (singleRandomPrototype && !singleRandomLoading) {
      onUseSnapshot?.(true);
    }
  }, [singleRandomPrototype, singleRandomLoading, onUseSnapshot]);

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
