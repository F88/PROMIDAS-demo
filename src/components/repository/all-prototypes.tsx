import { Stack, Alert, Typography, Box, Chip } from '@mui/material';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import type { NormalizedPrototype } from '@f88/promidas/types';
import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';

interface AllPrototypesProps {
  allPrototypes: NormalizedPrototype[] | null;
  allLoading: boolean;
  allError: string | null;
  stats: PrototypeInMemoryStats | null;
  fetchAll: () => void;
  clearAll: () => void;
}

export function AllPrototypes({
  allPrototypes,
  allLoading,
  allError,
  stats,
  fetchAll,
  clearAll,
}: AllPrototypesProps) {
  return (
    <SectionCard
      title="getAllFromSnapshot()"
      description="Retrieve all prototypes from snapshot"
      category="Query"
    >
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <ActionButton
          onClick={fetchAll}
          disabled={allLoading || !stats || stats.size === 0}
          loading={allLoading}
        >
          実行
        </ActionButton>
        <ActionButton
          disabled={allPrototypes == null}
          onClick={clearAll}
          variant="secondary"
        >
          クリア
        </ActionButton>
      </Stack>
      {allError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {allError}
        </Alert>
      )}
      {allPrototypes && !allLoading && (
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Total Prototypes: <strong>{allPrototypes.length}</strong>
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {allPrototypes.slice(0, 20).map((proto) => (
              <Chip
                key={proto.id}
                label={`${proto.id}: ${proto.prototypeNm}`}
                size="small"
                variant="outlined"
              />
            ))}
            {allPrototypes.length > 20 && (
              <Chip
                label={`+${allPrototypes.length - 20} more`}
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
