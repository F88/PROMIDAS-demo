import { useState } from "react";
import { getProtopediaRepository } from "../lib/protopedia-repository";

/**
 * Custom hook for retrieving all prototype IDs from the current snapshot.
 *
 * **DO NOT REMOVE**: This hook demonstrates the getPrototypeIdsFromSnapshot() API.
 * Console logs are intentionally included for demo site debugging.
 */
export function usePrototypeIds() {
  const [ids, setIds] = useState<readonly number[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIds = async () => {
    setLoading(true);
    setError(null);

    try {
      const repo = getProtopediaRepository();
      const result = await repo.getPrototypeIdsFromSnapshot();

      console.debug("[usePrototypeIds] Fetched prototype IDs", {
        count: result.length,
        sample: result.slice(0, 10),
      });

      setIds(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("[usePrototypeIds] Error fetching IDs", err);
      setError(message);
      setIds(null);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setIds(null);
    setError(null);
  };

  return { ids, loading, error, fetchIds, clear };
}
