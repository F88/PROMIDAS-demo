import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatsDashboard } from './stats-dashboard';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import type { StoreConfig } from '../../hooks/use-config';

const meta = {
  title: 'Components/StatsDashboard',
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

export const Expired: Story = {
  args: {
    stats: createMockStats({
      remainingTtlMs: 0,
      isExpired: true,
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
