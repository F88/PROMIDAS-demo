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

  // Exhaustive handling of fetcher error codes.
  // If PROMIDAS adds a new FetcherErrorCode, this switch should fail to compile
  // until we explicitly decide how to present it in the demo site.
  switch (failure.code) {
    // HTTP-derived codes (status may not be observable in some environments)
    case 'CLIENT_UNAUTHORIZED':
      return 'APIトークンが無効です。設定を確認してください。';
    case 'CLIENT_FORBIDDEN':
      return 'アクセスが拒否されました。APIトークンの権限を確認してください。';
    case 'CLIENT_NOT_FOUND':
      return 'リクエストしたリソースが見つかりませんでした。';
    case 'CLIENT_RATE_LIMITED':
      return 'リクエスト制限に達しました。しばらく待ってから再試行してください。';
    case 'CLIENT_BAD_REQUEST':
      return 'リクエストが不正です。パラメータを確認してください。';
    case 'CLIENT_METHOD_NOT_ALLOWED':
      return '許可されていないHTTPメソッドです。';
    case 'CLIENT_TIMEOUT':
      return 'リクエストがタイムアウトしました。再試行してください。';
    case 'CLIENT_ERROR':
      return 'クライアントエラーが発生しました。リクエスト内容を確認してください。';
    case 'SERVER_INTERNAL_ERROR':
    case 'SERVER_BAD_GATEWAY':
    case 'SERVER_GATEWAY_TIMEOUT':
    case 'SERVER_SERVICE_UNAVAILABLE':
    case 'SERVER_ERROR':
      return 'サーバーエラーが発生しました。しばらく待ってから再試行してください。';

    // Network / control
    case 'NETWORK_ERROR':
      return [
        'ネットワークエラーが発生しました。',
        '次のような原因が考えられます:',
        '- ネットワークがオフライン',
        '- サーバーが一時的に利用できない',
        '- ファイアウォールやプロキシの設定',
      ].join('\n');
    case 'ECONNREFUSED':
      return 'サーバーに接続できませんでした。サーバーが起動しているか確認してください。';
    case 'ENOTFOUND':
      return 'サーバーが見つかりませんでした。URLを確認してください。';
    case 'ETIMEDOUT':
    case 'TIMEOUT':
      return 'リクエストがタイムアウトしました。ネットワーク接続を確認してください。';
    case 'ABORTED':
      return 'リクエストがキャンセルされました。';

    // CORS
    case 'CORS_BLOCKED':
      return [
        'APIサーバーとの通信がCORSポリシーによりブロックされました。',
        '最も可能性が高い原因:',
        '- APIトークンが未設定、または無効',
        '注: ProtoPedia API は Access-Control-Allow-Origin を付与しないため、PROMIDASでは401(認証エラー)を正しく判定出来ません。',
      ].join('\n');

    // Fallback
    case 'UNKNOWN':
      return failure.message;
    default: {
      const _exhaustiveCheck: never = failure.code;
      return _exhaustiveCheck;
    }
  }
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
  const localizeStoreDataState = (
    dataState: StoreSnapshotFailure['dataState'],
  ): string => {
    switch (dataState) {
      case 'UNCHANGED':
        return '既存のスナップショットは保持されます。';
      case 'UNKNOWN':
        return '既存のスナップショットの状態は不明です。';
      default: {
        const _exhaustiveCheck: never = dataState;
        return _exhaustiveCheck;
      }
    }
  };

  // Exhaustive handling of store error codes.
  // If PROMIDAS adds a new StoreErrorCode, this switch should fail to compile
  // until we decide how to present it in the demo site.
  switch (failure.code) {
    case 'STORE_CAPACITY_EXCEEDED':
      return [
        'データサイズが制限を超えました。',
        localizeStoreDataState(failure.dataState),
        '次を試してください:',
        '- limitパラメータを減らす',
        '- ストアのmaxDataSizeBytesを増やす(設定可能な場合)',
        `詳細: ${failure.message}`,
      ].join('\n');
    case 'STORE_SERIALIZATION_FAILED':
      return [
        'データのシリアライズに失敗しました。',
        localizeStoreDataState(failure.dataState),
        'データ形式に問題がある可能性があります。',
        `詳細: ${failure.message}`,
      ].join('\n');
    case 'STORE_UNKNOWN':
      return [
        'ストレージエラーが発生しました。',
        localizeStoreDataState(failure.dataState),
        `詳細: ${failure.message}`,
      ].join('\n');
    default: {
      const _exhaustiveCheck: never = failure.code;
      return _exhaustiveCheck;
    }
  }
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

  const origin = failure.origin;

  switch (origin) {
    case 'fetcher':
      return parseFetcherSnapshotFailure(failure);
    case 'store':
      return parseStoreSnapshotFailure(failure);
    case 'unknown':
      return parseUnknownSnapshotFailure(failure);
    default: {
      const _exhaustiveCheck: never = origin;
      void _exhaustiveCheck;
      return null;
    }
  }
}
