import { Stack, TextField, Alert } from '@mui/material';
import { PrototypeCard } from '../common/prototype-card';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';
import { useState } from 'react';
import { usePrototypeSearch } from '../../hooks';
import { getStoreState } from '../../utils/store-state-utils';

type FlowPattern =
  | 'get-store-info'
  | 'get-from-snapshot'
  | 'fetch-individual'
  | 'forced-fetch'
  | 'simple-display';

interface SearchByIdProps {
  stats: PrototypeInMemoryStats | null;
  visualizeFlow: (
    operation: () => Promise<void> | void,
    pattern: FlowPattern,
  ) => Promise<void>;
}

export function SearchById({ stats, visualizeFlow }: SearchByIdProps) {
  const [searchId, setSearchId] = useState<string>('1');

  const {
    prototype: searchPrototype,
    loading: searchLoading,
    error: searchError,
    searchById,
    clear: clearSearch,
  } = usePrototypeSearch();

  const handleSearch = () => {
    const id = parseInt(searchId);
    if (!isNaN(id)) {
      visualizeFlow(() => {
        searchById(id);
      }, 'get-from-snapshot');
    }
  };

  const disabled =
    searchLoading ||
    searchId.trim() === '' ||
    getStoreState(stats) === 'not-stored';

  return (
    <SectionCard
      title="getPrototypeFromSnapshotByPrototypeId()"
      description="Search for a specific prototype by ID"
      category="Query"
    >
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          disabled={disabled}
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
          disabled={disabled}
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
