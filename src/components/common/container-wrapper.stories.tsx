import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography, Stack, Button, TextField } from '@mui/material';
import { ContainerWrapper } from './container-wrapper';

const meta = {
  title: 'Common/ContainerWrapper',
  component: ContainerWrapper,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ContainerWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fetcher: Story = {
  args: {
    type: 'fetcher',
    label: 'Fetcher',
    children: (
      <Typography>Fetcher container with green border color.</Typography>
    ),
  },
};

export const Store: Story = {
  args: {
    type: 'store',
    label: 'Store',
    children: (
      <Typography>Store container with orange border color.</Typography>
    ),
  },
};

export const Repository: Story = {
  args: {
    type: 'repository',
    label: 'Repository',
    children: (
      <Typography>Repository container with purple border color.</Typography>
    ),
  },
};

export const Config: Story = {
  args: {
    type: 'config',
    label: 'Config',
    children: (
      <Typography>Config container with violet border color.</Typography>
    ),
  },
};

export const Active: Story = {
  args: {
    type: 'repository',
    label: 'Repository',
    isActive: true,
    children: (
      <Typography>Active state with glow animation (check CSS).</Typography>
    ),
  },
};

export const WithContent: Story = {
  args: {
    type: 'repository',
    label: 'Repository',
    children: (
      <Stack spacing={2}>
        <Typography variant="h6">setupSnapshot()</Typography>
        <Typography variant="body2" color="text.secondary">
          Initialize the in-memory snapshot
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained">実行</Button>
          <Button variant="outlined">リセット</Button>
        </Stack>
      </Stack>
    ),
  },
};

export const AllTypes: Story = {
  args: {
    type: 'repository',
    label: 'All Types',
    children: null,
  },
  render: () => (
    <Stack spacing={3}>
      <ContainerWrapper type="fetcher" label="Fetcher">
        <Typography>Fetcher container content</Typography>
      </ContainerWrapper>
      <ContainerWrapper type="store" label="Store">
        <Typography>Store container content</Typography>
      </ContainerWrapper>
      <ContainerWrapper type="repository" label="Repository">
        <Typography>Repository container content</Typography>
      </ContainerWrapper>
      <ContainerWrapper type="config" label="Config">
        <Typography>Config container content</Typography>
      </ContainerWrapper>
    </Stack>
  ),
};

/**
 * Mix of active and inactive containers
 */
export const MixedStates: Story = {
  args: {
    type: 'repository',
    label: 'Mixed States',
    children: null,
  },
  render: () => (
    <Stack spacing={3}>
      <ContainerWrapper type="fetcher" label="Fetcher" isActive={true}>
        <Typography>Active fetcher container</Typography>
      </ContainerWrapper>
      <ContainerWrapper type="store" label="Store" isActive={false}>
        <Typography>Inactive store container</Typography>
      </ContainerWrapper>
      <ContainerWrapper type="repository" label="Repository" isActive={true}>
        <Typography>Active repository container</Typography>
      </ContainerWrapper>
      <ContainerWrapper type="config" label="Config" isActive={false}>
        <Typography>Inactive config container</Typography>
      </ContainerWrapper>
    </Stack>
  ),
};

/**
 * Container with no content
 */
export const EmptyContainer: Story = {
  args: {
    type: 'repository',
    label: 'Empty Repository',
    children: null,
  },
};

/**
 * Container with complex nested content
 */
export const ComplexContent: Story = {
  args: {
    type: 'repository',
    label: 'Complex Repository',
    children: (
      <Stack spacing={2}>
        <Typography variant="h6">setupSnapshot()</Typography>
        <Typography variant="body2" color="text.secondary">
          Initialize the in-memory snapshot with filters
        </Typography>
        <Stack spacing={1}>
          <TextField label="Limit" size="small" defaultValue="10" />
          <TextField label="Offset" size="small" defaultValue="0" />
          <TextField label="User Name" size="small" />
          <TextField label="Tag Name" size="small" />
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button variant="contained">実行</Button>
          <Button variant="outlined">リセット</Button>
          <Button variant="text">クリア</Button>
        </Stack>
      </Stack>
    ),
  },
};
