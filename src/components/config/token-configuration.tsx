import { useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff, Save, Delete } from "@mui/icons-material";
import { SectionCard } from "../common/section-card";
import { ActionButton } from "../common/action-button";

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

  return (
    <SectionCard
      title="API Token"
      description="Configure your ProtoPedia API token for authenticated requests"
      category="Authentication"
    >
      <TextField
        fullWidth
        type={showToken ? "text" : "password"}
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Enter your ProtoPedia API token"
        size="small"
        sx={{ mb: 2 }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowToken(!showToken)}
                  edge="end"
                  aria-label={showToken ? "Hide token" : "Show token"}
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
          startIcon={<Save />}
          onClick={onSaveToken}
          disabled={!token.trim()}
        >
          Save Token
        </ActionButton>
        {hasToken && (
          <ActionButton
            variant="danger"
            startIcon={<Delete />}
            onClick={onDeleteToken}
          >
            Delete Token
          </ActionButton>
        )}
      </Stack>
      <Typography variant="body2" color="text.secondary">
        トークンは{" "}
        <Link
          href="https://protopedia.net/settings/application"
          target="_blank"
          rel="noopener noreferrer"
        >
          ProtoPedia Settings
        </Link>{" "}
        で確認できます
      </Typography>
    </SectionCard>
  );
}
