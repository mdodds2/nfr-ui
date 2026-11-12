import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useLoaderData } from 'react-router-dom';

import NewRequirement from './NewRequirement.jsx';

vi.mock('react-router-dom', () => ({
  Form: ({ children }) => <form>{children}</form>,
  useLoaderData: vi.fn(),
}));

vi.mock('../components/RequirementForm.jsx', () => ({
  default: ({ mode }) => <div>RequirementForm {mode}</div>,
}));

const nextIdentifier = {nextIdentifier: 'TST-TST-01'};

function renderNewRequirement({ loaderData } = {}) {
  useLoaderData.mockReturnValue(loaderData ?? nextIdentifier );
  return render(<NewRequirement />);
}

describe('NewRequirement', () => {
  it('renders requirement form in new mode', () => {
    renderNewRequirement();
    expect(screen.getByText('RequirementForm new')).toBeInTheDocument();
  });
});


