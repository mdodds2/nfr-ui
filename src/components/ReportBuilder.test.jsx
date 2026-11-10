import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ReportBuilder from './ReportBuilder.jsx';
import { DisplayContext } from '../store/display-context-object';
import { getSubCategories } from '../util/http.js';
import useCategories from '../hooks/useCategories.js';

vi.mock('../util/http.js', () => ({
  getSubCategories: vi.fn(),
}));

vi.mock('../hooks/useCategories.js', () => ({ default: vi.fn() }));

const categories = [
  {
    id: 1,
    name: 'Performance',
    description: 'Perf desc',
    subCategories: [{ id: 10, name: 'Time Behaviour' }],
  },
];

const defaults = {
  categoryId: null,
  subCategoryId: null,
  subCategories: [],
  setCategoryId: vi.fn(),
  setSubCategoryId: vi.fn(),
  setSubCategories: vi.fn(),
};

function renderReportBuilder({ display } = {}) {
  useCategories.mockReturnValue({ categories });
  const displayValue = display ?? defaults;
  render(
    <DisplayContext.Provider value={displayValue}>
      <ReportBuilder />
    </DisplayContext.Provider>
  );
  return displayValue;
}

describe('ReportBuilder', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the default page', () => {
    renderReportBuilder();
    expect(
      screen.getByRole('heading', { name: 'What are Quality Attributes ?' })
    ).toBeInTheDocument();
  });

  it('user clicks on home', async () => {
    const display = renderReportBuilder();
    const user = userEvent.setup();
    await user.click(screen.getByText('Home'));
    expect(display.setCategoryId).toHaveBeenCalledWith(null);
  });

  it('select category', async () => {
    const display = renderReportBuilder();
    const user = userEvent.setup();
    await user.click(screen.getByText('Performance'));
    expect(display.setCategoryId).toHaveBeenCalledWith(1);
  });

  it('fetches sub-characteristics when a category is selected', async () => {
    const subCats = [{ id: 10, name: 'Time Behaviour' }];
    getSubCategories.mockResolvedValue(subCats);
    const display = renderReportBuilder({ display: { ...defaults, categoryId: 1 } });
    await waitFor(() => expect(display.setSubCategories).toHaveBeenCalledWith(subCats));
    expect(getSubCategories).toHaveBeenCalledWith(1);
  });

  it('clicking the selected category clears it', async () => {
    const display = renderReportBuilder({ display: { ...defaults, categoryId: 1 } });
    const user = userEvent.setup();
    await user.click(screen.getByText('Performance'));
    expect(display.setCategoryId).toHaveBeenCalledWith();
    expect(screen.queryByRole('heading', { name: /Characteristic:/ })).not.toBeInTheDocument();
  });

  it('select sub-characteristic', async () => {
    const subCategories = [{ id: 10, name: 'Time Behaviour', description: 'TB desc' }];
    const display = renderReportBuilder({ display: { ...defaults, subCategories } });
    const user = userEvent.setup();
    await user.click(screen.getByText('Performance'));
    await user.click(screen.getByText('Time Behaviour'));
    expect(display.setSubCategoryId).toHaveBeenCalledWith(10);
    expect(screen.getByText('TB desc')).toBeInTheDocument();
  });

  it('clicking the selected sub-characteristic clears it', async () => {
    const subCategories = [{ id: 10, name: 'Time Behaviour', description: 'TB desc' }];
    const display = renderReportBuilder({
      display: { ...defaults, subCategories, subCategoryId: 10 },
    });
    const user = userEvent.setup();
    await user.click(screen.getByText('Performance'));
    await user.click(screen.getByText('Time Behaviour'));
    expect(display.setSubCategoryId).toHaveBeenCalledWith();
    expect(screen.queryByText('TB desc')).not.toBeInTheDocument();
  });
});
