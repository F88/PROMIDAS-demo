import { Stack, TextField, Alert, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { PrototypeCard } from '../common/prototype-card';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';
import { usePrototypeSearch } from '../../hooks';
import { getStoreState } from '../../utils/store-state-utils';
import { clampNumericInput } from '../../utils/number-utils';

interface SearchByIdProps {
  stats: PrototypeInMemoryStats | null;
  onDisplayChange?: (isDisplaying: boolean) => void;
}

export function SearchById({ stats, onDisplayChange }: SearchByIdProps) {
  const [searchId, setSearchId] = useState<string>('1');

  const {
    prototype: searchPrototype,
    loading: searchLoading,
    error: searchError,
    searchById,
    clear: clearSearch,
  } = usePrototypeSearch();

  // Control display indicator based on data visibility
  useEffect(() => {
    if (searchPrototype && !searchLoading) {
      onDisplayChange?.(true);
      const timer = setTimeout(() => {
        onDisplayChange?.(false);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (searchError || !searchPrototype) {
      onDisplayChange?.(false);
    }
  }, [searchPrototype, searchLoading, searchError, onDisplayChange]);

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
