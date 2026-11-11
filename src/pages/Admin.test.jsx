import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Admin from './Admin.jsx';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => mockNavigate,
}));

function renderAdminPage() {
  return render(<Admin />);
}

describe('AdminPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('default display', () => {
    renderAdminPage();
    expect(screen.getByRole('heading', { name: 'Admin' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show All NFRs' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New NFR' })).toBeInTheDocument();
  });

  it('click on tiles', async () => {
    renderAdminPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Show All NFRs' }));
    expect(mockNavigate).toHaveBeenCalledWith('/requirements/displayAll');
    await user.click(screen.getByRole('button', { name: 'New NFR' }));
    expect(mockNavigate).toHaveBeenCalledWith('/requirements/new');
  });
});
