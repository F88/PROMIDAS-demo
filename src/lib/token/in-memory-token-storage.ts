/**
 * @file In-memory storage for the ProtoPedia API token.
 *
 * The demo deliberately keeps the token out of Web Storage. `sessionStorage`
 * would survive a reload, but it is also written to the browser profile for
 * session restore, is readable by extension content scripts, and — because
 * GitHub Pages puts every project of an account on one origin — stays readable
 * after navigating the same tab to an unrelated page under that origin. Holding
 * the token in a module variable closes those paths; the cost is that a reload
 * discards it and the user has to enter it again.
 *
 * This is not a defence against XSS. Injected code can still reach the value
 * through React's fiber tree or by patching `globalThis.fetch` to read the
 * `Authorization` header, since the token is assembled in plain text whenever a
 * request goes out.
 *
 * `promidas-utils` ships session, local and environment backends but no
 * in-memory one, so this implements the exported `TokenStorage` interface
 * directly. The type annotation keeps it honest if that interface changes.
 */

import type { TokenStorage } from 'promidas-utils/token';

let token: string | null = null;

/**
 * Process-lifetime token storage shared across the app.
 *
 * Import this instance rather than constructing another one: React and the
 * repository singleton both need to observe the same value, and there is no
 * backing store to synchronise separate instances through.
 */
export const inMemoryTokenStorage: TokenStorage = {
  has: async () => token !== null,
  get: async () => token,
  save: async (newToken: string) => {
    token = newToken;
  },
  remove: async () => {
    token = null;
  },
};
