import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '@mui/material';
import { ActionButton } from './action-button';

const meta = {
  title: 'Common/ActionButton',
  component: ActionButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: '実行',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'クリア',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: '削除',
  },
};

export const Disabled: Story = {
  args: {
    children: '実行',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: '実行',
    loading: true,
  },
};

export const LoadingSecondary: Story = {
  args: {
    variant: 'secondary',
    children: 'クリア',
    loading: true,
  },
};

export const Small: Story = {
  args: {
    children: '実行',
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    children: '実行',
    size: 'large',
  },
};

export const AllVariants: Story = {
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <ActionButton variant="primary">Primary</ActionButton>
        <ActionButton variant="secondary">Secondary</ActionButton>
        <ActionButton variant="danger">Danger</ActionButton>
      </Stack>
      <Stack direction="row" spacing={2}>
        <ActionButton variant="primary" disabled>
          Disabled
        </ActionButton>
        <ActionButton variant="secondary" disabled>
          Disabled
        </ActionButton>
        <ActionButton variant="danger" disabled>
          Disabled
        </ActionButton>
      </Stack>
      <Stack direction="row" spacing={2}>
        <ActionButton variant="primary" loading>
          Loading
        </ActionButton>
        <ActionButton variant="secondary" loading>
          Loading
        </ActionButton>
        <ActionButton variant="danger" loading>
          Loading
        </ActionButton>
      </Stack>
    </Stack>
  ),
};

export const WithIcon: Story = {
  args: {
    children: <>⚡ 実行</>,
  },
};

/**
 * Full width button
 */
export const FullWidth: Story = {
  args: {
    children: '実行',
    fullWidth: true,
  },
};

/**
 * Button with onClick handler demonstration
 */
export const WithClickHandler: Story = {
  args: {
    children: 'Click Me',
    onClick: () => alert('Button clicked!'),
  },
};

/**
 * All button sizes comparison
 */
export const AllSizes: Story = {
  render: () => (
    <Stack spacing={2}>
      <ActionButton size="small">Small Button</ActionButton>
      <ActionButton size="medium">Medium Button</ActionButton>
      <ActionButton size="large">Large Button</ActionButton>
    </Stack>
  ),
};
