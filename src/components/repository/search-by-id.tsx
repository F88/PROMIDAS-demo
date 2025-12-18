import { Stack, TextField, Alert } from '@mui/material';
import { PrototypeCard } from '../common/prototype-card';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import type { NormalizedPrototype } from '@f88/promidas/types';
import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';

interface SearchByIdProps {
  searchId: string;
  setSearchId: (value: string) => void;
  searchPrototype: NormalizedPrototype | null;
  searchLoading: boolean;
  searchError: string | null;
  stats: PrototypeInMemoryStats | null;
  handleSearch: () => void;
  clearSearch: () => void;
}

export function SearchById({
  searchId,
  setSearchId,
  searchPrototype,
  searchLoading,
  searchError,
  stats,
  handleSearch,
  clearSearch,
}: SearchByIdProps) {
  return (
    <SectionCard
      title="getPrototypeFromSnapshotByPrototypeId()"
      description="Search for a specific prototype by ID"
      category="Query"
    >
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          label="Prototype ID"
          type="number"
          value={searchId}
          onChange={(e) => {
            setSearchId(e.target.value);
          }}
          placeholder="Enter Prototype ID"
          size="small"
          slotProps={{ htmlInput: { min: 0, max: 99_999 } }}
          sx={{ maxWidth: 200 }}
        />
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <ActionButton
          onClick={handleSearch}
          disabled={searchLoading || !searchId || !stats || stats.size === 0}
          loading={searchLoading}
        >
          実行
        </ActionButton>
        <ActionButton
          disabled={!searchPrototype}
          onClick={clearSearch}
          variant="secondary"
        >
          クリア
        </ActionButton>
      </Stack>
      {searchError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {searchError}
        </Alert>
      )}
      {searchPrototype && !searchLoading && (
        <PrototypeCard prototype={searchPrototype} />
      )}
    </SectionCard>
  );
}
