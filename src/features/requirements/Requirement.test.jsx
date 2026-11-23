import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import Requirement from './Requirement.jsx';

describe('Requirement', () => {
  it('renders requirement as added', () => {
    render(
      <Requirement title="Test title" caption="Test Caption" isAdded={true}>
        <p>element representing children</p>
      </Requirement>
    );
    expect(screen.getByText('Test title')).toBeInTheDocument();
    expect(screen.getByText('Test Caption')).toBeInTheDocument();
    expect(screen.getByText('element representing children')).toBeInTheDocument();

    const tile = screen.getByText('Test title').closest('article');
    expect(tile).toHaveClass('requirement-tile-selected');
    expect(tile).not.toHaveClass('requirement-tile');
  });

  it('renders requirement as not added', () => {
    render(
      <Requirement title="Test title" caption="Test Caption" isAdded={false}>
        <p>element representing children</p>
      </Requirement>
    );

    expect(screen.getByText('Test title')).toBeInTheDocument();
    expect(screen.getByText('Test Caption')).toBeInTheDocument();
    expect(screen.getByText('element representing children')).toBeInTheDocument();

    const tile = screen.getByText('Test title').closest('article');
    expect(tile).toHaveClass('requirement-tile');
    expect(tile).not.toHaveClass('requirement-tile-selected');
  });
});
