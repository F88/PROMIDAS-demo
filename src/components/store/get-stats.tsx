import { SectionCard } from "../common/section-card";
import { ActionButton } from "../common/action-button";

interface GetStatsProps {
  fetchStats: () => void;
}

export function GetStats({ fetchStats }: GetStatsProps) {
  return (
    <SectionCard
      title="getStats()"
      description="Get current snapshot statistics and cache status"
      category="Store"
    >
      <ActionButton onClick={fetchStats} size="small">
        実行
      </ActionButton>
    </SectionCard>
  );
}
