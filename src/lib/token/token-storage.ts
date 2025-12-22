/**
 * @file Session-scoped storage helpers for the ProtoPedia API token.
 *
 * The demo stores the token in `sessionStorage` so it lasts for the current tab
 * session only.
 */

const STORAGE_KEY = 'protopedia_api_token';

/**
 * Gets the currently stored API token.
 */
export function getApiToken(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch (err) {
    // sessionStorage may not be available (e.g., in private browsing mode)
    console.warn('Failed to access sessionStorage:', err);
    return null;
  }
}

/**
 * Stores the API token for the current browser session.
 */
export function setApiToken(token: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, token);
  } catch (err) {
    console.warn('Failed to save token to sessionStorage:', err);
  }
}

/**
 * Removes the stored API token.
 */
export function removeApiToken(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to remove token from sessionStorage:', err);
  }
}

/**
 * Returns whether a token value exists in storage.
 */
export function hasApiToken(): boolean {
  return getApiToken() !== null;
}
