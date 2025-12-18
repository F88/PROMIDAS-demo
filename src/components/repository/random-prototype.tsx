import { Stack, Alert, TextField, Box, Typography, Chip } from '@mui/material';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import type { NormalizedPrototype } from '@f88/promidas/types';
import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';
import { PrototypeIdAndName } from '../common/prototype-id-and-name';

interface RandomPrototypeProps {
  randomPrototypes: NormalizedPrototype[];
  randomLoading: boolean;
  randomError: string | null;
  randomSampleSize: string;
  setRandomSampleSize: (value: string) => void;
  stats: PrototypeInMemoryStats | null;
  handleFetchRandom: () => void;
  clearRandom: () => void;
}

export function RandomPrototype({
  randomPrototypes,
  randomLoading,
  randomError,
  randomSampleSize,
  setRandomSampleSize,
  stats,
  handleFetchRandom,
  clearRandom,
}: RandomPrototypeProps) {
  return (
    <SectionCard
      title="getRandomSampleFromSnapshot(size)"
      description="Get random samples from snapshot without duplicates"
      category="Query"
    >
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          label="Sample Size"
          type="number"
          value={randomSampleSize}
          onChange={(e) => {
            setRandomSampleSize(e.target.value);
          }}
          fullWidth
          size="small"
          slotProps={{ htmlInput: { min: 1, max: 10 } }}
          sx={{ maxWidth: 200 }}
        />
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <ActionButton
          onClick={handleFetchRandom}
          disabled={randomLoading || !stats || stats.size === 0}
          loading={randomLoading}
        >
          実行
        </ActionButton>
        <ActionButton
          disabled={randomPrototypes.length === 0}
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
