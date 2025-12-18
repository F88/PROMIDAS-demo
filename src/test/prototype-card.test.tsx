import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PrototypeCard } from '../components/common/prototype-card';
import type { NormalizedPrototype } from '@f88/promidas/types';

describe('PrototypeCard', () => {
  const mockPrototype: NormalizedPrototype = {
    id: 123,
    prototypeNm: 'Test Prototype',
    teamNm: 'Test Team',
    users: [],
    tags: ['tag1', 'tag2'],
    materials: [],
    events: [],
    awards: [],
    summary: 'Test summary',
    systemDescription: '',
    status: 1,
    releaseFlg: 1,
    createDate: '2024-01-01',
    updateDate: '2024-01-01',
    releaseDate: '2024-01-01',
    revision: 1,
    freeComment: '',
    viewCount: 100,
    goodCount: 50,
    commentCount: 10,
    mainUrl: 'https://protopedia.net/prototype/123',
    licenseType: 0,
    thanksFlg: 0,
  };

  it('renders prototype name', () => {
    render(<PrototypeCard prototype={mockPrototype} />);
    expect(screen.getByText('Test Prototype')).toBeDefined();
  });

  it('renders prototype ID', () => {
    render(<PrototypeCard prototype={mockPrototype} />);
    expect(screen.getByText(/ID: 123/)).toBeDefined();
  });

  it('renders team name when provided', () => {
    render(<PrototypeCard prototype={mockPrototype} />);
    expect(screen.getByText(/Team: Test Team/)).toBeDefined();
  });

  it('renders tags when provided', () => {
    render(<PrototypeCard prototype={mockPrototype} />);
    expect(screen.getByText('tag1')).toBeDefined();
    expect(screen.getByText('tag2')).toBeDefined();
  });

  it('renders link to ProtoPedia', () => {
    render(<PrototypeCard prototype={mockPrototype} />);
    const link = screen.getByRole('link', { name: /View on ProtoPedia/ });
    expect(link).toBeDefined();
  });
});
