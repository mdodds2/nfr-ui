import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useLoaderData } from 'react-router-dom';
import ShowReport from './ShowReport.jsx';

vi.mock('react-router-dom', () => ({
  useLoaderData: vi.fn(),
}));

const report = {
  id: 1,
  name: 'Test Report',
  description: 'Report Description',
  createdAt: 'some moment in time',
  userName: 'Test User',
  requirements: [
      {
          id: 111,
          subCategoryId: 10,
          identifier: 'TST-TST-01',
          title: 'Report Title',
          description: 'This is my test report description',
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
};

const categories = [
  { id: 1, name: 'Performance', subCategories: [{ id: 10, name: 'Time Behaviour' },{ id: 11, name: 'Capacity' }] },
];


function renderShowReport({ loaderData } = {}) {
  useLoaderData.mockReturnValue(loaderData ?? { report, categories });
  return render(<ShowReport />);
}

describe('ShowReport', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks()
  });

  it('renders the report heading and description', () => {
    renderShowReport();
    expect(screen.getByRole('heading', {
      level: 1,
      name: /quality attributes report:\s*test report/i,
    })).toBeInTheDocument();
    expect(screen.getByText('Report Description')).toBeInTheDocument();
  });

  it('revision history', () => {
    renderShowReport();
    expect(screen.getByText('DOCUMENT REVISION HISTORY')).toBeInTheDocument();
    expect(screen.getByText(report.createdAt)).toBeInTheDocument();
    expect(screen.getByText('1.0')).toBeInTheDocument();
    expect(screen.getByText(report.description)).toBeInTheDocument();
    expect(screen.getByText(report.userName)).toBeInTheDocument();
  });

  it('Contents and subcategories', () => {
    renderShowReport();
    expect(screen.getByText('Table of Contents')).toBeInTheDocument();
    expect(screen.getByRole('link', {name: /^Introduction$/i,})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Category: ' + categories[0].name ,})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Sub-Characteristic: ' + categories[0].subCategories[0].name})).toBeInTheDocument();
    expect(screen.queryByRole('link', {name: 'Sub-Characteristic: ' + categories[0].subCategories[1].name})).not.toBeInTheDocument();
  });

  it('Requirement details', () => {
    renderShowReport();
    expect(screen.getByText(new RegExp('ID#:\\s*' + report.requirements[0].identifier))).toBeInTheDocument();
    expect(screen.getByRole('heading', {level: 2, name: 'Category: ' + categories[0].name})).toBeInTheDocument();
    expect(screen.getByRole('heading', {level: 3, name: 'Sub-Characteristic: ' + categories[0].subCategories[0].name})).toBeInTheDocument();
    expect(screen.getByText(report.requirements[0].title)).toBeInTheDocument();
    expect(screen.getByText(report.requirements[0].description)).toBeInTheDocument();
    expect(screen.getByText(report.requirements[0].priority)).toBeInTheDocument();
    expect(screen.getByText(report.requirements[0].status)).toBeInTheDocument();
    expect(screen.getByText(report.requirements[0].rationale)).toBeInTheDocument();
    expect(screen.getByText(report.requirements[0].riskIfViolated)).toBeInTheDocument();
  });

  it('Requirement Measurement', () => {
    renderShowReport();
    expect(screen.getByText('Measured by:')).toBeInTheDocument();
    expect(screen.getByText(report.measurements[0].targetValue)).toBeInTheDocument();
    expect(screen.getByText(report.measurements[0].thresholdValue)).toBeInTheDocument();
    expect(screen.getByText(report.measurements[0].unit)).toBeInTheDocument();
    expect(screen.getByText(report.measurements[0].measurementMethod)).toBeInTheDocument();
    expect(screen.getByText(report.measurements[0].trigger)).toBeInTheDocument();
    expect(screen.getByText(report.measurements[0].context)).toBeInTheDocument();
    expect(screen.getByText(report.measurements[0].systemResponse)).toBeInTheDocument();
    expect(screen.getByText(report.measurements[0].owner)).toBeInTheDocument();
    expect(screen.getByText(report.measurements[0].acceptanceCriteria)).toBeInTheDocument();
    expect(screen.getByText(report.measurements[0].notes)).toBeInTheDocument();
  });

  it('omits measurements when none exist', () => {
    renderShowReport({
      loaderData: {
        report: { ...report, measurements: [] },
        categories,
      },
    });
    expect(screen.queryByText('Measured by:'))
      .not.toBeInTheDocument();
  });

  it('measurement belonging to another requirement', () => {
    renderShowReport({
      loaderData: {
        report: { ...report, measurements: [{ ...report.measurements[0], requirementId: 999 }] },
        categories,
      },
    });
    expect(screen.queryByText('Measured by:')).not.toBeInTheDocument();
  });

});