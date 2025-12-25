import { useEffect } from 'react';

import type { PrototypeInMemoryStats } from '@f88/promidas';
import { getStoreState } from '@f88/promidas-utils/store';

import { Alert, Box, Chip, Stack, Typography } from '@mui/material';

import { useAllPrototypes } from '../../hooks';
import { ActionButton } from '../common/action-button';
import { PrototypeIdAndName } from '../common/prototype-id-and-name';
import { SectionCard } from '../common/section-card';

interface AllPrototypesProps {
  stats: PrototypeInMemoryStats | null;
  onUseSnapshot?: (isActive: boolean) => void;
}

export function AllPrototypes({ stats, onUseSnapshot }: AllPrototypesProps) {
  const {
    prototypes: allPrototypes,
    loading: allLoading,
    error: allError,
    fetchAll,
    clear: clearAll,
  } = useAllPrototypes();

  // Control store/repo indicator when data is retrieved
  useEffect(() => {
    if (allPrototypes && !allLoading) {
      onUseSnapshot?.(true);
    }
  }, [allPrototypes, allLoading, onUseSnapshot]);

  const disabled = allLoading || getStoreState(stats) === 'not-stored';

  return (
    <SectionCard
      title="getAllFromSnapshot"
      description="全てのPrototypeを取得"
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
          onClick={fetchAll}
          disabled={disabled}
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
        <Box
          sx={{
            mt: 2,
          }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            Total Prototypes:{' '}
            <strong>{allPrototypes.length.toLocaleString()}</strong>
            {allPrototypes.length > 20 && (
              <Typography
                component="span"
                variant="body2"
                sx={{ color: 'text.secondary', ml: 1 }}
              >
                (最初の20件)
              </Typography>
            )}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {allPrototypes.slice(0, 20).map((proto) => (
              <PrototypeIdAndName
                key={proto.id}
                id={proto.id}
                name={proto.prototypeNm}
              />
            ))}
            {allPrototypes.length > 20 && (
              <Chip
                label={`+${(allPrototypes.length - 20).toLocaleString()} more`}
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
