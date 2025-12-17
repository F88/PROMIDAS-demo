import { useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  Link,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff, Save, Delete } from "@mui/icons-material";

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
    <Box>
      <Typography variant="h6" gutterBottom>
        API Token
      </Typography>
      <Stack spacing={2}>
        <TextField
          fullWidth
          type={showToken ? "text" : "password"}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter your ProtoPedia API token"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowToken(!showToken)}
                  edge="end"
                  aria-label={showToken ? "Hide token" : "Show token"}
                >
                  {showToken ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save />}
            onClick={onSaveToken}
            disabled={!token.trim()}
          >
            Save Token
          </Button>
          {hasToken && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={onDeleteToken}
            >
              Delete Token
            </Button>
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
      </Stack>
    </Box>
  );
}
