import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';
import { hasApiToken } from '../../lib/token/token-storage';

interface GetConfigProps {
  configLoading: boolean;
  fetchConfig: () => void;
}

export function GetConfig({ configLoading, fetchConfig }: GetConfigProps) {
  const disabled = hasApiToken() === false;

  return (
    <SectionCard
      title="getConfig"
      description="Store設定を取得"
      category="Store"
    >
      <ActionButton
        disabled={disabled}
        onClick={fetchConfig}
        loading={configLoading}
        size="small"
      >
        実行
      </ActionButton>
    </SectionCard>
  );
}
