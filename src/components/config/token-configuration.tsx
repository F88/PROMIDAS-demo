import { Visibility, VisibilityOff, Save, Delete } from '@mui/icons-material';
import {
  TextField,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  Link,
  Alert,
} from '@mui/material';
import { useState } from 'react';

import { ActionButton } from '../common/action-button';
import { SectionCard } from '../common/section-card';

interface TokenConfigurationProps {
  token: string;
  setToken: (value: string) => void;
  hasToken: boolean;
  onSaveToken: () => void;
  onDeleteToken: () => void;
}

export function TokenConfiguration({
  token,
  setToken,
  hasToken,
  onSaveToken,
  onDeleteToken,
}: TokenConfigurationProps) {
  const [showToken, setShowToken] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleSave = () => {
    onSaveToken();
    setSaveSuccess('トークンを保存しました');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleDelete = () => {
    onDeleteToken();
    setSaveSuccess('トークンを削除しました');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  return (
    <SectionCard
      title="API Token"
      description="ProtoPedia APIトークンを設定"
      category="Authentication"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        autoComplete="on"
      >
        <TextField
          fullWidth
          type={showToken ? 'text' : 'password'}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ProtoPedia APIトークン"
          size="small"
          sx={{ mb: 2 }}
          name="protopedia_api_token"
          id="protopedia_api_token"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          inputMode="text"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowToken(!showToken)}
                    edge="end"
                    aria-label={showToken ? 'Hide token' : 'Show token'}
                    size="small"
                  >
                    {showToken ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <ActionButton
            type="submit"
            startIcon={<Save />}
            disabled={!token.trim()}
          >
            一時的に保存
          </ActionButton>
          {hasToken && (
            <ActionButton
              variant="danger"
              startIcon={<Delete />}
              onClick={handleDelete}
            >
              削除
            </ActionButton>
          )}
        </Stack>
        <button type="submit" hidden aria-hidden />
      </form>
      <Typography variant="body2" color="text.secondary">
        トークンは{' '}
        <Link
          href="https://protopedia.net/settings/application"
          target="_blank"
          rel="noopener noreferrer"
        >
          ProtoPedia
        </Link>{' '}
        で確認して下さい
      </Typography>
      {saveSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {saveSuccess}
        </Alert>
      )}
    </SectionCard>
  );
}
