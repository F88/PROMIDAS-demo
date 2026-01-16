import { useCallback, useEffect, useState } from 'react';

import { TOKEN_KEYS, TokenManager } from 'promidas-utils/token';

const tokenStorage = TokenManager.forSessionStorage(
  TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
);

export { tokenStorage };

export function useToken() {
  const [token, setTokenValue] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize token from storage
  useEffect(() => {
    const init = async () => {
      try {
        const storedToken = await tokenStorage.get();
        setTokenValue(storedToken);
        setHasToken(await tokenStorage.has());
      } catch (err) {
        console.error('[useToken] Failed to load token from storage', err);
      } finally {
        setIsLoading(false);
      }
    };
    void init();
  }, []);

  const saveToken = useCallback(async (newToken: string) => {
    await tokenStorage.save(newToken);
    setTokenValue(newToken);
    setHasToken(true);
  }, []);

  const removeToken = useCallback(async () => {
    await tokenStorage.remove();
    setTokenValue(null);
    setHasToken(false);
  }, []);

  return {
    token,
    hasToken,
    isLoading,
    saveToken,
    removeToken,
  };
}
