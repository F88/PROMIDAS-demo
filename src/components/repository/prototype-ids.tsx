import { Stack, Alert, Typography, Box, Chip } from "@mui/material";
import type { PrototypeInMemoryStats } from "@f88/promidas";
import { SectionCard } from "../common/section-card";
import { ActionButton } from "../common/action-button";

interface PrototypeIdsProps {
  prototypeIds: readonly number[] | null;
  idsLoading: boolean;
  idsError: string | null;
  stats: PrototypeInMemoryStats | null;
  fetchIds: () => void;
  clearIds: () => void;
}

export function PrototypeIds({
  prototypeIds,
  idsLoading,
  idsError,
  stats,
  fetchIds,
  clearIds,
}: PrototypeIdsProps) {
  return (
    <SectionCard
      title="getPrototypeIdsFromSnapshot()"
      description="Efficient ID-only retrieval"
      category="Query"
    >
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <ActionButton
          onClick={fetchIds}
          disabled={idsLoading || !stats || stats.size === 0}
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
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Total IDs: <strong>{prototypeIds.length}</strong>
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {prototypeIds.slice(0, 50).map((id) => (
              <Chip key={id} label={id} size="small" variant="outlined" />
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
