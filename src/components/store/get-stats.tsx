import { useProtopediaRepository } from '../../hooks';
import { ActionButton } from '../common/action-button';
import { SectionCard } from '../common/section-card';

interface GetStatsProps {
  fetchStats: () => void;
  onGetStoreInfo?: (isActive: boolean) => void;
}

export function GetStats({ fetchStats, onGetStoreInfo }: GetStatsProps) {
  const repository = useProtopediaRepository();
  const disabled = repository === null;

  const handleFetchStats = () => {
    fetchStats();
    onGetStoreInfo?.(true);
  };

  return (
    <SectionCard
      title="getStats"
      description="Store状態を取得"
      category="Store"
    >
      <ActionButton disabled={disabled} onClick={handleFetchStats} size="small">
        実行
      </ActionButton>
    </SectionCard>
  );
}
