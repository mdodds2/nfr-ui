import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLoaderData } from 'react-router-dom';

import Requirements from './Requirements.jsx';
import { DisplayContext } from '../store/display-context-object';
import DisplayContextProvider from '../store/display-context';
import { getSubCategories, getRequirementsForSubCategory } from "../util/http.js";

vi.mock('react-router-dom', () => ({
  Form: ({ children }) => <form>{children}</form>,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useLoaderData: vi.fn(),
}));

vi.mock('../util/http.js', () => ({
  getSubCategories: vi.fn(),
  getRequirementsForSubCategory: vi.fn(),
}));

const categories = [
  { id: 1, name: 'Performance', subCategories: [{ id: 11, name: 'Time Behaviour' }] },
  { id: 2, name: 'Reliability', subCategories: [{ id: 21, name: 'Availability' }] },
];

function renderRequirements({ display, loaderData } = {}) {
  useLoaderData.mockReturnValue(loaderData ?? categories);

  const ui = <Requirements />;
  return render(
    display
      ? <DisplayContext.Provider value={display}>{ui}</DisplayContext.Provider>
      : <DisplayContextProvider>{ui}</DisplayContextProvider>
  );
}

describe('Requirements', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks()
  });

  it('renders default page', () => {
    renderRequirements();
    expect(screen.getByRole('heading', { name: /display quality attributes/i })).toBeInTheDocument();
    const [characteristic, subCharacteristic] = screen.getAllByRole('combobox');
    expect(characteristic).toHaveValue('');
    expect(subCharacteristic).toHaveValue('');
    expect(screen.getByText('No Quality Attributes exist for the selected Characteristic and Sub-Characteristic')).toBeInTheDocument();
    expect(screen.queryByRole('link', {name: 'New'} )).not.toBeInTheDocument();
  });

  it('pick a characteristic', async () => {
    getSubCategories.mockResolvedValue([{ id: 11, name: 'Time Behaviour' }]);
    renderRequirements();
    const [characteristic] = screen.getAllByRole('combobox');
    const user = userEvent.setup();
    await user.selectOptions(characteristic, 'Performance');
    expect(getSubCategories).toHaveBeenCalledWith('1');
    expect(await screen.findByRole('option', { name: 'Time Behaviour' })).toBeInTheDocument();
    expect(getRequirementsForSubCategory).not.toHaveBeenCalled();
  });

  it('pick a subCharacteristic', async () => {
    getSubCategories.mockResolvedValue([{ id: 11, name: 'Time Behaviour' }]);
    getRequirementsForSubCategory.mockResolvedValue([
      { id: 111, identifier: 'TST-TST-01', title: 'Response time', priority: 'HIGH', status: 'APPROVED' },
    ]);
    renderRequirements();
    const [characteristic, subCharacteristic] = screen.getAllByRole('combobox');
    const user = userEvent.setup();
    await user.selectOptions(characteristic, 'Performance');
    expect(getSubCategories).toHaveBeenCalledWith('1');

    await screen.findByRole('option', { name: 'Time Behaviour' });
    await user.selectOptions(subCharacteristic, 'Time Behaviour');
    expect(getRequirementsForSubCategory).toHaveBeenCalledWith('11');

    expect(await screen.findByRole('link', { name: 'TST-TST-01' })).toHaveAttribute('href', '/requirements/display/111');
    expect(screen.getByText('Response time')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'New' })).toHaveAttribute('href', '/requirements/new');
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('clear characteristic', async () => {
    getSubCategories.mockResolvedValue([{ id: 11, name: 'Time Behaviour' }]);
    getRequirementsForSubCategory.mockResolvedValue([
      { id: 111, identifier: 'TST-TST-01', title: 'Response time', priority: 'HIGH', status: 'APPROVED' },
    ]);
    renderRequirements();
    const [characteristic, subCharacteristic] = screen.getAllByRole('combobox');
    const user = userEvent.setup();
    await user.selectOptions(characteristic, 'Performance');
    expect(getSubCategories).toHaveBeenCalledWith('1');

    await screen.findByRole('option', { name: 'Time Behaviour' });
    await user.selectOptions(subCharacteristic, 'Time Behaviour');
    expect(getRequirementsForSubCategory).toHaveBeenCalledWith('11');

    await screen.findByRole('link', { name: 'TST-TST-01' });
    await user.selectOptions(characteristic, '');
    expect(screen.queryByRole('link', { name: 'TST-TST-01' })).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Time Behaviour' })).not.toBeInTheDocument();
    expect(screen.getByText('No Quality Attributes exist for the selected Characteristic and Sub-Characteristic')).toBeInTheDocument();
  });

  it('clear subCharacteristic', async () => {
    getSubCategories.mockResolvedValue([{ id: 11, name: 'Time Behaviour' }]);
    getRequirementsForSubCategory.mockResolvedValue([
      { id: 111, identifier: 'TST-TST-01', title: 'Response time', priority: 'HIGH', status: 'APPROVED' },
    ]);
    renderRequirements();
    const [characteristic, subCharacteristic] = screen.getAllByRole('combobox');
    const user = userEvent.setup();
    await user.selectOptions(characteristic, 'Performance');
    expect(getSubCategories).toHaveBeenCalledWith('1');

    await screen.findByRole('option', { name: 'Time Behaviour' });
    await user.selectOptions(subCharacteristic, 'Time Behaviour');
    expect(getRequirementsForSubCategory).toHaveBeenCalledWith('11');

    await screen.findByRole('link', { name: 'TST-TST-01' });
    await user.selectOptions(subCharacteristic, '');
    expect(screen.queryByRole('link', { name: 'TST-TST-01' })).not.toBeInTheDocument();
    expect(screen.getByText('No Quality Attributes exist for the selected Characteristic and Sub-Characteristic')).toBeInTheDocument();
  });

  it('shows the empty message when a sub-characteristic has no requirements', async () => {
    getSubCategories.mockResolvedValue([{ id: 11, name: 'Time Behaviour' }]);
    getRequirementsForSubCategory.mockResolvedValue([]);

    renderRequirements();

    const [characteristic, subCharacteristic] = screen.getAllByRole('combobox');
    const user = userEvent.setup();
    await user.selectOptions(characteristic, 'Performance');
    await screen.findByRole('option', { name: 'Time Behaviour' });
    await user.selectOptions(subCharacteristic, 'Time Behaviour');

    await waitFor(() => expect(getRequirementsForSubCategory).toHaveBeenCalledWith('11'));
    expect(screen.getByText('No Quality Attributes exist for the selected Characteristic and Sub-Characteristic')).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: /identifier/i })).not.toBeInTheDocument();
  });

});