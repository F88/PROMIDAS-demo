/**
 * @fileoverview Custom hook for managing data flow indicator states and controls.
 *
 * This hook provides centralized management of visual indicators that show
 * the flow of data through different system modules:
 * - Fetcher: API fetch operations (🌐)
 * - Store: In-memory data storage (🏪)
 * - Repository: Repository operations (📦)
 * - Display: UI display state (🖥️)
 *
 * The hook implements two timing sequences:
 * - handleGetStoreInfo: For store info retrieval (getConfig/getStats)
 * - handleUseSnapshot: For snapshot usage operations (query/analysis)
 *
 * Both sequences follow the data flow pattern:
 * Repository (0-300ms) → Store (100-200ms) → Display (300-400ms)
 *
 * Note: handleGetStoreInfo and handleUseSnapshot intentionally duplicate the
 * same timing logic. This keeps each flow explicit/readable and allows future
 * divergence without coupling unrelated behaviors. Please avoid extracting a
 * shared helper unless both flows must change in lockstep.
 */

import { useState } from 'react';

/**
 * Custom hook for managing data flow indicator states and controls
 *
 * Manages the visual indicators for:
 * - Fetcher: API fetch operations
 * - Store: In-memory data storage
 * - Repository: Repository operations
 * - Display: UI display state
 */
export function useDataFlowIndicators() {
  const [isFetcherActive, setIsFetcherActive] = useState(false);
  const [isStoreActive, setIsStoreActive] = useState(false);
  const [isRepositoryActive, setIsRepositoryActive] = useState(false);
  const [isDisplayActive, setIsDisplayActive] = useState(false);

  /**
   * Activates indicators for store info retrieval operations (getConfig/getStats)
   *
   * Timeline: Repository (0-300ms), Store (100-200ms), Display (300-400ms)
   *
   * Note: This intentionally duplicates handleUseSnapshot's timing sequence to
   * keep the store-info flow explicit and independently editable.
   *
   * @param isActive - Whether to activate the indicator sequence
   */
  const handleGetStoreInfo = (isActive: boolean) => {
    if (isActive) {
      console.info('[Repository Event] Store info retrieval started.');

      // Visualize active modules: Repository is active throughout, Store is active briefly
      // 1. Repository lights up immediately (stays on for 300ms)
      setIsRepositoryActive(true);

      // 2. Store lights up after 100ms (stays on for 100ms)
      setTimeout(() => {
        setIsStoreActive(true);
      }, 100);

      // 3. Store turns off after 200ms total
      setTimeout(() => {
        setIsStoreActive(false);
      }, 200);

      // 4. Repository turns off after 300ms total
      setTimeout(() => {
        setIsRepositoryActive(false);
      }, 300);

      // 5. Display lights up after 300ms
      setTimeout(() => {
        setIsDisplayActive(true);
      }, 300);

      // 6. Display turns off after 400ms total
      setTimeout(() => {
        setIsDisplayActive(false);
      }, 400);
    }
  };

  /**
   * Activates indicators for snapshot usage operations (query/analysis)
   *
   * Timeline: Repository (0-300ms), Store (100-200ms), Display (300-400ms)
   *
   * Note: This intentionally duplicates handleGetStoreInfo's timing sequence to
   * keep the snapshot-usage flow explicit and independently editable.
   *
   * @param isActive - Whether to activate the indicator sequence
   */
  const handleUseSnapshot = (isActive: boolean) => {
    if (isActive) {
      console.info('[Repository Event] Snapshot usage started.');

      // Visualize active modules: Repository is active throughout, Store is active briefly
      // 1. Repository lights up immediately (stays on for 300ms)
      setIsRepositoryActive(true);

      // 2. Store lights up after 100ms (stays on for 100ms)
      setTimeout(() => {
        setIsStoreActive(true);
      }, 100);

      // 3. Store turns off after 200ms total
      setTimeout(() => {
        setIsStoreActive(false);
      }, 200);

      // 4. Repository turns off after 300ms total
      setTimeout(() => {
        setIsRepositoryActive(false);
      }, 300);

      // 5. Display lights up after 300ms
      setTimeout(() => {
        setIsDisplayActive(true);
      }, 300);

      // 6. Display turns off after 400ms total
      setTimeout(() => {
        setIsDisplayActive(false);
      }, 400);
    }
  };

  return {
    // States
    isFetcherActive,
    isStoreActive,
    isRepositoryActive,
    isDisplayActive,
    // State setters
    setIsFetcherActive,
    setIsStoreActive,
    setIsRepositoryActive,
    setIsDisplayActive,
    // Handlers
    handleGetStoreInfo,
    handleUseSnapshot,
  };
}
