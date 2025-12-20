import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '@mui/material';
import { PrototypeIdAndName } from './prototype-id-and-name';

const meta = {
  title: 'Common/PrototypeIdAndName',
  component: PrototypeIdAndName,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PrototypeIdAndName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IdOnly: Story = {
  args: {
    id: 7917,
  },
};

export const WithName: Story = {
  args: {
    id: 7917,
    name: 'Sample Prototype',
  },
};

export const ShortName: Story = {
  args: {
    id: 123,
    name: 'AI Bot',
  },
};

export const LongName: Story = {
  args: {
    id: 456,
    name: 'Very Long Prototype Name That Should Be Truncated or Wrapped Properly',
  },
};

export const VeryLongName: Story = {
  args: {
    id: 999,
    name: 'This is an extremely long prototype name that should definitely be truncated or wrapped to fit within the available space without breaking the layout',
  },
};

export const JapaneseText: Story = {
  args: {
    id: 7917,
    name: '温度センサーを使ったIoTシステム',
  },
};

export const SpecialCharacters: Story = {
  args: {
    id: 2024,
    name: 'Project with [Special] (Characters) & Symbols!',
  },
};

export const MultipleItems: Story = {
  args: {
    id: 7917,
    name: 'Multiple Items',
  },
  render: () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      <PrototypeIdAndName id={7917} name="AI Assistant" />
      <PrototypeIdAndName id={1234} name="IoT Sensor System" />
      <PrototypeIdAndName id={5678} />
      <PrototypeIdAndName id={9012} name="Web Application" />
      <PrototypeIdAndName id={3456} />
      <PrototypeIdAndName id={7890} name="Mobile App" />
    </Box>
  ),
};

export const ManyItems: Story = {
  args: {
    id: 1000,
    name: 'Many Items',
  },
  render: () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {Array.from({ length: 30 }, (_, i) => (
        <PrototypeIdAndName
          key={i}
          id={1000 + i}
          name={i % 3 === 0 ? undefined : `Prototype ${1000 + i}`}
        />
      ))}
    </Box>
  ),
};
/**
 * Comparison of IDs with different digit lengths
 */
export const VariousIdLengths: Story = {
  args: {
    id: 1,
    name: 'Various Lengths',
  },
  render: () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      <PrototypeIdAndName id={1} name="Single Digit" />
      <PrototypeIdAndName id={42} name="Two Digits" />
      <PrototypeIdAndName id={789} name="Three Digits" />
      <PrototypeIdAndName id={1234} name="Four Digits" />
      <PrototypeIdAndName id={56789} name="Five Digits" />
    </Box>
  ),
};
