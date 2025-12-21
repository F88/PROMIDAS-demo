export type FetchFunction = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export function createFetch(): FetchFunction {
  return async (input, init) => {
    // Workaround for CORS issue with x-client-user-agent header.
    //
    // See: https://github.com/F88/promidas/issues/55
    const headers = new Headers(init?.headers);
    headers.delete('x-client-user-agent');
    // headers.append('x-client-user-agent', 'hogex');

    return globalThis.fetch(input, { ...init, headers });
  };
}
