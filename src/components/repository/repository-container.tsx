import { SetupSnapshot } from './setup-snapshot';
import { RefreshSnapshot } from './refresh-snapshot';
import { RandomPrototype } from './random-prototype';
import { SearchById } from './search-by-id';
import { SingleRandom } from './single-random';
import type { Prototype } from '@f88/promidas';
import { PrototypeIds } from './prototype-ids';
import { AllPrototypes } from './all-prototypes';
import { Analysis } from './analysis';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import type { NormalizedPrototype } from '@f88/promidas/types';

interface RepositoryContainerProps {
  isActive?: boolean;

  // Snapshot Management
  snapshotLimit: string;
  setSnapshotLimit: (value: string) => void;
  snapshotOffset: string;
  setSnapshotOffset: (value: string) => void;
  snapshotUserNm: string;
  setSnapshotUserNm: (value: string) => void;
  snapshotTagNm: string;
  setSnapshotTagNm: (value: string) => void;
  snapshotEventNm: string;
  setSnapshotEventNm: (value: string) => void;
  snapshotMaterialNm: string;
  setSnapshotMaterialNm: (value: string) => void;
  snapshotLoading: boolean;
  snapshotSuccess: string | null;
  snapshotError: string | null;
  handleSetupSnapshot: () => void;
  handleResetSnapshotForm: () => void;
  handleRefreshSnapshot: () => void;

  // Random Prototype
  randomPrototype: Prototype | null;
  randomLoading: boolean;
  randomError: string | null;
  handleFetchRandom: () => void;
  clearRandom: () => void;

  // Search By ID
  searchId: string;
  setSearchId: (value: string) => void;
  searchPrototype: Prototype | null;
  searchLoading: boolean;
  searchError: string | null;
  handleSearch: () => void;
  clearSearch: () => void;

  // Single Random
  singleRandomPrototype: Prototype | null;
  singleRandomLoading: boolean;
  singleRandomError: string | null;
  fetchSingleRandom: () => void;
  clearSingleRandom: () => void;

  // Prototype IDs
  prototypeIds: readonly number[] | null;
  idsLoading: boolean;
  idsError: string | null;
  fetchIds: () => void;
  clearIds: () => void;

  // All Prototypes
  allPrototypes: NormalizedPrototype[] | null;
  allLoading: boolean;
  allError: string | null;
  fetchAll: () => void;
  clearAll: () => void;

  // Analysis
  analysis: { min: number | null; max: number | null } | null;
  analysisLoading: boolean;
  analysisError: string | null;
  analyze: () => void;
  clearAnalysis: () => void;

  // Common
  stats: PrototypeInMemoryStats | null;
}

export function RepositoryContainer({
  isActive = false,
  snapshotLimit,
  setSnapshotLimit,
  snapshotOffset,
  setSnapshotOffset,
  snapshotUserNm,
  setSnapshotUserNm,
  snapshotTagNm,
  setSnapshotTagNm,
  snapshotEventNm,
  setSnapshotEventNm,
  snapshotMaterialNm,
  setSnapshotMaterialNm,
  snapshotLoading,
  snapshotSuccess,
  snapshotError,
  handleSetupSnapshot,
  handleResetSnapshotForm,
  handleRefreshSnapshot,
  randomPrototype,
  randomLoading,
  randomError,
  handleFetchRandom,
  clearRandom,
  searchId,
  setSearchId,
  searchPrototype,
  searchLoading,
  searchError,
  handleSearch,
  clearSearch,
  singleRandomPrototype,
  singleRandomLoading,
  singleRandomError,
  fetchSingleRandom,
  clearSingleRandom,
  prototypeIds,
  idsLoading,
  idsError,
  fetchIds,
  clearIds,
  allPrototypes,
  allLoading,
  allError,
  fetchAll,
  clearAll,
  analysis,
  analysisLoading,
  analysisError,
  analyze,
  clearAnalysis,
  stats,
}: RepositoryContainerProps) {
  return (
    <div
      className={`container-wrapper repository-container ${
        isActive ? 'active' : ''
      }`}
    >
      <span className="container-label">Repository</span>

      {/* Setup Snapshot */}
      <SetupSnapshot
        snapshotLimit={snapshotLimit}
        setSnapshotLimit={setSnapshotLimit}
        snapshotOffset={snapshotOffset}
        setSnapshotOffset={setSnapshotOffset}
        snapshotUserNm={snapshotUserNm}
        setSnapshotUserNm={setSnapshotUserNm}
        snapshotTagNm={snapshotTagNm}
        setSnapshotTagNm={setSnapshotTagNm}
        snapshotEventNm={snapshotEventNm}
        setSnapshotEventNm={setSnapshotEventNm}
        snapshotMaterialNm={snapshotMaterialNm}
        setSnapshotMaterialNm={setSnapshotMaterialNm}
        snapshotLoading={snapshotLoading}
        snapshotSuccess={snapshotSuccess}
        snapshotError={snapshotError}
        handleSetupSnapshot={handleSetupSnapshot}
        handleResetSnapshotForm={handleResetSnapshotForm}
      />

      {/* Refresh Snapshot */}
      <RefreshSnapshot
        snapshotLoading={snapshotLoading}
        stats={stats}
        handleRefreshSnapshot={handleRefreshSnapshot}
      />

      <div className="repository-grid">
        <RandomPrototype
          randomPrototype={randomPrototype}
          randomLoading={randomLoading}
          randomError={randomError}
          stats={stats}
          handleFetchRandom={handleFetchRandom}
          clearRandom={clearRandom}
        />

        <SearchById
          searchId={searchId}
          setSearchId={setSearchId}
          searchPrototype={searchPrototype}
          searchLoading={searchLoading}
          searchError={searchError}
          stats={stats}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
        />

        <SingleRandom
          singleRandomPrototype={singleRandomPrototype}
          singleRandomLoading={singleRandomLoading}
          singleRandomError={singleRandomError}
          stats={stats}
          fetchSingleRandom={fetchSingleRandom}
          clearSingleRandom={clearSingleRandom}
        />

        <PrototypeIds
          prototypeIds={prototypeIds}
          idsLoading={idsLoading}
          idsError={idsError}
          stats={stats}
          fetchIds={fetchIds}
          clearIds={clearIds}
        />

        <AllPrototypes
          allPrototypes={allPrototypes}
          allLoading={allLoading}
          allError={allError}
          stats={stats}
          fetchAll={fetchAll}
          clearAll={clearAll}
        />

        <Analysis
          analysis={analysis}
          analysisLoading={analysisLoading}
          analysisError={analysisError}
          stats={stats}
          analyze={analyze}
          clearAnalysis={clearAnalysis}
        />
      </div>
    </div>
  );
}
