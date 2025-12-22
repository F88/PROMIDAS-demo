import {
  Stack,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Box,
} from '@mui/material';
import { useState } from 'react';
import { Save, RestartAlt } from '@mui/icons-material';
import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';
import {
  loadStoreSettings,
  saveStoreSettings,
  resetStoreSettings,
  getDefaultStoreSettings,
  type RepositoryStoreSettings,
} from '../../lib/repository/repository-settings';
import { resetRepository } from '../../lib/repository/protopedia-repository';

interface RepositorySettingsProps {
  onSettingsSaved?: () => void;
}

export function RepositorySettings({
  onSettingsSaved,
}: RepositorySettingsProps) {
  const [settings, setSettings] =
    useState<RepositoryStoreSettings>(loadStoreSettings);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleSave = () => {
    saveStoreSettings(settings);
    resetRepository();
    onSettingsSaved?.();
    setSaveSuccess('設定を保存しました');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleReset = () => {
    const defaults = getDefaultStoreSettings();
    setSettings(defaults);
    resetStoreSettings();
    resetRepository();
    onSettingsSaved?.();
    setSaveSuccess('設定をデフォルトに戻しました');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleTtlChange = (value: string) => {
    const num = parseInt(value, 10);
    if (Number.isFinite(num) && num > 0) {
      setSettings({ ...settings, ttlMs: num });
    }
  };

  const handleMaxDataSizeChange = (value: string) => {
    const num = parseInt(value, 10);
    if (Number.isFinite(num) && num > 0) {
      setSettings({ ...settings, maxDataSizeBytes: num });
    }
  };

  const defaults = getDefaultStoreSettings();

  const ttlOptions = [
    { value: 10 * 1000, label: '10 秒' },
    { value: 30 * 1000, label: '30 秒' },
    { value: 60 * 1000, label: '60 秒' },
    { value: 5 * 60 * 1000, label: '5 分' },
    { value: 10 * 60 * 1000, label: '10 分' },
  ];

  const dataSizeOptions = [
    { value: 10 * 1024 * 1024, label: '10 MB' },
    { value: 20 * 1024 * 1024, label: '20 MB' },
    { value: 30 * 1024 * 1024, label: '30 MB' },
  ];

  return (
    <SectionCard
      title="Repository"
      description="Store の設定"
      category="Configuration"
    >
      <Stack spacing={2} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            TTL (キャッシュ有効期限)
          </Typography>
          <ToggleButtonGroup
            value={settings.ttlMs}
            exclusive
            onChange={(e, value) => value && handleTtlChange(value.toString())}
            size="small"
            fullWidth
          >
            {ttlOptions.map((option) => (
              <ToggleButton key={option.value} value={option.value}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Max Data Size (最大データサイズ)
          </Typography>
          <ToggleButtonGroup
            value={settings.maxDataSizeBytes}
            exclusive
            onChange={(e, value) =>
              value && handleMaxDataSizeChange(value.toString())
            }
            size="small"
            fullWidth
          >
            {dataSizeOptions.map((option) => (
              <ToggleButton key={option.value} value={option.value}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Stack direction="row" spacing={1}>
          <ActionButton startIcon={<Save />} onClick={handleSave}>
            保存
          </ActionButton>
          <ActionButton
            variant="outlined"
            startIcon={<RestartAlt />}
            onClick={handleReset}
          >
            デフォルトに戻す
          </ActionButton>
        </Stack>
      </Stack>
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {saveSuccess}
        </Alert>
      )}
    </SectionCard>
  );
}
