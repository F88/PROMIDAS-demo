// API token is stored in sessionStorage.
// The token persists during the browser session (until tab is closed).
// This provides a balance between security and usability.

const STORAGE_KEY = "protopedia_api_token";

export function getApiToken(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch (err) {
    // sessionStorage may not be available (e.g., in private browsing mode)
    console.warn("Failed to access sessionStorage:", err);
    return null;
  }
}

export function setApiToken(token: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, token);
  } catch (err) {
    console.warn("Failed to save token to sessionStorage:", err);
  }
}

export function removeApiToken(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn("Failed to remove token from sessionStorage:", err);
  }
}

export function hasApiToken(): boolean {
  return getApiToken() !== null;
}
