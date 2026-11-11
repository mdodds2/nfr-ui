import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import NewRequirement from './NewRequirement.jsx';

vi.mock('../components/MainNavigation.jsx', () => ({ default: () => <nav>MainNavigation</nav> }));
vi.mock('../components/RequirementForm.jsx', () => ({
  default: ({ mode }) => <div>RequirementForm {mode}</div>,
}));

describe('NewRequirement', () => {
  it('renders requirement form in new mode', () => {
    render(<NewRequirement />);
    expect(screen.getByText('RequirementForm new')).toBeInTheDocument();
  });
});
