import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLoaderData } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ReportsPage from './Reports.jsx';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useLoaderData: vi.fn() };
});

const reports = [
    {
      id: 1,
      name: 'First Report',
      description: 'First Report Description',
      createdAt: '2026-01-01',
      userName: 'Test User',
      requirements: [
          {
              id: 111,
              subCategoryId: 10,
              identifier: 'TST-TST-01',
              title: 'Requirement Title',
              description: 'This is my test requirement description',
              priority: 'HIGH',
              status: 'APPROVED',
              rationale: 'Ensures compliance with ISO',
              riskIfViolated: 'bad things happen'
          }
      ],
      measurements: [
          {
              id: 222,
              requirementId: 111,
              targetValue: 'target value',
              thresholdValue: 'threshold value',
              unit: 'unit',
              measurementMethod: 'measurementMethod',
              trigger: 'trigger',
              context: 'context',
              systemResponse: 'systemResponse',
              owner: 'owner',
              acceptanceCriteria: 'acceptanceCriteria',
              notes: 'notes'
          }
      ],
    },
    {
      id: 2,
      name: 'Second Report',
      description: 'Second Report Description',
      createdAt: '2026-02-02',
      userName: 'Test User',
      requirements: [
          {
              id: 112,
              subCategoryId: 11,
              identifier: 'TST-TST-02',
              title: 'Requirement Title',
              description: 'This is my test requirement description',
              priority: 'HIGH',
              status: 'APPROVED',
              rationale: 'Ensures compliance with ISO',
              riskIfViolated: 'bad things happen'
          }
      ],
      measurements: [
          {
              id: 333,
              requirementId: 111,
              targetValue: 'target value',
              thresholdValue: 'threshold value',
              unit: 'unit',
              measurementMethod: 'measurementMethod',
              trigger: 'trigger',
              context: 'context',
              systemResponse: 'systemResponse',
              owner: 'owner',
              acceptanceCriteria: 'acceptanceCriteria',
              notes: 'notes'
          }
      ],
    }
];

function renderReports({ loaderData } = {}) {
  useLoaderData.mockReturnValue(loaderData ?? reports);
  return render(
    <MemoryRouter>
      <ReportsPage />
    </MemoryRouter>
  );
}

describe('ReportsPage', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks()
  });

  it('page renders, default grid', () => {
    renderReports();
    expect(screen.getByRole('heading', { name: 'My Reports'})).toBeInTheDocument();
    expect(screen.getByText(reports[0].name)).toBeInTheDocument();
    expect(screen.getByText('Created ' + reports[0].createdAt)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /^view$/i })).toHaveLength(reports.length);
    expect(screen.getAllByRole('link', { name: /^update$/i })).toHaveLength(reports.length);
  });

  it('No reports exist, new report button', () => {
    renderReports( { loaderData: [] });
    expect(screen.getByText('No reports found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'New Report' })).toHaveAttribute('href', '/reports/new');
  });

  it('switch between views', async () => {
    const user = userEvent.setup();
    const { container } = renderReports();

    const listIcon = container.querySelectorAll('.icon-group > span')[1];
    await user.click(listIcon);
    expect(screen.getByRole('heading', {level: 3,name: reports[0].name,})).toBeInTheDocument();

    const gridIcon = container.querySelectorAll('.icon-group > span')[0];
    await user.click(gridIcon);
    expect(screen.getByText(reports[0].name)).toBeInTheDocument();
    expect(screen.getByText('Created ' + reports[0].createdAt)).toBeInTheDocument();
  });

});