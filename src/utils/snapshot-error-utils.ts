export type ParsedSnapshotFailure = {
  error: string | null;
  code: string | null;
  status: number | null;
};

function parseSnapshotFailureJson(
  rawError: string,
): ParsedSnapshotFailure | null {
  const normalized = rawError.trim();

  if (normalized.startsWith('{') === false) {
    return null;
  }

  try {
    const value: unknown = JSON.parse(normalized);

    if (value === null || typeof value !== 'object') {
      return null;
    }

    const obj = value as Record<string, unknown>;

    if (obj.ok !== false) {
      return null;
    }

    return {
      error: typeof obj.error === 'string' ? obj.error : null,
      code: typeof obj.code === 'string' ? obj.code : null,
      status: typeof obj.status === 'number' ? obj.status : null,
    };
  } catch {
    return null;
  }
}

export function localizeSnapshotOperationError(
  snapshotError: string | null,
): string | null {
  if (!snapshotError) {
    return null;
  }

  const normalizedSnapshotError = snapshotError.trim();

  if (normalizedSnapshotError === '') {
    return null;
  }

  if (
    normalizedSnapshotError ===
    'API token is not set. Please configure it in Settings.'
  ) {
    return 'APIトークンが設定されていません';
  }

  const parsed = parseSnapshotFailureJson(normalizedSnapshotError);
  const isFetchNetworkError =
    parsed?.code === 'NETWORK_ERROR' &&
    parsed.error?.toLowerCase().includes('failed to fetch');

  if (isFetchNetworkError) {
    const messagesForDisplay = [
      '通信に失敗しました。次のような原因が考えられます。',
      '- APIトークンが未設定、または無効',
      '- ネットワークがオフライン',
      '- サーバが一時的に利用できない',
      '注: ProtoPedia API は Access-Control-Allow-Origin を付与しないため、PROMIDASでは401(認証エラー)を正しく判定出来ません。',
    ].join('\n');
    return messagesForDisplay;
  }

  // RepositoryConfigurationError throws user-friendly hints directly
  return normalizedSnapshotError;
}
