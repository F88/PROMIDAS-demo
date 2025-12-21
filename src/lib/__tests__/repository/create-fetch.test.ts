import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { createFetch } from '../../repository/create-fetch';

describe('createFetch', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn(async () => {
      return { ok: true } as unknown as Response;
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('removes x-client-user-agent header', async () => {
    const wrappedFetch = createFetch();

    await wrappedFetch('https://example.com', {
      headers: {
        'x-client-user-agent': 'promidas-demo',
        authorization: 'Bearer test',
      },
    });

    const fetchMock = globalThis.fetch as unknown as {
      mock: { calls: Array<readonly [unknown, RequestInit | undefined]> };
    };

    const init = fetchMock.mock.calls[0]?.[1];
    if (!init) {
      throw new Error('Expected fetch to be called with init');
    }

    const headers = init.headers;
    if (!(headers instanceof Headers)) {
      throw new Error('Expected fetch init.headers to be a Headers instance');
    }

    expect(headers.has('x-client-user-agent')).toBe(false);
    expect(headers.get('authorization')).toBe('Bearer test');
  });

  it('does not mutate the original Headers instance', async () => {
    const wrappedFetch = createFetch();

    const originalHeaders = new Headers({
      'x-client-user-agent': 'promidas-demo',
      authorization: 'Bearer test',
    });

    await wrappedFetch('https://example.com', { headers: originalHeaders });

    expect(originalHeaders.has('x-client-user-agent')).toBe(true);
    expect(originalHeaders.get('authorization')).toBe('Bearer test');

    const fetchMock = globalThis.fetch as unknown as {
      mock: { calls: Array<readonly [unknown, RequestInit | undefined]> };
    };

    const init = fetchMock.mock.calls[0]?.[1];
    if (!init) {
      throw new Error('Expected fetch to be called with init');
    }

    const passedHeaders = init.headers;
    if (!(passedHeaders instanceof Headers)) {
      throw new Error('Expected fetch init.headers to be a Headers instance');
    }

    expect(passedHeaders.has('x-client-user-agent')).toBe(false);
    expect(passedHeaders.get('authorization')).toBe('Bearer test');
  });

  it('works when init is undefined', async () => {
    const wrappedFetch = createFetch();

    await wrappedFetch('https://example.com');

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    const fetchMock = globalThis.fetch as unknown as {
      mock: { calls: Array<readonly [unknown, RequestInit | undefined]> };
    };

    const init = fetchMock.mock.calls[0]?.[1];
    if (!init) {
      throw new Error('Expected fetch to be called with init');
    }

    const headers = init.headers;
    expect(headers instanceof Headers).toBe(true);
  });
});
