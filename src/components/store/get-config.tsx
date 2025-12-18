import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';

interface GetConfigProps {
  configLoading: boolean;
  fetchConfig: () => void;
}

export function GetConfig({ configLoading, fetchConfig }: GetConfigProps) {
  return (
    <SectionCard
      title="getConfig()"
      description="Retrieve store settings"
      category="Store"
    >
      <ActionButton
        onClick={fetchConfig}
        disabled={configLoading}
        loading={configLoading}
        size="small"
      >
        実行
      </ActionButton>
    </SectionCard>
  );
}
