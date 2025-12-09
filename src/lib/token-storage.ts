// WARNING: API token is now stored in memory only.
// This is more secure than localStorage, but the token will be lost on page reload.
// If you need persistence, consider using httpOnly cookies via your backend.

let apiToken: string | null = null;

export function getApiToken(): string | null {
  return apiToken;
}

export function setApiToken(token: string): void {
  apiToken = token;
}

export function removeApiToken(): void {
  apiToken = null;
}

export function hasApiToken(): boolean {
  return getApiToken() !== null;
}
