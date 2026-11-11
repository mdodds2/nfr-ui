import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useActionData, useLoaderData } from 'react-router-dom';

import ShowRequirement from './ShowRequirement.jsx';

vi.mock('react-router-dom', () => ({ useLoaderData: vi.fn() }));
vi.mock('../components/MainNavigation.jsx', () => ({ default: () => <nav>MainNavigation</nav> }));
vi.mock('../components/RequirementForm.jsx', () => ({
  default: ({ requirement, mode }) => (
    <div>
      {requirement.id} {mode}
    </div>
  ),
}));

describe('EditRequirement', () => {
  it('passes the loaded requirement to the form in edit mode', () => {
    useLoaderData.mockReturnValue({ id: 111 });
    render(<ShowRequirement />);
    expect(screen.getByText('111 readonly')).toBeInTheDocument();
  });
});
