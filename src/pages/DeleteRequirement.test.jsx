import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useLoaderData } from 'react-router-dom';

import DeleteRequirement from './DeleteRequirement.jsx';

vi.mock('react-router-dom', () => ({ useLoaderData: vi.fn() }));
vi.mock('../components/RequirementForm.jsx', () => ({
  default: ({ requirement, mode }) => (
    <div>
      {requirement.id} {mode}
    </div>
  ),
}));

describe('DeleteRequirement', () => {
  it('passes the loaded requirement to the form in delete mode', () => {
    useLoaderData.mockReturnValue({ id: 111 });
    render(<DeleteRequirement />);
    expect(screen.getByText('111 delete')).toBeInTheDocument();
  });
});
