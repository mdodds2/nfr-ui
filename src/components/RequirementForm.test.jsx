import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RequirementForm from './RequirementForm.jsx';
import { DisplayContext } from '../store/display-context-object';
import DisplayContextProvider from '../store/display-context';
import { useActionData } from 'react-router-dom';
import { getSubCategories, getNextIdentifier } from '../util/http.js';

vi.mock('react-router-dom', () => ({
  Form: ({ children, onSubmit }) => <form onSubmit={onSubmit}>{children}</form>,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useActionData: vi.fn(),
}));

vi.mock('../util/http.js', () => ({
  getSubCategories: vi.fn(),
  getNextIdentifier: vi.fn(),
}));

const categories = [
  { id: 1, name: 'Performance', subCategories: [{ id: 10, name: 'Time Behaviour' }] },
];

function renderRequirementForm({
  mode = 'new',
  display,
  requirement,
  categories,
  initialIdentifier,
  actionData,
} = {}) {
  useActionData.mockReturnValue(actionData ?? null);

  const ui = (
    <RequirementForm
      mode={mode}
      requirement={requirement}
      categories={categories}
      initialIdentifier={initialIdentifier}
    />
  );
  return render(
    display ? (
      <DisplayContext.Provider value={display}>{ui}</DisplayContext.Provider>
    ) : (
      <DisplayContextProvider>{ui}</DisplayContextProvider>
    )
  );
}

describe('RequirementForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the new-requirement heading and empty fields', () => {
    renderRequirementForm({ mode: 'new' });
    expect(screen.getByRole('heading', { name: /create a new requirement/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Characteristic *')).toHaveValue('');
    expect(screen.getByLabelText('Sub-Characteristic *')).toHaveValue('');
    expect(screen.getByLabelText(/priority/i)).toHaveValue('');
    expect(screen.getByLabelText('Status *')).toHaveValue('');
    expect(screen.getByLabelText(/identifier/i)).toHaveValue('');
    expect(screen.getByLabelText(/identifier/i)).toHaveAttribute('placeholder', 'PERF-2025-003');
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cancel/i })).toHaveAttribute('href', '/main/admin');
  });

  it('loads types for a category and fetches the next identifier', async () => {
    const user = userEvent.setup();
    getSubCategories.mockResolvedValue([{ id: 10, name: 'Time Behaviour' }]);
    getNextIdentifier.mockResolvedValue({ identifier: 'PERF-2026-001' });
    renderRequirementForm({ mode: 'new', categories });
    await user.selectOptions(screen.getByLabelText(/^characteristic/i), 'Performance');
    expect(getSubCategories).toHaveBeenCalledWith('1');
    await user.selectOptions(screen.getByLabelText(/sub-characteristic/i), 'Time Behaviour');
    expect(getNextIdentifier).toHaveBeenCalledWith('1', '10');
    await waitFor(() => expect(screen.getByLabelText(/identifier/i)).toHaveValue('PERF-2026-001'));
  });

  it('resets category', async () => {
    const user = userEvent.setup();
    getSubCategories.mockResolvedValue([{ id: 10, name: 'Time Behaviour' }]);
    renderRequirementForm({ mode: 'new', categories });
    await user.selectOptions(screen.getByLabelText(/^characteristic/i), '');
    expect(screen.getByLabelText(/^characteristic/i)).toHaveValue('');
    expect(getSubCategories).not.toHaveBeenCalled();
  });

  it('resets subCategory', async () => {
    const user = userEvent.setup();
    getSubCategories.mockResolvedValue([{ id: 10, name: 'Time Behaviour' }]);
    getNextIdentifier.mockResolvedValue({ identifier: 'PERF-2026-001' });
    renderRequirementForm({ mode: 'new', categories });
    await user.selectOptions(screen.getByLabelText(/^characteristic/i), 'Performance');
    expect(getSubCategories).toHaveBeenCalledWith('1');
    await user.selectOptions(screen.getByLabelText(/sub-characteristic/i), 'Time Behaviour');
    expect(getNextIdentifier).toHaveBeenCalledWith('1', '10');
    await user.selectOptions(screen.getByLabelText(/sub-characteristic/i), '');
    await waitFor(() => expect(screen.getByLabelText(/identifier/i)).toHaveValue(''));
  });

  it('renders edit mode with the requirement values', () => {
    renderRequirementForm({
      mode: 'edit',
      requirement: {
        identifier: 'TST-TST-01',
        title: 'Response time',
        priority: 'HIGH',
        status: 'APPROVED',
      },
    });
    expect(
      screen.getByRole('heading', { name: /edit an existing requirement/i })
    ).toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: 'Characteristic *' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('combobox', { name: 'Sub-Characteristic *' })
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText('Identifier *')).toHaveValue('TST-TST-01');
    expect(screen.getByLabelText('Priority *')).toHaveValue('HIGH');
    expect(screen.getByLabelText('Status *')).toHaveValue('APPROVED');
  });

  it('shows the server error message', () => {
    renderRequirementForm({ mode: 'edit', actionData: { error: 'An error has occurred' } });
    expect(screen.getByText('An error has occurred')).toBeInTheDocument();
  });

  it('displays read only mode', () => {
    renderRequirementForm({ mode: 'readonly' });
    expect(screen.getByLabelText('Title *')).toHaveAttribute('readonly');
    expect(screen.getByLabelText(/^priority/i)).toHaveAttribute('disabled');
    expect(screen.getByLabelText(/^status/i)).toHaveAttribute('disabled');
    expect(screen.queryByLabelText('Characteristic *')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute(
      'href',
      '/requirements/displayAll'
    );
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Cancel' })).not.toBeInTheDocument();
  });

  it('shows the initial identifier passed in', () => {
    renderRequirementForm({ mode: 'new', initialIdentifier: 'PERF-2026-002' });
    expect(screen.getByLabelText(/identifier/i)).toHaveValue('PERF-2026-002');
  });

  it('renders delete mode with the requirement values', () => {
    renderRequirementForm({
      mode: 'delete',
      requirement: {
        identifier: 'TST-TST-01',
        title: 'Response time',
        priority: 'HIGH',
        status: 'APPROVED',
      },
    });
    expect(
      screen.getByRole('heading', { name: /delete an existing requirement/i })
    ).toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: 'Characteristic *' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('combobox', { name: 'Sub-Characteristic *' })
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText('Identifier *')).toHaveValue('TST-TST-01');
    expect(screen.getByLabelText('Priority *')).toHaveValue('HIGH');
    expect(screen.getByLabelText('Status *')).toHaveValue('APPROVED');
  });

  it('asks for confirmation before deleting', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderRequirementForm({
      mode: 'delete',
      requirement: { identifier: 'TST-TST-01', title: 'Response time' },
    });
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(confirmSpy).toHaveBeenCalledTimes(1);
  });

  it('submits the delete when confirmed', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderRequirementForm({
      mode: 'delete',
      requirement: { identifier: 'TST-TST-01', title: 'Response time' },
    });
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(confirmSpy).toHaveBeenCalledTimes(1);
  });

  it('does not confirm when saving an edit', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm');
    renderRequirementForm({
      mode: 'edit',
      requirement: { identifier: 'TST-TST-01', title: 'Response time' },
    });
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(confirmSpy).not.toHaveBeenCalled();
  });
});
