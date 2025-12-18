import type { PrototypeInMemoryStats } from "@f88/promidas";

export type StoreState = "not-stored" | "stored" | "expired";

export function getStoreState(
  stats: PrototypeInMemoryStats | null
): StoreState {
  const notStored = !stats || stats.cachedAt === null;
  if (notStored) {
    return "not-stored";
  }
  return stats.isExpired ? "expired" : "stored";
}
