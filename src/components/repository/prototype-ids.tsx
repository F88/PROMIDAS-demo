import { Stack, Alert, Typography, Box, Chip } from '@mui/material';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';
import { PrototypeIdAndName } from '../common/prototype-id-and-name';
import { getStoreState } from '../../utils/store-state-utils';
import { usePrototypeIds } from '../../hooks';

type FlowPattern =
  | 'get-store-info'
  | 'get-from-snapshot'
  | 'fetch-individual'
  | 'forced-fetch'
  | 'simple-display';

interface PrototypeIdsProps {
  stats: PrototypeInMemoryStats | null;
  visualizeFlow: (
    operation: () => Promise<void> | void,
    pattern: FlowPattern,
  ) => Promise<void>;
}

export function PrototypeIds({ stats, visualizeFlow }: PrototypeIdsProps) {
  const {
    ids: prototypeIds,
    loading: idsLoading,
    error: idsError,
    fetchIds,
    clear: clearIds,
  } = usePrototypeIds();

  const wrappedFetchIds = () => {
    visualizeFlow(() => {
      fetchIds();
    }, 'get-from-snapshot');
  };

  const disabled = idsLoading || getStoreState(stats) === 'not-stored';

  return (
    <SectionCard
      title="getPrototypeIdsFromSnapshot()"
      description="全てのIDを取得"
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
          onClick={wrappedFetchIds}
          disabled={disabled}
          loading={idsLoading}
        >
          実行
        </ActionButton>
        <ActionButton
          disabled={prototypeIds == null}
          onClick={clearIds}
          variant="secondary"
        >
          クリア
        </ActionButton>
      </Stack>
      {idsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {idsError}
        </Alert>
      )}
      {prototypeIds && !idsLoading && (
        <Box
          sx={{
            mt: 2,
          }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            Total IDs: <strong>{prototypeIds.length.toLocaleString()}</strong>
            {prototypeIds.length > 20 && (
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
            {prototypeIds.slice(0, 50).map((id) => (
              <PrototypeIdAndName key={id} id={id} />
            ))}
            {prototypeIds.length > 50 && (
              <Chip
                label={`+${prototypeIds.length - 50} more`}
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
