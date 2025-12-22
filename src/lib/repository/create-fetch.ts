/**
 * @file Fetch wrapper factory used by the demo repository configuration.
 *
 * This module intentionally keeps the wrapper minimal: it forwards arguments to
 * `globalThis.fetch` without modifying headers or request options.
 */

/**
 * Type definition for a `fetch`-compatible function.
 */
export type FetchFunction = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

/**
 * Creates a `fetch` function wrapper.
 *
 * The returned function is a thin passthrough to `globalThis.fetch`. Keeping it
 * as a factory makes it easy to extend (or inject a different fetch) in the
 * future without changing call sites.
 */
export function createFetch(): FetchFunction {
  return async (input, init) => {
    return globalThis.fetch(input, init);
  };
}
