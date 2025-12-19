import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppHeader } from './app-header';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import type { StoreConfig } from '../../hooks/use-config';

const meta = {
  title: 'Common/AppHeader',
  component: AppHeader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockConfig: StoreConfig = {
  ttlMs: 30000,
  maxDataSizeBytes: 10485760, // 10 MB
  logLevel: 'info',
};

const createMockStats = (
  overrides?: Partial<PrototypeInMemoryStats>,
): PrototypeInMemoryStats => ({
  size: 100,
  dataSizeBytes: 1048576, // 1 MB
  cachedAt: new Date(Date.now() - 5000),
  remainingTtlMs: 25000,
  isExpired: false,
  refreshInFlight: false,
  ...overrides,
});

/**
 * Default header with stats
 */
export const Default: Story = {
  args: {
    stats: createMockStats(),
    config: mockConfig,
    dataFlowIndicator: {
      isFetcherActive: false,
      isStoreActive: false,
      isRepositoryActive: false,
      isDisplayActive: false,
    },
  },
};

/**
 * No data loaded yet
 */
export const NoData: Story = {
  args: {
    stats: null,
    config: null,
    dataFlowIndicator: {
      isFetcherActive: false,
      isStoreActive: false,
      isRepositoryActive: false,
      isDisplayActive: false,
    },
  },
};

/**
 * All components active (full data flow)
 */
export const AllActive: Story = {
  args: {
    stats: createMockStats(),
    config: mockConfig,
    dataFlowIndicator: {
      isFetcherActive: true,
      isStoreActive: true,
      isRepositoryActive: true,
      isDisplayActive: true,
    },
  },
};

/**
 * Fetcher active (data fetching in progress)
 */
export const FetcherActive: Story = {
  args: {
    stats: createMockStats(),
    config: mockConfig,
    dataFlowIndicator: {
      isFetcherActive: true,
      isStoreActive: false,
      isRepositoryActive: false,
      isDisplayActive: false,
    },
  },
};

/**
 * Store active (accessing cache)
 */
export const StoreActive: Story = {
  args: {
    stats: createMockStats(),
    config: mockConfig,
    dataFlowIndicator: {
      isFetcherActive: false,
      isStoreActive: true,
      isRepositoryActive: false,
      isDisplayActive: false,
    },
  },
};

/**
 * Repository active (querying data)
 */
export const RepositoryActive: Story = {
  args: {
    stats: createMockStats(),
    config: mockConfig,
    dataFlowIndicator: {
      isFetcherActive: false,
      isStoreActive: false,
      isRepositoryActive: true,
      isDisplayActive: false,
    },
  },
};

/**
 * Display active (showing results)
 */
export const DisplayActive: Story = {
  args: {
    stats: createMockStats(),
    config: mockConfig,
    dataFlowIndicator: {
      isFetcherActive: false,
      isStoreActive: false,
      isRepositoryActive: false,
      isDisplayActive: true,
    },
  },
};

/**
 * Fetcher and Store active (fetching and caching)
 */
export const FetcherAndStoreActive: Story = {
  args: {
    stats: createMockStats(),
    config: mockConfig,
    dataFlowIndicator: {
      isFetcherActive: true,
      isStoreActive: true,
      isRepositoryActive: false,
      isDisplayActive: false,
    },
  },
};

/**
 * Repository and Display active (query and display)
 */
export const RepositoryAndDisplay: Story = {
  args: {
    stats: createMockStats(),
    config: mockConfig,
    dataFlowIndicator: {
      isFetcherActive: false,
      isStoreActive: false,
      isRepositoryActive: true,
      isDisplayActive: true,
    },
  },
};

/**
 * Cache about to expire (low TTL)
 */
export const LowTtl: Story = {
  args: {
    stats: createMockStats({
      remainingTtlMs: 5000, // 5s (16.7%)
    }),
    config: mockConfig,
    dataFlowIndicator: {
      isFetcherActive: false,
      isStoreActive: false,
      isRepositoryActive: false,
      isDisplayActive: false,
    },
  },
};

/**
 * Cache expired
 */
export const Expired: Story = {
  args: {
    stats: createMockStats({
      remainingTtlMs: 0,
      isExpired: true,
    }),
    config: mockConfig,
    dataFlowIndicator: {
      isFetcherActive: false,
      isStoreActive: false,
      isRepositoryActive: false,
      isDisplayActive: false,
    },
  },
};
