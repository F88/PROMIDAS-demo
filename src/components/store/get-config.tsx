import { useToken } from '../../hooks';
import { ActionButton } from '../common/action-button';
import { SectionCard } from '../common/section-card';

interface GetConfigProps {
  configLoading: boolean;
  fetchConfig: () => void;
  onGetStoreInfo?: (isActive: boolean) => void;
}

export function GetConfig({
  configLoading,
  fetchConfig,
  onGetStoreInfo,
}: GetConfigProps) {
  const { hasToken } = useToken();
  const disabled = hasToken === false;

  const handleFetchConfig = () => {
    fetchConfig();
    onGetStoreInfo?.(true);
  };

  return (
    <SectionCard
      title="getConfig"
      description="Store設定を取得"
      category="Store"
    >
      <ActionButton
        disabled={disabled}
        onClick={handleFetchConfig}
        loading={configLoading}
        size="small"
      >
        実行
      </ActionButton>
    </SectionCard>
  );
}
