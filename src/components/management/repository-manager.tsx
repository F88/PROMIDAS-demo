import { Alert, Box, Stack } from '@mui/material';

import {
  useEnsureProtopediaRepository,
  useProtopediaRepository,
  useRepositoryError,
  useRepositoryInitializing,
  useResetProtopediaRepository,
} from '../../hooks/repository-context';
import { ActionButton } from '../common/action-button';
import { SectionCard } from '../common/section-card';

import type { ProtopediaInMemoryRepository } from 'promidas';

interface CreateRepositoryProps {
  onRepositoryCreated?: (repository: ProtopediaInMemoryRepository) => void;
}

export function RepositoryManager({
  onRepositoryCreated,
}: CreateRepositoryProps) {
  const repository = useProtopediaRepository();
  const isInitializing = useRepositoryInitializing();
  const error = useRepositoryError();
  const ensureRepository = useEnsureProtopediaRepository();
  const resetRepositoryInstance = useResetProtopediaRepository();

  const handleCreate = async () => {
    try {
      const repo = await ensureRepository();
      onRepositoryCreated?.(repo);
    } catch (err) {
      console.error('[RepositoryManager] Failed to create repository:', err);
    }
  };

  const handleDestroy = () => {
    resetRepositoryInstance();
  };

  const getStatusMessage = () => {
    if (isInitializing) return '⏳';
    if (repository) return '🟢';
    return '⚫';
  };

  const getStatusColor = () => {
    if (isInitializing) return 'info.main';
    if (repository) return 'success.main';
    return 'text.secondary';
  };

  return (
    <SectionCard
      title="Repository 管理"
      description="リポジトリを管理"
      category="Repository"
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: getStatusColor(),
              // minWidth: '100px',
            }}
          >
            {getStatusMessage()}
          </Box>
          <ActionButton
            onClick={handleCreate}
            loading={isInitializing}
            disabled={isInitializing || !!repository}
          >
            作成
          </ActionButton>
          <ActionButton
            onClick={handleDestroy}
            variant="secondary"
            disabled={!repository || isInitializing}
          >
            破棄
          </ActionButton>
        </Stack>

        {error && (
          <Alert severity="error">Repository作成エラー: {error.message}</Alert>
        )}
      </Stack>
    </SectionCard>
  );
}
