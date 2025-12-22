import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';
import { hasApiToken } from '../../lib/token/token-storage';

interface GetStatsProps {
  fetchStats: () => void;
}

export function GetStats({ fetchStats }: GetStatsProps) {
  const disabled = hasApiToken() === false;

  return (
    <SectionCard
      title="getStats()"
      description="キャッシュの状態を取得"
      category="Store"
    >
      <ActionButton disabled={disabled} onClick={fetchStats} size="small">
        実行
      </ActionButton>
    </SectionCard>
  );
}
