const STORAGE_KEY = "protopedia_api_token";

export function getApiToken(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function setApiToken(token: string): void {
  localStorage.setItem(STORAGE_KEY, token);
}

export function removeApiToken(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasApiToken(): boolean {
  return getApiToken() !== null;
}
