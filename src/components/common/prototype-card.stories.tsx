import { PrototypeCard } from './prototype-card';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { NormalizedPrototype } from 'promidas/types';

/**
 * Helper function to create mock prototype data
 */
function createMockPrototype(
  overrides?: Partial<NormalizedPrototype>,
): NormalizedPrototype {
  return {
    id: 1001,
    prototypeNm: 'IoT Temperature Monitor',
    summary:
      'A smart temperature monitoring system using Arduino and cloud integration for real-time data tracking.',
    freeComment: '',
    systemDescription: '',
    mainUrl: 'https://protopedia.net/prototype/1001',
    createDate: '2024-01-15',
    releaseFlg: 1,
    status: 1,
    viewCount: 1250,
    goodCount: 42,
    commentCount: 8,
    users: ['Alice@alice', 'Bob@bob'],
    teamNm: 'Tech Innovators',
    tags: ['IoT', 'Arduino', 'Cloud'],
    materials: ['ESP32', 'Temperature Sensor'],
    events: ['Maker Faire 2024'],
    awards: [],
    ...overrides,
  };
}

const meta = {
  title: 'Common/PrototypeCard',
  component: PrototypeCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PrototypeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default prototype card with all information
 */
export const Default: Story = {
  args: {
    prototype: createMockPrototype(),
  },
};

/**
 * Card without summary text
 */
export const WithoutSummary: Story = {
  args: {
    prototype: createMockPrototype({
      summary: '',
    }),
  },
};

/**
 * Card with long title
 */
export const LongTitle: Story = {
  args: {
    prototype: createMockPrototype({
      prototypeNm:
        'Advanced IoT-Based Temperature and Humidity Monitoring System with Real-Time Cloud Integration and Mobile App Support',
    }),
  },
};

/**
 * Card with long summary
 */
export const LongSummary: Story = {
  args: {
    prototype: createMockPrototype({
      summary:
        'This is a comprehensive IoT solution that combines multiple sensors, cloud computing, and machine learning algorithms to provide accurate environmental monitoring. The system features real-time data collection, advanced analytics, predictive maintenance capabilities, and seamless integration with existing infrastructure. It supports multiple communication protocols and can be easily scaled to accommodate growing business needs.',
    }),
  },
};

/**
 * Card with minimal data
 */
export const MinimalData: Story = {
  args: {
    prototype: createMockPrototype({
      summary: '',
      users: [],
      tags: [],
      materials: [],
      events: [],
      teamNm: '',
      viewCount: 0,
      goodCount: 0,
      commentCount: 0,
    }),
  },
};

/**
 * Card for a new prototype with low engagement
 */
export const NewPrototype: Story = {
  args: {
    prototype: createMockPrototype({
      id: 2024,
      prototypeNm: 'My First Arduino Project',
      summary: 'A simple LED blinking project to learn Arduino basics.',
      commentCount: 0,
      createDate: '2024-12-18',
    }),
  },
};

/**
 * Card for a popular prototype with high engagement
 */
export const HighEngagement: Story = {
  args: {
    prototype: createMockPrototype({
      prototypeNm: 'AI-Powered Robot Assistant',
      summary:
        'An advanced robotic assistant using machine learning for natural language processing and autonomous navigation.',
      commentCount: 156,
      tags: ['AI', 'Robotics', 'Machine Learning', 'ROS'],
    }),
  },
};

/**
 * Card with very short title and summary
 */
export const ShortContent: Story = {
  args: {
    prototype: createMockPrototype({
      prototypeNm: 'LED',
      summary: 'Simple LED project.',
    }),
  },
};

/**
 * Card with Japanese text
 */
export const JapaneseContent: Story = {
  args: {
    prototype: createMockPrototype({
      prototypeNm: '温度センサーモニタリングシステム',
      summary:
        'Arduinoとクラウド連携を使用したリアルタイムデータ追跡のためのスマート温度監視システムです。',
      teamNm: '技術イノベーターズ',
    }),
  },
};

/**
 * User name variations, decoded by parseUsername (promidas-utils) and shown
 * as `displayName (profileId)`. Each element is a ProtoPedia
 * `displayName@profileId` string covering a pattern seen in real data:
 * normal, empty display name, display name containing `@`, and a malformed
 * value with no `@` separator.
 */
export const UserNameVariations: Story = {
  args: {
    prototype: createMockPrototype({
      prototypeNm: 'Username Parsing Showcase',
      summary:
        'Demonstrates how parseUsername decomposes each users[] element into a display name and a profile id.',
      users: [
        'Alice@alice', // normal -> "Alice (alice)"
        '@bob', // empty display name -> "@bob"
        'Carol@Example@carol', // display name contains '@' -> "Carol@Example (carol)"
        'legacy-handle', // no '@' separator -> "legacy-handle"
      ],
    }),
  },
};
