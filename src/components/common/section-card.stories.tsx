import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Button, TextField } from '@mui/material';
import { SectionCard } from './section-card';

const meta = {
  title: 'Common/SectionCard',
  component: SectionCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SectionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Section Title',
    children: <p>This is the content of the section card.</p>,
  },
};

export const WithDescription: Story = {
  args: {
    title: 'Section with Description',
    description:
      'This is a helpful description that explains what this section does.',
    children: <p>Section content goes here.</p>,
  },
};

export const WithCategory: Story = {
  args: {
    title: 'Section with Category',
    category: 'Snapshot',
    children: <p>This section has a category badge.</p>,
  },
};

export const Complete: Story = {
  args: {
    title: 'Complete Section Card',
    description:
      'This card has all optional props: category, description, and content.',
    category: 'Query',
    children: <p>Full featured section card example.</p>,
  },
};

export const WithForm: Story = {
  args: {
    title: 'Form Section',
    description: 'Example with form elements',
    category: 'Input',
    children: (
      <Stack spacing={2}>
        <TextField label="Name" size="small" fullWidth />
        <TextField label="Email" size="small" fullWidth />
        <Button variant="contained">Submit</Button>
      </Stack>
    ),
  },
};

export const WithButtons: Story = {
  args: {
    title: 'getRandomPrototypeFromSnapshot()',
    description: 'Retrieve a single random prototype',
    category: 'Query',
    children: (
      <Stack direction="row" spacing={1}>
        <Button variant="contained">実行</Button>
        <Button variant="outlined">クリア</Button>
      </Stack>
    ),
  },
};

export const LongContent: Story = {
  args: {
    title: 'Section with Long Content',
    description:
      'This section contains a lot of content to demonstrate how the card handles overflow.',
    category: 'Example',
    children: (
      <Stack spacing={2}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur.
        </p>
      </Stack>
    ),
  },
};

export const MinimalContent: Story = {
  args: {
    title: 'Minimal Section',
    children: <Button variant="contained">Single Action</Button>,
  },
};
