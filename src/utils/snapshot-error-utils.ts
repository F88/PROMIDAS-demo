import type {
  SnapshotOperationFailure,
  FetcherSnapshotFailure,
  StoreSnapshotFailure,
  UnknownSnapshotFailure,
} from '@f88/promidas/repository/types';

/**
 * Localizes fetcher-originated snapshot operation failures to Japanese.
 *
 * @param failure - The fetcher snapshot failure to localize
 * @returns Localized error message in Japanese
 */
export function parseFetcherSnapshotFailure(
  failure: FetcherSnapshotFailure,
): string {
  // HTTP errors with status code (most specific)
  if (failure.kind === 'http' && failure.status) {
    switch (failure.status) {
      case 400:
        return 'リクエストが不正です。パラメータを確認してください。';
      case 401:
        return 'APIトークンが無効です。設定を確認してください。';
      case 403:
        return 'アクセスが拒否されました。APIトークンの権限を確認してください。';
      case 404:
        return 'リクエストしたリソースが見つかりませんでした。';
      case 405:
        return '許可されていないHTTPメソッドです。';
      case 408:
        return 'リクエストがタイムアウトしました。再試行してください。';
      case 429:
        return 'リクエスト制限に達しました。しばらく待ってから再試行してください。';
      case 500:
        return 'サーバー内部エラーが発生しました。しばらく待ってから再試行してください。';
      case 502:
        return 'ゲートウェイエラーが発生しました。しばらく待ってから再試行してください。';
      case 503:
        return 'サービスが一時的に利用できません。しばらく待ってから再試行してください。';
      case 504:
        return 'ゲートウェイタイムアウトが発生しました。しばらく待ってから再試行してください。';
      default:
        // Handle other HTTP status codes by range
        if (failure.status >= 400 && failure.status < 500) {
          return `クライアントエラーが発生しました (HTTP ${failure.status})。リクエスト内容を確認してください。`;
        }
        if (failure.status >= 500 && failure.status < 600) {
          return `サーバーエラーが発生しました (HTTP ${failure.status})。しばらく待ってから再試行してください。`;
        }
        return `HTTPエラーが発生しました (HTTP ${failure.status})。`;
    }
  }

  // CORS errors (認証エラーがブロックされている可能性が高い)
  if (failure.code === 'CORS_BLOCKED') {
    return [
      'APIサーバーとの通信がCORSポリシーによりブロックされました。',
      '最も可能性が高い原因:',
      '- APIトークンが未設定、または無効',
      '注: ProtoPedia API は Access-Control-Allow-Origin を付与しないため、PROMIDASでは401(認証エラー)を正しく判定出来ません。',
    ].join('\n');
  }

  // Specific network errors
  if (failure.code === 'ECONNREFUSED') {
    return 'サーバーに接続できませんでした。サーバーが起動しているか確認してください。';
  }

  if (failure.code === 'ENOTFOUND') {
    return 'サーバーが見つかりませんでした。URLを確認してください。';
  }

  if (failure.code === 'TIMEOUT' || failure.code === 'ETIMEDOUT') {
    return 'リクエストがタイムアウトしました。ネットワーク接続を確認してください。';
  }

  if (failure.code === 'ABORTED') {
    return 'リクエストがキャンセルされました。';
  }

  // Generic network errors
  if (failure.code === 'NETWORK_ERROR') {
    return [
      'ネットワークエラーが発生しました。',
      '次のような原因が考えられます:',
      '- ネットワークがオフライン',
      '- サーバーが一時的に利用できない',
      '- ファイアウォールやプロキシの設定',
    ].join('\n');
  }

  // Fallback to message for other fetcher errors
  return failure.message;
}

/**
 * Localizes store-originated snapshot operation failures to Japanese.
 *
 * @param failure - The store snapshot failure to localize
 * @returns Localized error message in Japanese
 */
export function parseStoreSnapshotFailure(
  failure: StoreSnapshotFailure,
): string {
  if (failure.code === 'STORE_CAPACITY_EXCEEDED') {
    return 'データサイズが制限を超えました。limitパラメータを減らしてください。';
  }

  if (failure.code === 'STORE_SERIALIZATION_FAILED') {
    return 'データのシリアライズに失敗しました。データ形式に問題がある可能性があります。';
  }

  if (failure.code === 'STORE_UNKNOWN') {
    return `ストレージエラーが発生しました: ${failure.message}`;
  }

  // Fallback to message for other store errors
  return failure.message;
}

/**
 * Localizes unknown-origin snapshot operation failures.
 *
 * @param failure - The unknown snapshot failure to localize
 * @returns The original error message
 */
export function parseUnknownSnapshotFailure(
  failure: UnknownSnapshotFailure,
): string {
  return failure.message;
}

/**
 * Localizes snapshot operation failures to user-friendly Japanese messages.
 *
 * Uses discriminated union types to provide specific, actionable error messages
 * based on the error's origin (fetcher, store, or unknown).
 *
 * @param failure - The snapshot operation failure to localize, or null
 * @returns Localized error message in Japanese, or null if input is null
 */
export function localizeSnapshotOperationError(
  failure: SnapshotOperationFailure | null,
): string | null {
  if (!failure) {
    return null;
  }

  if (failure.origin === 'fetcher') {
    return parseFetcherSnapshotFailure(failure);
  }

  if (failure.origin === 'store') {
    return parseStoreSnapshotFailure(failure);
  }

  return parseUnknownSnapshotFailure(failure);
}
