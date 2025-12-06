import { useState } from "react";
import { getApiToken, setApiToken, removeApiToken } from "../lib/token-storage";
import "./Settings.css";

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const [token, setToken] = useState(getApiToken() || "");
  const [showToken, setShowToken] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (token.trim()) {
      setApiToken(token.trim());
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
        // Reload to apply new token
        window.location.reload();
      }, 1000);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete the API token?")) {
      removeApiToken();
      setToken("");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Settings</h2>
          <button onClick={onClose} className="close-button" aria-label="Close">
            ×
          </button>
        </div>

        <div className="settings-content">
          <div className="setting-item">
            <label htmlFor="api-token">ProtoPedia API Token</label>
            <div className="token-input-wrapper">
              <input
                id="api-token"
                type={showToken ? "text" : "password"}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your API token"
                className="token-input"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="toggle-visibility"
                aria-label={showToken ? "Hide token" : "Show token"}
              >
                {showToken ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <p className="help-text">
              トークンは以下のページで確認できます:{" "}
              <a
                href="https://protopedia.net/settings/application"
                target="_blank"
                rel="noopener noreferrer"
              >
                設定ページ - アプリケーション | ProtoPedia
              </a>
            </p>
          </div>

          <div className="settings-actions">
            <button
              onClick={handleSave}
              disabled={!token.trim() || saved}
              className="save-button"
            >
              {saved ? "✓ Saved" : "Save Token"}
            </button>
            {getApiToken() && (
              <button onClick={handleDelete} className="delete-button">
                Delete Token
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
