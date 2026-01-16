import { useEffect, useState } from 'react';

import type { PrototypeInMemoryStats } from 'promidas';
import { getStoreState } from 'promidas-utils/store';

import { Alert, Box, Stack, TextField } from '@mui/material';

import { usePrototypeSearch } from '../../hooks';

import { clampNumericInput } from '../../utils/number-utils';

import { ActionButton } from '../common/action-button';
import { PrototypeCard } from '../common/prototype-card';
import { SectionCard } from '../common/section-card';

interface SearchByIdProps {
  stats: PrototypeInMemoryStats | null;
  onUseSnapshot?: (isActive: boolean) => void;
}

export function SearchById({ stats, onUseSnapshot }: SearchByIdProps) {
  const [searchId, setSearchId] = useState<string>('1');

  const {
    prototype: searchPrototype,
    loading: searchLoading,
    error: searchError,
    searchById,
    clear: clearSearch,
  } = usePrototypeSearch();

  // Clear results and errors when repository is destroyed
  useEffect(() => {
    if (getStoreState(stats) === 'not-stored') {
      clearSearch();
    }
  }, [stats, clearSearch]);

  // Control store/repo indicator when data is retrieved
  useEffect(() => {
    if (searchPrototype && !searchLoading) {
      onUseSnapshot?.(true);
    }
  }, [searchPrototype, searchLoading, onUseSnapshot]);

  const handleSearch = () => {
    const id = parseInt(searchId);
    if (!isNaN(id)) {
      searchById(id);
    }
  };

  const disabled =
    searchLoading ||
    searchId.trim() === '' ||
    getStoreState(stats) === 'not-stored';

  return (
    <SectionCard
      title="getPrototypeFromSnapshotByPrototypeId"
      description="IDを指定して取得"
      category="Query"
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mb: 2,
        }}
      >
        <TextField
          disabled={disabled}
          label="ID"
          type="number"
          value={searchId}
          onChange={(e) => {
            setSearchId(clampNumericInput(e.target.value, 0, 99_999));
          }}
          placeholder="Enter Prototype ID"
          size="small"
          slotProps={{ htmlInput: { min: 0, max: 99_999 } }}
          sx={{ maxWidth: 200 }}
        />
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mt: 2,
        }}
      >
        <ActionButton
          disabled={disabled}
          onClick={handleSearch}
          loading={searchLoading}
        >
          実行
        </ActionButton>
        <ActionButton
          disabled={!searchPrototype}
          // disabled={disabled}
          onClick={clearSearch}
          variant="secondary"
        >
          クリア
        </ActionButton>
      </Stack>
      {searchError && (
        <Alert
          severity="error"
          sx={{
            mt: 2,
          }}
        >
          {searchError}
        </Alert>
      )}
      {searchPrototype && !searchLoading && (
        <>
          <Box sx={{ mt: 2 }}>
            <PrototypeCard prototype={searchPrototype} />
          </Box>
        </>
      )}
    </SectionCard>
  );
}
