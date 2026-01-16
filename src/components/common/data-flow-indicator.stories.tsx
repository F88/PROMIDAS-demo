import { DataFlowIndicator } from './data-flow-indicator';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Common/DataFlowIndicator',
  component: DataFlowIndicator,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
      ],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DataFlowIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllInactive: Story = {
  args: {
    isFetcherActive: false,
    isStoreActive: false,
    isRepositoryActive: false,
    isDisplayActive: false,
  },
};

export const AllActive: Story = {
  args: {
    isFetcherActive: true,
    isStoreActive: true,
    isRepositoryActive: true,
    isDisplayActive: true,
  },
};

export const FetcherActive: Story = {
  args: {
    isFetcherActive: true,
    isStoreActive: false,
    isRepositoryActive: false,
    isDisplayActive: false,
  },
};

export const FetcherAndStoreActive: Story = {
  args: {
    isFetcherActive: true,
    isStoreActive: true,
    isRepositoryActive: false,
    isDisplayActive: false,
  },
};

export const FetcherStoreRepositoryActive: Story = {
  args: {
    isFetcherActive: true,
    isStoreActive: true,
    isRepositoryActive: true,
    isDisplayActive: false,
  },
};

export const StoreActive: Story = {
  args: {
    isFetcherActive: false,
    isStoreActive: true,
    isRepositoryActive: false,
    isDisplayActive: false,
  },
};

export const RepositoryActive: Story = {
  args: {
    isFetcherActive: false,
    isStoreActive: false,
    isRepositoryActive: true,
    isDisplayActive: false,
  },
};

export const DisplayActive: Story = {
  args: {
    isFetcherActive: false,
    isStoreActive: false,
    isRepositoryActive: false,
    isDisplayActive: true,
  },
};

/**
 * Progressive activation pattern
 */
export const ProgressiveActivation: Story = {
  args: {
    isFetcherActive: true,
    isStoreActive: false,
    isRepositoryActive: false,
    isDisplayActive: false,
  },
};

/**
 * Only display is active (data visualization)
 */
export const OnlyDisplay: Story = {
  args: {
    isFetcherActive: false,
    isStoreActive: false,
    isRepositoryActive: false,
    isDisplayActive: true,
  },
};

/**
 * Store and Repository active (no fetching, no display)
 */
export const StoreAndRepository: Story = {
  args: {
    isFetcherActive: false,
    isStoreActive: true,
    isRepositoryActive: true,
    isDisplayActive: false,
  },
};

/**
 * Repository and Display active (query and display)
 */
export const RepositoryAndDisplay: Story = {
  args: {
    isFetcherActive: false,
    isStoreActive: false,
    isRepositoryActive: true,
    isDisplayActive: true,
  },
};
