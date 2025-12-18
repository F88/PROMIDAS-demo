import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography, Stack, Button } from '@mui/material';
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
