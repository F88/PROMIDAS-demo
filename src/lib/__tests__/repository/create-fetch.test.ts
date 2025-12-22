/**
 * @file Unit tests for the `createFetch` wrapper factory.
 */

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

  it('forwards RequestInit.headers object without changes', async () => {
    const wrappedFetch = createFetch();

    const headersObject = {
      'x-client-user-agent': 'promidas-demo',
      authorization: 'Bearer test',
    };

    await wrappedFetch('https://example.com', {
      headers: headersObject,
    });

    const fetchMock = globalThis.fetch as unknown as {
      mock: { calls: Array<readonly [unknown, RequestInit | undefined]> };
    };

    const init = fetchMock.mock.calls[0]?.[1];
    if (!init) {
      throw new Error('Expected fetch to be called with init');
    }

    expect(init.headers).toBe(headersObject);
  });

  it('forwards a Headers instance without mutation', async () => {
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
    expect(passedHeaders).toBe(originalHeaders);
  });

  it('forwards undefined init', async () => {
    const wrappedFetch = createFetch();

    await wrappedFetch('https://example.com');

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    const fetchMock = globalThis.fetch as unknown as {
      mock: { calls: Array<readonly [unknown, RequestInit | undefined]> };
    };

    const init = fetchMock.mock.calls[0]?.[1];
    expect(init).toBeUndefined();
  });
});
