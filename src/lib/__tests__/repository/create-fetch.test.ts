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

  describe('argument forwarding', () => {
    it('forwards a URL input', async () => {
      const wrappedFetch = createFetch();

      const url = new URL('https://example.com/path');
      await wrappedFetch(url);

      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(globalThis.fetch).toHaveBeenCalledWith(url, undefined);
    });

    it('forwards a Request input', async () => {
      const wrappedFetch = createFetch();

      const request = new Request('https://example.com/request', {
        method: 'POST',
      });
      await wrappedFetch(request);

      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(globalThis.fetch).toHaveBeenCalledWith(request, undefined);
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

    it('forwards the init object without cloning', async () => {
      const wrappedFetch = createFetch();

      const init: RequestInit = {
        method: 'GET',
        headers: {
          authorization: 'Bearer test',
        },
      };

      await wrappedFetch('https://example.com', init);

      const fetchMock = globalThis.fetch as unknown as {
        mock: { calls: Array<readonly [unknown, RequestInit | undefined]> };
      };

      const passedInit = fetchMock.mock.calls[0]?.[1];
      expect(passedInit).toBe(init);
    });
  });

  describe('header behavior', () => {
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
  });

  describe('return values and errors', () => {
    it('returns the underlying fetch response', async () => {
      const wrappedFetch = createFetch();

      const response = { ok: true } as unknown as Response;
      globalThis.fetch = vi.fn(async () => response) as unknown as typeof fetch;

      const result = await wrappedFetch('https://example.com');
      expect(result).toBe(response);
    });

    it('propagates errors from the underlying fetch', async () => {
      const wrappedFetch = createFetch();

      const error = new Error('fetch failed');
      globalThis.fetch = vi.fn(async () => {
        throw error;
      }) as unknown as typeof fetch;

      await expect(wrappedFetch('https://example.com')).rejects.toBe(error);
    });
  });
});
