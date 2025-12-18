import { Stack, Alert, TextField, Box, Typography, Chip } from '@mui/material';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';
import { PrototypeIdAndName } from '../common/prototype-id-and-name';
import { getStoreState } from '../../utils/store-state-utils';
import { useState } from 'react';
import { useRandomPrototype } from '../../hooks';

type FlowPattern =
  | 'get-store-info'
  | 'get-from-snapshot'
  | 'fetch-individual'
  | 'forced-fetch'
  | 'simple-display';

interface RandomPrototypeProps {
  stats: PrototypeInMemoryStats | null;
  visualizeFlow: (
    operation: () => Promise<void> | void,
    pattern: FlowPattern,
  ) => Promise<void>;
}

export function RandomPrototype({
  stats,
  visualizeFlow,
}: RandomPrototypeProps) {
  const [randomSampleSize, setRandomSampleSize] = useState('3');

  const {
    prototypes: randomPrototypes,
    loading: randomLoading,
    error: randomError,
    fetchRandom,
    clear: clearRandom,
    hasExecuted: randomHasExecuted,
  } = useRandomPrototype();

  const handleFetchRandom = () => {
    const size = parseInt(randomSampleSize) || 0;
    visualizeFlow(() => {
      fetchRandom(size);
    }, 'get-from-snapshot');
  };

  const disabled = randomLoading || getStoreState(stats) === 'not-stored';

  return (
    <SectionCard
      title="getRandomSampleFromSnapshot(size)"
      description="Get random samples from snapshot without duplicates"
      category="Query"
    >
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          disabled={disabled}
          label="Sample Size"
          type="number"
          value={randomSampleSize}
          onChange={(e) => {
            setRandomSampleSize(e.target.value);
          }}
          fullWidth
          size="small"
          slotProps={{ htmlInput: { min: 0, max: 99_999 } }}
          sx={{ maxWidth: 200 }}
        />
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <ActionButton
          onClick={handleFetchRandom}
          disabled={disabled}
          loading={randomLoading}
        >
          実行
        </ActionButton>
        <ActionButton
          disabled={disabled || randomPrototypes.length === 0}
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

      {randomHasExecuted &&
        randomPrototypes.length === 0 &&
        !randomLoading &&
        !randomError && (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ py: 2 }}
          >
            No results found
          </Typography>
        )}

      {randomPrototypes.length > 0 && !randomLoading && (
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Total Prototypes: <strong>{randomPrototypes.length}</strong>
            {randomPrototypes.length > 20 && (
              <Typography
                component="span"
                variant="body2"
                sx={{ color: 'text.secondary', ml: 1 }}
              >
                (Showing first 20)
              </Typography>
            )}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {randomPrototypes.slice(0, 20).map((prototype, index) => (
              <PrototypeIdAndName
                key={`${prototype.id}-${index}`}
                id={prototype.id}
                name={prototype.prototypeNm}
              />
            ))}
            {randomPrototypes.length > 20 && (
              <Chip
                label={`+${randomPrototypes.length - 20} more`}
                size="small"
                color="primary"
              />
            )}
          </Box>
        </Box>
      )}
    </SectionCard>
  );
}
