import { describe, expect, it } from 'vitest';
import type { SnapshotOperationFailure } from '@f88/promidas/repository/types';
import {
  localizeSnapshotOperationError,
  parseFetcherSnapshotFailure,
  parseStoreSnapshotFailure,
  parseUnknownSnapshotFailure,
} from '../snapshot-error-utils';

describe('localizeSnapshotOperationError', () => {
  describe('null handling', () => {
    it('returns null for null input', () => {
      expect(localizeSnapshotOperationError(null)).toBeNull();
    });
  });

  describe('fetcher errors (origin === "fetcher")', () => {
    describe('HTTP errors (kind === "http")', () => {
      describe('4xx Client Errors', () => {
        it('localizes 400 Bad Request', () => {
          const failure: SnapshotOperationFailure = {
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

          expect(localizeSnapshotOperationError(failure)).toBe(
            'リクエストが不正です。パラメータを確認してください。',
          );
        });

        it('localizes 401 Unauthorized', () => {
          const failure: SnapshotOperationFailure = {
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
            'APIトークンが無効です。設定を確認してください。',
          );
        });

        it('localizes 403 Forbidden', () => {
          const failure: SnapshotOperationFailure = {
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

          expect(localizeSnapshotOperationError(failure)).toBe(
            'アクセスが拒否されました。APIトークンの権限を確認してください。',
          );
        });

        it('localizes 404 Not Found', () => {
          const failure: SnapshotOperationFailure = {
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

          expect(localizeSnapshotOperationError(failure)).toBe(
            'リクエストしたリソースが見つかりませんでした。',
          );
        });

        it('localizes 405 Method Not Allowed', () => {
          const failure: SnapshotOperationFailure = {
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

          expect(localizeSnapshotOperationError(failure)).toBe(
            '許可されていないHTTPメソッドです。',
          );
        });

        it('localizes 408 Request Timeout', () => {
          const failure: SnapshotOperationFailure = {
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

          expect(localizeSnapshotOperationError(failure)).toBe(
            'リクエストがタイムアウトしました。再試行してください。',
          );
        });

        it('localizes 429 Rate Limited', () => {
          const failure: SnapshotOperationFailure = {
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

          expect(localizeSnapshotOperationError(failure)).toBe(
            'リクエスト制限に達しました。しばらく待ってから再試行してください。',
          );
        });

        it('localizes other 4xx errors with generic message', () => {
          const failure: SnapshotOperationFailure = {
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

          expect(localizeSnapshotOperationError(failure)).toBe(
            'クライアントエラーが発生しました (HTTP 418)。リクエスト内容を確認してください。',
          );
        });
      });

      describe('5xx Server Errors', () => {
        it('localizes 500 Internal Server Error', () => {
          const failure: SnapshotOperationFailure = {
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

          expect(localizeSnapshotOperationError(failure)).toBe(
            'サーバー内部エラーが発生しました。しばらく待ってから再試行してください。',
          );
        });

        it('localizes 502 Bad Gateway', () => {
          const failure: SnapshotOperationFailure = {
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

          expect(localizeSnapshotOperationError(failure)).toBe(
            'ゲートウェイエラーが発生しました。しばらく待ってから再試行してください。',
          );
        });

        it('localizes 503 Service Unavailable', () => {
          const failure: SnapshotOperationFailure = {
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

          expect(localizeSnapshotOperationError(failure)).toBe(
            'サービスが一時的に利用できません。しばらく待ってから再試行してください。',
          );
        });

        it('localizes 504 Gateway Timeout', () => {
          const failure: SnapshotOperationFailure = {
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

          expect(localizeSnapshotOperationError(failure)).toBe(
            'ゲートウェイタイムアウトが発生しました。しばらく待ってから再試行してください。',
          );
        });

        it('localizes other 5xx errors with generic message', () => {
          const failure: SnapshotOperationFailure = {
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

          expect(localizeSnapshotOperationError(failure)).toBe(
            'サーバーエラーが発生しました (HTTP 599)。しばらく待ってから再試行してください。',
          );
        });
      });

      describe('Other HTTP status codes', () => {
        it('localizes unexpected HTTP status codes', () => {
          const failure: SnapshotOperationFailure = {
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

          expect(localizeSnapshotOperationError(failure)).toBe(
            'HTTPエラーが発生しました (HTTP 999)。',
          );
        });
      });
    });

    describe('CORS errors (kind === "cors")', () => {
      it('localizes CORS_BLOCKED errors with ProtoPedia-specific message', () => {
        const failure: SnapshotOperationFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'cors',
          code: 'CORS_BLOCKED',
          message: 'CORS blocked',
          details: {
            req: { method: 'GET', url: 'https://api.example.com' },
          },
        };

        expect(localizeSnapshotOperationError(failure)).toBe(
          [
            'APIサーバーとの通信がCORSポリシーによりブロックされました。',
            '最も可能性が高い原因:',
            '- APIトークンが未設定、または無効',
            '注: ProtoPedia API は Access-Control-Allow-Origin を付与しないため、PROMIDASでは401(認証エラー)を正しく判定出来ません。',
          ].join('\n'),
        );
      });
    });

    describe('Network errors (kind === "network")', () => {
      it('localizes ECONNREFUSED (connection refused)', () => {
        const failure: SnapshotOperationFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'network',
          code: 'ECONNREFUSED',
          message: 'Connection refused',
          details: {
            req: { method: 'GET', url: 'https://api.example.com' },
          },
        };

        expect(localizeSnapshotOperationError(failure)).toBe(
          'サーバーに接続できませんでした。サーバーが起動しているか確認してください。',
        );
      });

      it('localizes ENOTFOUND (host not found)', () => {
        const failure: SnapshotOperationFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'network',
          code: 'ENOTFOUND',
          message: 'Host not found',
          details: {
            req: { method: 'GET', url: 'https://invalid-domain.example' },
          },
        };

        expect(localizeSnapshotOperationError(failure)).toBe(
          'サーバーが見つかりませんでした。URLを確認してください。',
        );
      });

      it('localizes ETIMEDOUT (socket timeout)', () => {
        const failure: SnapshotOperationFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'network',
          code: 'ETIMEDOUT',
          message: 'Socket timeout',
          details: {
            req: { method: 'GET', url: 'https://api.example.com' },
          },
        };

        expect(localizeSnapshotOperationError(failure)).toBe(
          'リクエストがタイムアウトしました。ネットワーク接続を確認してください。',
        );
      });

      it('localizes NETWORK_ERROR (generic network error)', () => {
        const failure: SnapshotOperationFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'network',
          code: 'NETWORK_ERROR',
          message: 'Failed to fetch',
          details: {
            req: { method: 'GET', url: 'https://api.example.com' },
          },
        };

        expect(localizeSnapshotOperationError(failure)).toBe(
          [
            'ネットワークエラーが発生しました。',
            '次のような原因が考えられます:',
            '- ネットワークがオフライン',
            '- サーバーが一時的に利用できない',
            '- ファイアウォールやプロキシの設定',
          ].join('\n'),
        );
      });
    });

    describe('Timeout errors (kind === "timeout")', () => {
      it('localizes TIMEOUT (fetcher timeout)', () => {
        const failure: SnapshotOperationFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'timeout',
          code: 'TIMEOUT',
          message: 'Request timeout',
          details: {
            req: { method: 'GET', url: 'https://api.example.com' },
          },
        };

        expect(localizeSnapshotOperationError(failure)).toBe(
          'リクエストがタイムアウトしました。ネットワーク接続を確認してください。',
        );
      });
    });

    describe('Abort errors (kind === "abort")', () => {
      it('localizes ABORTED (request cancelled)', () => {
        const failure: SnapshotOperationFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'abort',
          code: 'ABORTED',
          message: 'Request aborted',
          details: {
            req: { method: 'GET', url: 'https://api.example.com' },
          },
        };

        expect(localizeSnapshotOperationError(failure)).toBe(
          'リクエストがキャンセルされました。',
        );
      });
    });
  });

  describe('store errors (origin === "store")', () => {
    it('localizes STORE_CAPACITY_EXCEEDED', () => {
      const failure: SnapshotOperationFailure = {
        ok: false,
        origin: 'store',
        kind: 'storage_limit',
        code: 'STORE_CAPACITY_EXCEEDED',
        message: 'Data size exceeded limit',
        dataState: 'UNCHANGED',
      };

      expect(localizeSnapshotOperationError(failure)).toBe(
        'データサイズが制限を超えました。limitパラメータを減らしてください。',
      );
    });

    it('localizes STORE_SERIALIZATION_FAILED', () => {
      const failure: SnapshotOperationFailure = {
        ok: false,
        origin: 'store',
        kind: 'serialization',
        code: 'STORE_SERIALIZATION_FAILED',
        message: 'Serialization failed',
        dataState: 'UNCHANGED',
        cause: new Error('Cannot serialize circular structure'),
      };

      expect(localizeSnapshotOperationError(failure)).toBe(
        'データのシリアライズに失敗しました。データ形式に問題がある可能性があります。',
      );
    });

    it('localizes STORE_UNKNOWN', () => {
      const failure: SnapshotOperationFailure = {
        ok: false,
        origin: 'store',
        kind: 'unknown',
        code: 'STORE_UNKNOWN',
        message: 'Unexpected store error occurred',
        dataState: 'UNCHANGED',
      };

      expect(localizeSnapshotOperationError(failure)).toBe(
        'ストレージエラーが発生しました: Unexpected store error occurred',
      );
    });
  });

  describe('unknown origin errors (origin === "unknown")', () => {
    it('returns message for unknown origin errors', () => {
      const failure: SnapshotOperationFailure = {
        ok: false,
        origin: 'unknown',
        message: 'Something unexpected happened',
      };

      expect(localizeSnapshotOperationError(failure)).toBe(
        'Something unexpected happened',
      );
    });
  });

  describe('parseFetcherSnapshotFailure utility', () => {
    it('handles HTTP errors correctly', () => {
      const failure: SnapshotOperationFailure = {
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
        'APIトークンが無効です。設定を確認してください。',
      );
    });

    it('handles CORS errors correctly', () => {
      const failure: SnapshotOperationFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'cors',
        code: 'CORS_BLOCKED',
        message: 'CORS blocked',
        details: {
          req: { method: 'GET', url: 'https://api.example.com' },
        },
      };

      expect(parseFetcherSnapshotFailure(failure)).toContain(
        'APIサーバーとの通信がCORSポリシーによりブロックされました。',
      );
    });

    it('handles network errors correctly', () => {
      const failure: SnapshotOperationFailure = {
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
        'サーバーに接続できませんでした。サーバーが起動しているか確認してください。',
      );
    });

    it('falls back to message for unknown fetcher errors', () => {
      const failure: SnapshotOperationFailure = {
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
        'Unknown fetcher error',
      );
    });
  });

  describe('parseStoreSnapshotFailure utility', () => {
    it('handles capacity exceeded errors correctly', () => {
      const failure: SnapshotOperationFailure = {
        ok: false,
        origin: 'store',
        kind: 'storage_limit',
        code: 'STORE_CAPACITY_EXCEEDED',
        message: 'Data size exceeded limit',
        dataState: 'UNCHANGED',
      };

      expect(parseStoreSnapshotFailure(failure)).toBe(
        'データサイズが制限を超えました。limitパラメータを減らしてください。',
      );
    });

    it('handles serialization errors correctly', () => {
      const failure: SnapshotOperationFailure = {
        ok: false,
        origin: 'store',
        kind: 'serialization',
        code: 'STORE_SERIALIZATION_FAILED',
        message: 'Serialization failed',
        dataState: 'UNCHANGED',
      };

      expect(parseStoreSnapshotFailure(failure)).toBe(
        'データのシリアライズに失敗しました。データ形式に問題がある可能性があります。',
      );
    });

    it('handles unknown store errors correctly', () => {
      const failure: SnapshotOperationFailure = {
        ok: false,
        origin: 'store',
        kind: 'unknown',
        code: 'STORE_UNKNOWN',
        message: 'Unexpected store error',
        dataState: 'UNCHANGED',
      };

      expect(parseStoreSnapshotFailure(failure)).toBe(
        'ストレージエラーが発生しました: Unexpected store error',
      );
    });

    it('handles unknown store errors correctly', () => {
      const failure: SnapshotOperationFailure = {
        ok: false,
        origin: 'store',
        kind: 'unknown',
        code: 'STORE_UNKNOWN',
        message: 'Unexpected store error',
        dataState: 'UNCHANGED',
      };

      expect(parseStoreSnapshotFailure(failure)).toBe(
        'ストレージエラーが発生しました: Unexpected store error',
      );
    });
  });

  describe('parseUnknownSnapshotFailure utility', () => {
    it('returns message for unknown origin errors', () => {
      const failure: SnapshotOperationFailure = {
        ok: false,
        origin: 'unknown',
        message: 'Unexpected error occurred',
      };

      expect(parseUnknownSnapshotFailure(failure)).toBe(
        'Unexpected error occurred',
      );
    });

    it('handles empty message', () => {
      const failure: SnapshotOperationFailure = {
        ok: false,
        origin: 'unknown',
        message: '',
      };

      expect(parseUnknownSnapshotFailure(failure)).toBe('');
    });
  });
});
