import { describe, expect, it } from 'vitest';
import { localizeSnapshotOperationError } from '../snapshot-error-utils';

describe('localizeSnapshotOperationError', () => {
  it('returns null for null input', () => {
    expect(localizeSnapshotOperationError(null)).toBeNull();
  });

  it('returns null for blank input', () => {
    expect(localizeSnapshotOperationError('   ')).toBeNull();
  });

  it('localizes missing token error', () => {
    expect(
      localizeSnapshotOperationError(
        'API token is not set. Please configure it in Settings.\n',
      ),
    ).toBe('APIトークンが設定されていません');
  });

  it('localizes NETWORK_ERROR failures from fetch', () => {
    const raw = JSON.stringify({
      ok: false,
      error: 'Failed to fetch',
      code: 'NETWORK_ERROR',
    });

    expect(localizeSnapshotOperationError(raw)).toBe(
      [
        '通信に失敗しました。次のような原因が考えられます。',
        '- APIトークンが未設定、または無効',
        '- ネットワークがオフライン',
        '- サーバが一時的に利用できない',
        '(ProtoPedia API)',
        '注: ProtoPedia APIがAccess-Control-Allow-Originを返さない場合、ブラウザ側で401を判定できず通信失敗として表示されます。',
      ].join('\n'),
    );
  });

  it('falls back to trimmed original string for other errors', () => {
    expect(localizeSnapshotOperationError('  Something happened  ')).toBe(
      'Something happened',
    );
  });
});
