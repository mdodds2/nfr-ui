import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useLoaderData } from 'react-router-dom';

import OrgAdmin from './OrgAdmin.jsx';

vi.mock('react-router-dom', () => ({
  useLoaderData: vi.fn(),
}));

vi.mock('./Organizations.jsx', () => ({
  default: ({ orgs }) => <p>Organizations component: {orgs.length}</p>,
}));

const orgs = [
  { id: '123', name: 'Test Org', slug: 'test-org' },
  { id: '234', name: 'Another Org', slug: 'another-org' },
];

function renderOrgAdmin({ loaderData } = {}) {
  useLoaderData.mockReturnValue(loaderData ?? orgs);
  return render(<OrgAdmin />);
}

describe('show OrgAdmin', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders default component', () => {
    renderOrgAdmin();
    expect(screen.getByRole('heading', { name: 'Org Admin Page' })).toBeInTheDocument();
    expect(screen.getByText('Organizations component: 2')).toBeInTheDocument();
  });
});
