import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataFlowIndicator } from './data-flow-indicator';

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
