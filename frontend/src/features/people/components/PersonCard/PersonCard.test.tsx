import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '@/styles/theme';
import { PersonCard } from './PersonCard';
import type { Person } from '@/api/types';

const basePerson: Person = {
  id: '1',
  name: 'Alice Smith',
  state: 'GA',
  party: 'Democratic',
  roleTitle: 'Senator',
  district: '1',
  image: null,
  jurisdictionId: 'ocd-jurisdiction/country:us/state:ga/government',
};

function renderCard(person: Partial<Person> = {}) {
  return render(
    <ThemeProvider theme={lightTheme}>
      <PersonCard person={{ ...basePerson, ...person }} />
    </ThemeProvider>,
  );
}

describe('PersonCard', () => {
  it('renders person name', () => {
    renderCard();
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
  });

  it('renders role title', () => {
    renderCard();
    expect(screen.getByText('Senator')).toBeInTheDocument();
  });

  it('renders district when present', () => {
    renderCard();
    expect(screen.getByText('District 1')).toBeInTheDocument();
  });

  it('does not render district when absent', () => {
    renderCard({ district: undefined });
    expect(screen.queryByText(/District/)).not.toBeInTheDocument();
  });

  it('renders state tag', () => {
    renderCard();
    expect(screen.getByText('GA')).toBeInTheDocument();
  });

  it('renders party tag', () => {
    renderCard();
    expect(screen.getByText('Democratic')).toBeInTheDocument();
  });

  it('renders initials when no image', () => {
    renderCard();
    expect(screen.getByText('AS')).toBeInTheDocument();
  });

  it('renders image when provided', () => {
    renderCard({ image: 'https://example.com/photo.jpg' });
    expect(screen.getByRole('img', { name: 'Alice Smith' })).toHaveAttribute(
      'src',
      'https://example.com/photo.jpg',
    );
  });
});
