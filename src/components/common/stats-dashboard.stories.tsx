import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatsDashboard } from './stats-dashboard';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import type { StoreConfig } from '../../hooks/use-config';

const meta = {
  title: 'Common/StatsDashboard',
  component: StatsDashboard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StatsDashboard>;

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

// State-based stories
export const NotStored: Story = {
  args: {
    stats: null,
    config: mockConfig,
  },
};

export const Stored: Story = {
  args: {
    stats: createMockStats(),
    config: mockConfig,
  },
};

export const Expired: Story = {
  args: {
    stats: createMockStats({
      remainingTtlMs: 0,
      isExpired: true,
    }),
    config: mockConfig,
  },
};

// TTL pattern stories
export const Ttl30Seconds: Story = {
  args: {
    stats: createMockStats({
      remainingTtlMs: 25000, // 25s remaining
    }),
    config: {
      ...mockConfig,
      ttlMs: 30000, // 30s
    },
  },
};

export const Ttl60Seconds: Story = {
  args: {
    stats: createMockStats({
      remainingTtlMs: 45000, // 45s remaining
    }),
    config: {
      ...mockConfig,
      ttlMs: 60000, // 60s
    },
  },
};

export const Ttl10Minutes: Story = {
  args: {
    stats: createMockStats({
      remainingTtlMs: 480000, // 8min remaining
    }),
    config: {
      ...mockConfig,
      ttlMs: 600000, // 10min
    },
  },
};

export const Ttl30Minutes: Story = {
  args: {
    stats: createMockStats({
      remainingTtlMs: 1500000, // 25min remaining
    }),
    config: {
      ...mockConfig,
      ttlMs: 1800000, // 30min
    },
  },
};

// Memory size pattern stories
export const Memory5MB: Story = {
  args: {
    stats: createMockStats({
      dataSizeBytes: 2621440, // 2.5 MB (50%)
      size: 100,
    }),
    config: {
      ...mockConfig,
      maxDataSizeBytes: 5242880, // 5 MB
    },
  },
};

export const Memory10MB: Story = {
  args: {
    stats: createMockStats({
      dataSizeBytes: 5242880, // 5 MB (50%)
      size: 1000,
    }),
    config: {
      ...mockConfig,
      maxDataSizeBytes: 10485760, // 10 MB
    },
  },
};

export const Memory30MB: Story = {
  args: {
    stats: createMockStats({
      dataSizeBytes: 15728640, // 15 MB (50%)
      size: 10000,
    }),
    config: {
      ...mockConfig,
      maxDataSizeBytes: 31457280, // 30 MB
    },
  },
};

// Additional scenarios
export const HighMemoryUsage: Story = {
  args: {
    stats: createMockStats({
      dataSizeBytes: 8388608, // 8 MB (80%)
    }),
    config: mockConfig,
  },
};

export const LowTtl: Story = {
  args: {
    stats: createMockStats({
      remainingTtlMs: 5000, // 5s (16.7%)
    }),
    config: mockConfig,
  },
};

export const Refreshing: Story = {
  args: {
    stats: createMockStats({
      refreshInFlight: true,
    }),
    config: mockConfig,
  },
};

export const MidTtl: Story = {
  args: {
    stats: createMockStats({
      remainingTtlMs: 12000, // 12s (40%)
    }),
    config: mockConfig,
  },
};

export const MidMemory: Story = {
  args: {
    stats: createMockStats({
      dataSizeBytes: 6291456, // 6 MB (60%)
    }),
    config: mockConfig,
  },
};

export const NoConfig: Story = {
  args: {
    stats: createMockStats(),
    config: null,
  },
};

export const LargeSizeAndLongTtl: Story = {
  args: {
    stats: createMockStats({
      size: 10000,
      remainingTtlMs: 900000, // 900s remaining
    }),
    config: {
      ttlMs: 1000000, // 1000s
      maxDataSizeBytes: 10485760,
      logLevel: 'info',
    },
  },
};

/**
 * Very small cache with minimal data
 */
export const MinimalCache: Story = {
  args: {
    stats: createMockStats({
      size: 1,
      dataSizeBytes: 1024, // 1 KB
      remainingTtlMs: 5000,
    }),
    config: mockConfig,
  },
};

/**
 * Maximum capacity reached
 */
export const MaxCapacity: Story = {
  args: {
    stats: createMockStats({
      size: 50000,
      dataSizeBytes: 10485760, // 10 MB (100%)
    }),
    config: mockConfig,
  },
};

/**
 * Nearly expired (critical TTL)
 */
export const CriticalTtl: Story = {
  args: {
    stats: createMockStats({
      remainingTtlMs: 1000, // 1s (3.3%)
    }),
    config: mockConfig,
  },
};

/**
 * Fresh cache (just created)
 */
export const FreshCache: Story = {
  args: {
    stats: createMockStats({
      cachedAt: new Date(),
      remainingTtlMs: 30000, // 30s (100%)
    }),
    config: mockConfig,
  },
};

/**
 * Alternative log level configurations
 */
export const LogLevelDebug: Story = {
  args: {
    stats: createMockStats(),
    config: {
      ...mockConfig,
      logLevel: 'debug',
    },
  },
};

export const LogLevelWarn: Story = {
  args: {
    stats: createMockStats(),
    config: {
      ...mockConfig,
      logLevel: 'warn',
    },
  },
};

export const LogLevelError: Story = {
  args: {
    stats: createMockStats(),
    config: {
      ...mockConfig,
      logLevel: 'error',
    },
  },
};
