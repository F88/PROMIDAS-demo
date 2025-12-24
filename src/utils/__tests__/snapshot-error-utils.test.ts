import { describe, expect, it } from 'vitest';
import type {
  FetcherSnapshotFailure,
  StoreSnapshotFailure,
  UnknownSnapshotFailure,
} from '@f88/promidas/repository/types';
import {
  localizeSnapshotOperationError,
  parseFetcherSnapshotFailure,
  parseStoreSnapshotFailure,
  parseUnknownSnapshotFailure,
} from '../snapshot-error-utils';

describe('parseFetcherSnapshotFailure', () => {
  const buildExpectedFetcherMessage = (
    localizedMessage: string,
    referenceLines: string[],
  ): string => {
    return [localizedMessage, '', '[参考情報]', ...referenceLines].join('\n');
  };

  describe('HTTP errors (kind === "http")', () => {
    it('localizes 400 Bad Request', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'http',
        code: 'CLIENT_BAD_REQUEST',
        message: 'Bad request',
        status: 400,
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
          res: { statusText: 'Bad Request' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage(
          'リクエストが不正です。パラメータを確認してください。',
          [
            'リクエスト: GET https://api.example.com',
            'レスポンス: HTTP 400 Bad Request',
            'エラーコード: CLIENT_BAD_REQUEST',
            '詳細: Bad request',
          ],
        ),
      );
    });

    it('localizes 401 Unauthorized', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'http',
        code: 'CLIENT_UNAUTHORIZED',
        message: 'Unauthorized',
        status: 401,
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
          res: { statusText: 'Unauthorized' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage(
          'APIトークンが無効です。設定を確認してください。',
          [
            'リクエスト: GET https://api.example.com',
            'レスポンス: HTTP 401 Unauthorized',
            'エラーコード: CLIENT_UNAUTHORIZED',
            '詳細: Unauthorized',
          ],
        ),
      );
    });

    it('localizes 403 Forbidden', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'http',
        code: 'CLIENT_FORBIDDEN',
        message: 'Forbidden',
        status: 403,
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
          res: { statusText: 'Forbidden' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage(
          'アクセスが拒否されました。APIトークンの権限を確認してください。',
          [
            'リクエスト: GET https://api.example.com',
            'レスポンス: HTTP 403 Forbidden',
            'エラーコード: CLIENT_FORBIDDEN',
            '詳細: Forbidden',
          ],
        ),
      );
    });

    it('localizes 404 Not Found', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'http',
        code: 'CLIENT_NOT_FOUND',
        message: 'Resource not found',
        status: 404,
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
          res: { statusText: 'Not Found' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage(
          'リクエストしたリソースが見つかりませんでした。',
          [
            'リクエスト: GET https://api.example.com',
            'レスポンス: HTTP 404 Not Found',
            'エラーコード: CLIENT_NOT_FOUND',
            '詳細: Resource not found',
          ],
        ),
      );
    });

    it('localizes 405 Method Not Allowed', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'http',
        code: 'CLIENT_METHOD_NOT_ALLOWED',
        message: 'Method not allowed',
        status: 405,
        details: {
          req: { method: 'POST', url: 'https://api.example.com' },
          res: { statusText: 'Method Not Allowed' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage('許可されていないHTTPメソッドです。', [
          'リクエスト: POST https://api.example.com',
          'レスポンス: HTTP 405 Method Not Allowed',
          'エラーコード: CLIENT_METHOD_NOT_ALLOWED',
          '詳細: Method not allowed',
        ]),
      );
    });

    it('localizes 408 Request Timeout', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'http',
        code: 'CLIENT_TIMEOUT',
        message: 'Request timeout',
        status: 408,
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
          res: { statusText: 'Request Timeout' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage(
          'リクエストがタイムアウトしました。再試行してください。',
          [
            'リクエスト: GET https://api.example.com',
            'レスポンス: HTTP 408 Request Timeout',
            'エラーコード: CLIENT_TIMEOUT',
            '詳細: Request timeout',
          ],
        ),
      );
    });

    it('localizes 429 Rate Limited', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'http',
        code: 'CLIENT_RATE_LIMITED',
        message: 'Too many requests',
        status: 429,
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
          res: { statusText: 'Too Many Requests' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage(
          'リクエスト制限に達しました。しばらく待ってから再試行してください。',
          [
            'リクエスト: GET https://api.example.com',
            'レスポンス: HTTP 429 Too Many Requests',
            'エラーコード: CLIENT_RATE_LIMITED',
            '詳細: Too many requests',
          ],
        ),
      );
    });

    it('localizes other 4xx errors with generic message', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'http',
        code: 'CLIENT_ERROR',
        message: 'Client error',
        status: 418,
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
          res: { statusText: "I'm a teapot" },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage(
          'クライアントエラーが発生しました (HTTP 418)。リクエスト内容を確認してください。',
          [
            'リクエスト: GET https://api.example.com',
            "レスポンス: HTTP 418 I'm a teapot",
            'エラーコード: CLIENT_ERROR',
            '詳細: Client error',
          ],
        ),
      );
    });

    it('localizes 500 Internal Server Error', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'http',
        code: 'SERVER_INTERNAL_ERROR',
        message: 'Internal server error',
        status: 500,
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
          res: { statusText: 'Internal Server Error' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage(
          'サーバー内部エラーが発生しました。しばらく待ってから再試行してください。',
          [
            'リクエスト: GET https://api.example.com',
            'レスポンス: HTTP 500 Internal Server Error',
            'エラーコード: SERVER_INTERNAL_ERROR',
            '詳細: Internal server error',
          ],
        ),
      );
    });

    it('localizes 502 Bad Gateway', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'http',
        code: 'SERVER_BAD_GATEWAY',
        message: 'Bad gateway',
        status: 502,
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
          res: { statusText: 'Bad Gateway' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage(
          'ゲートウェイエラーが発生しました。しばらく待ってから再試行してください。',
          [
            'リクエスト: GET https://api.example.com',
            'レスポンス: HTTP 502 Bad Gateway',
            'エラーコード: SERVER_BAD_GATEWAY',
            '詳細: Bad gateway',
          ],
        ),
      );
    });

    it('localizes 503 Service Unavailable', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'http',
        code: 'SERVER_SERVICE_UNAVAILABLE',
        message: 'Service unavailable',
        status: 503,
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
          res: { statusText: 'Service Unavailable' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage(
          'サービスが一時的に利用できません。しばらく待ってから再試行してください。',
          [
            'リクエスト: GET https://api.example.com',
            'レスポンス: HTTP 503 Service Unavailable',
            'エラーコード: SERVER_SERVICE_UNAVAILABLE',
            '詳細: Service unavailable',
          ],
        ),
      );
    });

    it('localizes 504 Gateway Timeout', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'http',
        code: 'SERVER_GATEWAY_TIMEOUT',
        message: 'Gateway timeout',
        status: 504,
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
          res: { statusText: 'Gateway Timeout' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage(
          'ゲートウェイタイムアウトが発生しました。しばらく待ってから再試行してください。',
          [
            'リクエスト: GET https://api.example.com',
            'レスポンス: HTTP 504 Gateway Timeout',
            'エラーコード: SERVER_GATEWAY_TIMEOUT',
            '詳細: Gateway timeout',
          ],
        ),
      );
    });

    it('localizes other 5xx errors with generic message', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'http',
        code: 'SERVER_ERROR',
        message: 'Server error',
        status: 599,
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
          res: { statusText: 'Network connect timeout error' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage(
          'サーバーエラーが発生しました (HTTP 599)。しばらく待ってから再試行してください。',
          [
            'リクエスト: GET https://api.example.com',
            'レスポンス: HTTP 599 Network connect timeout error',
            'エラーコード: SERVER_ERROR',
            '詳細: Server error',
          ],
        ),
      );
    });

    it('localizes unexpected HTTP status codes', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'http',
        code: 'UNKNOWN',
        message: 'Unknown error',
        status: 999,
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
          res: { statusText: 'Unknown' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage('HTTPエラーが発生しました (HTTP 999)。', [
          'リクエスト: GET https://api.example.com',
          'レスポンス: HTTP 999 Unknown',
          'エラーコード: UNKNOWN',
          '詳細: Unknown error',
        ]),
      );
    });
  });

  describe('CORS errors (kind === "cors")', () => {
    it('localizes CORS_BLOCKED errors with ProtoPedia-specific message', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'cors',
        code: 'CORS_BLOCKED',
        message: 'CORS blocked',
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage(
          [
            'APIサーバーとの通信がCORSポリシーによりブロックされました。',
            '最も可能性が高い原因:',
            '- APIトークンが未設定、または無効',
            '注: ProtoPedia API は Access-Control-Allow-Origin を付与しないため、PROMIDASでは401(認証エラー)を正しく判定出来ません。',
          ].join('\n'),
          [
            'リクエスト: GET https://api.example.com',
            'エラーコード: CORS_BLOCKED',
            '詳細: CORS blocked',
          ],
        ),
      );
    });
  });

  describe('Network errors (kind === "network")', () => {
    it('localizes ECONNREFUSED (connection refused)', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'network',
        code: 'ECONNREFUSED',
        message: 'Connection refused',
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage(
          'サーバーに接続できませんでした。サーバーが起動しているか確認してください。',
          [
            'リクエスト: GET https://api.example.com',
            'エラーコード: ECONNREFUSED',
            '詳細: Connection refused',
          ],
        ),
      );
    });

    it('localizes ENOTFOUND (host not found)', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'network',
        code: 'ENOTFOUND',
        message: 'Host not found',
        details: {
          req: { method: 'GET', url: 'https://invalid-domain.example' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage(
          'サーバーが見つかりませんでした。URLを確認してください。',
          [
            'リクエスト: GET https://invalid-domain.example',
            'エラーコード: ENOTFOUND',
            '詳細: Host not found',
          ],
        ),
      );
    });

    it('localizes ETIMEDOUT (socket timeout)', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'network',
        code: 'ETIMEDOUT',
        message: 'Socket timeout',
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage(
          'リクエストがタイムアウトしました。ネットワーク接続を確認してください。',
          [
            'リクエスト: GET https://api.example.com',
            'エラーコード: ETIMEDOUT',
            '詳細: Socket timeout',
          ],
        ),
      );
    });

    it('localizes NETWORK_ERROR (generic network error)', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'network',
        code: 'NETWORK_ERROR',
        message: 'Failed to fetch',
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage(
          [
            'ネットワークエラーが発生しました。',
            '次のような原因が考えられます:',
            '- ネットワークがオフライン',
            '- サーバーが一時的に利用できない',
            '- ファイアウォールやプロキシの設定',
          ].join('\n'),
          [
            'リクエスト: GET https://api.example.com',
            'エラーコード: NETWORK_ERROR',
            '詳細: Failed to fetch',
          ],
        ),
      );
    });
  });

  describe('Timeout errors (kind === "timeout")', () => {
    it('localizes TIMEOUT (fetcher timeout)', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'timeout',
        code: 'TIMEOUT',
        message: 'Request timeout',
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage(
          'リクエストがタイムアウトしました。ネットワーク接続を確認してください。',
          [
            'リクエスト: GET https://api.example.com',
            'エラーコード: TIMEOUT',
            '詳細: Request timeout',
          ],
        ),
      );
    });
  });

  describe('Abort errors (kind === "abort")', () => {
    it('localizes ABORTED (request cancelled)', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'abort',
        code: 'ABORTED',
        message: 'Request aborted',
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage('リクエストがキャンセルされました。', [
          'リクエスト: GET https://api.example.com',
          'エラーコード: ABORTED',
          '詳細: Request aborted',
        ]),
      );
    });
  });

  describe('Code-only handling (status not available)', () => {
    it('localizes CLIENT_UNAUTHORIZED via code when status is absent', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'http',
        code: 'CLIENT_UNAUTHORIZED',
        message: 'Unauthorized',
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage(
          'APIトークンが無効です。設定を確認してください。',
          [
            'リクエスト: GET https://api.example.com',
            'エラーコード: CLIENT_UNAUTHORIZED',
            '詳細: Unauthorized',
          ],
        ),
      );
    });

    it('falls back to message for UNKNOWN code', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'unknown',
        code: 'UNKNOWN',
        message: 'Unknown fetcher error',
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toBe(
        buildExpectedFetcherMessage('Unknown fetcher error', [
          'リクエスト: GET https://api.example.com',
          'エラーコード: UNKNOWN',
        ]),
      );
    });
  });
});

describe('parseStoreSnapshotFailure', () => {
  it('handles STORE_CAPACITY_EXCEEDED', () => {
    const failure: StoreSnapshotFailure = {
      ok: false,
      origin: 'store',
      kind: 'storage_limit',
      code: 'STORE_CAPACITY_EXCEEDED',
      message: 'Data size exceeded limit',
      dataState: 'UNCHANGED',
    };

    const message = parseStoreSnapshotFailure(failure);
    expect(message).toContain('データサイズが制限を超えました。');
    expect(message).toContain('既存のスナップショットは保持されます。');
    expect(message).toContain('次を試してください:');
    expect(message).toContain('- limitパラメータを減らす');
    expect(message).toContain(
      '- ストアのmaxDataSizeBytesを増やす(設定可能な場合)',
    );
    expect(message).toContain('[参考情報]');
    expect(message).toContain('エラーコード: STORE_CAPACITY_EXCEEDED');
    expect(message).toContain('分類: storage_limit');
    expect(message).toContain('dataState: UNCHANGED');
    expect(message).toContain('詳細: Data size exceeded limit');
  });

  it('handles STORE_SERIALIZATION_FAILED', () => {
    const failure: StoreSnapshotFailure = {
      ok: false,
      origin: 'store',
      kind: 'serialization',
      code: 'STORE_SERIALIZATION_FAILED',
      message: 'Serialization failed',
      dataState: 'UNCHANGED',
    };

    const message = parseStoreSnapshotFailure(failure);
    expect(message).toContain('データのシリアライズに失敗しました。');
    expect(message).toContain('既存のスナップショットは保持されます。');
    expect(message).toContain('データ形式に問題がある可能性があります。');
    expect(message).toContain('[参考情報]');
    expect(message).toContain('エラーコード: STORE_SERIALIZATION_FAILED');
    expect(message).toContain('分類: serialization');
    expect(message).toContain('dataState: UNCHANGED');
    expect(message).toContain('詳細: Serialization failed');
  });

  it('handles STORE_UNKNOWN', () => {
    const failure: StoreSnapshotFailure = {
      ok: false,
      origin: 'store',
      kind: 'unknown',
      code: 'STORE_UNKNOWN',
      message: 'Unexpected store error',
      dataState: 'UNCHANGED',
    };

    const message = parseStoreSnapshotFailure(failure);
    expect(message).toContain('ストレージエラーが発生しました。');
    expect(message).toContain('既存のスナップショットは保持されます。');
    expect(message).toContain('[参考情報]');
    expect(message).toContain('エラーコード: STORE_UNKNOWN');
    expect(message).toContain('分類: unknown');
    expect(message).toContain('dataState: UNCHANGED');
    expect(message).toContain('詳細: Unexpected store error');
  });
});

describe('parseUnknownSnapshotFailure', () => {
  it('returns message as-is', () => {
    const failure: UnknownSnapshotFailure = {
      ok: false,
      origin: 'unknown',
      message: 'Unexpected error occurred',
    };

    expect(parseUnknownSnapshotFailure(failure)).toBe(
      'Unexpected error occurred',
    );
  });

  it('handles empty message', () => {
    const failure: UnknownSnapshotFailure = {
      ok: false,
      origin: 'unknown',
      message: '',
    };

    expect(parseUnknownSnapshotFailure(failure)).toBe('');
  });
});

describe('localizeSnapshotOperationError', () => {
  it('returns null for null input', () => {
    expect(localizeSnapshotOperationError(null)).toBeNull();
  });

  it('routes fetcher failures to parseFetcherSnapshotFailure', () => {
    const failure: FetcherSnapshotFailure = {
      ok: false,
      origin: 'fetcher',
      kind: 'http',
      code: 'CLIENT_UNAUTHORIZED',
      message: 'Unauthorized',
      status: 401,
      details: {
        req: { method: 'GET', url: 'https://api.example.com' },
        res: { statusText: 'Unauthorized' },
      },
    };

    expect(localizeSnapshotOperationError(failure)).toBe(
      parseFetcherSnapshotFailure(failure),
    );
  });

  it('routes store failures to parseStoreSnapshotFailure', () => {
    const failure: StoreSnapshotFailure = {
      ok: false,
      origin: 'store',
      kind: 'storage_limit',
      code: 'STORE_CAPACITY_EXCEEDED',
      message: 'Data size exceeded limit',
      dataState: 'UNCHANGED',
    };

    expect(localizeSnapshotOperationError(failure)).toBe(
      parseStoreSnapshotFailure(failure),
    );
  });

  it('routes unknown failures to parseUnknownSnapshotFailure', () => {
    const failure: UnknownSnapshotFailure = {
      ok: false,
      origin: 'unknown',
      message: 'Something unexpected happened',
    };

    expect(localizeSnapshotOperationError(failure)).toBe(
      parseUnknownSnapshotFailure(failure),
    );
  });
});
