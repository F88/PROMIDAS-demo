import type { Meta, StoryObj } from '@storybook/react-vite';
import type { NormalizedPrototype } from '@f88/promidas/types';
import type { PrototypeCard } from './prototype-card';

const meta = {
  title: 'Components/Common/PrototypeCard',
  component: PrototypeCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PrototypeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const createMockPrototype = (
  overrides?: Partial<NormalizedPrototype>,
): NormalizedPrototype => ({
  id: 7917,
  createDate: '2024-01-01T00:00:00Z',
  releaseFlg: 1,
  status: 1,
  prototypeNm: 'Sample Prototype',
  summary: 'This is a sample prototype showcasing various features.',
  freeComment: '',
  systemDescription: '',
  users: ['user1'],
  teamNm: 'Innovation Team',
  tags: ['AI', 'IoT', 'Web'],
  materials: [],
  events: [],
  awards: [],
  mainUrl: 'https://protopedia.net/prototype/7917',
  viewCount: 1234,
  goodCount: 56,
  commentCount: 12,
  ...overrides,
});

export const Default: Story = {
  args: {
    prototype: createMockPrototype(),
  },
};

export const WithoutTeam: Story = {
  args: {
    prototype: createMockPrototype({
      teamNm: undefined,
    }),
  },
};

export const WithoutSummary: Story = {
  args: {
    prototype: createMockPrototype({
      summary: undefined,
    }),
  },
};

export const WithoutTags: Story = {
  args: {
    prototype: createMockPrototype({
      tags: [],
    }),
  },
};

export const WithoutUrl: Story = {
  args: {
    prototype: createMockPrototype({
      mainUrl: undefined,
    }),
  },
};

export const MinimalData: Story = {
  args: {
    prototype: createMockPrototype({
      teamNm: undefined,
      summary: undefined,
      tags: [],
      mainUrl: undefined,
      viewCount: 0,
      goodCount: 0,
      commentCount: 0,
    }),
  },
};

export const LongTitle: Story = {
  args: {
    prototype: createMockPrototype({
      prototypeNm:
        'This is a Very Long Prototype Name That Should Wrap Properly in the Card Layout',
    }),
  },
};

export const LongSummary: Story = {
  args: {
    prototype: createMockPrototype({
      summary:
        'This is a very long summary text that demonstrates how the prototype card handles lengthy descriptions. It should wrap properly and maintain good readability even with multiple lines of text content. The card design should accommodate various content lengths gracefully.',
    }),
  },
};

export const ManyTags: Story = {
  args: {
    prototype: createMockPrototype({
      tags: [
        'AI',
        'IoT',
        'Web',
        'Mobile',
        'Cloud',
        'Blockchain',
        'AR/VR',
        'Big Data',
      ],
    }),
  },
};

export const HighEngagement: Story = {
  args: {
    prototype: createMockPrototype({
      viewCount: 98765,
      goodCount: 4321,
      commentCount: 987,
    }),
  },
};

export const NewPrototype: Story = {
  args: {
    prototype: createMockPrototype({
      viewCount: 5,
      goodCount: 1,
      commentCount: 0,
    }),
  },
};
