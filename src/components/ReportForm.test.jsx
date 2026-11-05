import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReportForm from './ReportForm.jsx';
import CartContext from '../store/cart-context.jsx';
import { DisplayContext } from '../store/display-context-object';
import { useActionData, useLoaderData, useNavigate } from 'react-router-dom';
import { getRequirementsForSubCategory, deleteReport } from '../util/http.js';

vi.mock('react-router-dom', () => ({
  Form: ({ children }) => <form>{children}</form>,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useActionData: vi.fn(),
  useLoaderData: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock('../util/http.js', () => ({
  getRequirementsForSubCategory: vi.fn(),
  deleteReport: vi.fn(),
}));

const categories = [
  { id: 1, name: 'Performance', subCategories: [{ id: 10, name: 'Time Behaviour' }] },
];

function renderReportForm({ mode = 'new', cart, display, loaderData, actionData, navigate = vi.fn(), } = {}) {
  useLoaderData.mockReturnValue(loaderData ?? { categories, report: null });
  useActionData.mockReturnValue(actionData ?? null);
  useNavigate.mockReturnValue(navigate);

  const cartValue = cart ?? { items: [], addItem: vi.fn(), removeItem: vi.fn(), clearCart: vi.fn(), setItems: vi.fn() };
  const displayValue = display ?? {
    categoryId: null,
    subCategoryId: null,
    subCategories: [],
    setCategoryId: vi.fn(),
    setSubCategoryId: vi.fn(),
    setSubCategories: vi.fn(),
  };

  return render(
    <DisplayContext.Provider value={displayValue}>
      <CartContext.Provider value={cartValue}>
        <ReportForm mode={mode} />
      </CartContext.Provider>
    </DisplayContext.Provider>
  );
}

describe('ReportForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks()
  });

  it('renders the new-report heading and empty fields', () => {
    renderReportForm({ mode: 'new' });

    expect(screen.getByRole('heading', { name: /create a new report/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/project name/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // cart count
  });

  it('renders the edit-report heading and prefilled fields', () => {
    renderReportForm({
      mode: 'edit',
      loaderData: {
        categories,
        report: { id: 1, name: 'Alpha', description: 'A sample report' },
      },
    });

    expect(screen.getByRole('heading', { name: /edit an existing report/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/project name/i)).toHaveValue('Alpha');
    expect(screen.getByLabelText(/description/i)).toHaveValue('A sample report');
    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // cart count
  });

  it('category click', async () => {
    const setCategoryId = vi.fn();
    const setSubCategoryId = vi.fn();
    const setSubCategories = vi.fn();

    renderReportForm({
      mode: 'edit',
      loaderData: {
        categories,
        report: { id: 1, name: 'Alpha', description: 'A sample report' },
      },
      display: {
        categoryId: null,
        subCategoryId: null,
        subCategories: [],
        setCategoryId,
        setSubCategoryId,
        setSubCategories,
      },
    });

    const user = userEvent.setup();
    await user.click(screen.getByText('Performance'));

    expect(setCategoryId).toHaveBeenCalledWith(1);
    expect(setSubCategoryId).toHaveBeenCalledWith(null);
    expect(setSubCategories).toHaveBeenCalledWith(categories[0].subCategories);
  });

  it('subCategory click', async () => {
    const setCategoryId = vi.fn();
    const setSubCategoryId = vi.fn();
    const setSubCategories = vi.fn();

    renderReportForm({
      mode: 'edit',
      loaderData: {
        categories,
        report: { id: 1, name: 'Alpha', description: 'A sample report' },
      },
      display: {
        categoryId: 1,
        subCategoryId: null,
        subCategories: categories[0].subCategories,
        setCategoryId,
        setSubCategoryId,
        setSubCategories,
      },
    });

    getRequirementsForSubCategory.mockResolvedValueOnce([
      { id: 31, identifier: 'NFR-01', title: 'Response time' },
    ]);

    const user = userEvent.setup();
    await user.click(screen.getByText('Time Behaviour'));

    await waitFor(() => {
      expect(screen.getByText('Quality Attributes:')).toBeInTheDocument();
    });
    expect(setSubCategoryId).toHaveBeenCalledWith(10);

  });

  it('shows an action error', () => {
    renderReportForm({
      mode: 'edit',
      actionData: { error: 'An error occurred creating a new report.' },
    });
    expect(screen.getByText('An error occurred creating a new report.')).toBeInTheDocument();
  });

  it('deletes the report after confirm', async () => {
    const navigate = vi.fn();

    renderReportForm({
      mode: 'edit',
      navigate,
      loaderData: {
        categories,
        report: { id: 1, name: 'Alpha', description: 'A sample report' },
      },
    });

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    await userEvent.setup().click(screen.getByText('Delete Report'));

    expect(confirmSpy).toHaveBeenCalled();
    expect(deleteReport).toHaveBeenCalledWith(1);
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/reports/delete');
    });
  });

  it('does not delete when confirm is cancelled', async () => {
    const navigate = vi.fn();
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    renderReportForm({
      mode: 'edit',
      navigate,
      loaderData: {
        categories,
        report: { id: 1, name: 'Alpha', description: 'A sample report' },
      },
    });

    await userEvent.setup().click(screen.getByText('Delete Report'));

    expect(deleteReport).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('add a requirement to a report', async () => {
    const setCategoryId = vi.fn();
    const setSubCategoryId = vi.fn();
    const setSubCategories = vi.fn();
    const addItem = vi.fn();

    renderReportForm({
      mode: 'new',
      loaderData: {
        categories,
        report: { id: 1, name: 'Alpha', description: 'A sample report' },
      },
      display: {
        categoryId: 1,
        subCategoryId: 10,
        subCategories: categories[0].subCategories,
        setCategoryId,
        setSubCategoryId,
        setSubCategories,
      },
      cart: {
        items: [],
        addItem,
        removeItem: vi.fn(),
        clearCart: vi.fn(),
        setItems: vi.fn(),
      },
    });

    getRequirementsForSubCategory.mockResolvedValueOnce([
      { id: 31, identifier: 'NFR-01', title: 'Response time' },
    ]);

    const user = userEvent.setup();
    await user.click(screen.getByText('Time Behaviour'));
    await user.click(screen.getByText('Add'));
    await user.type(screen.getByLabelText(/target value/i), '2s');
    await user.type(screen.getByLabelText(/system response/i), 'Responds in 2s');
    await user.type(screen.getByLabelText(/^owner/i), 'Team A');
    await user.type(screen.getByLabelText(/acceptance criteria/i), 'p95 under 2s')
    await user.click(screen.getByText('Add to Report'));

    const item = {
            "requirement": { id: 31, identifier: 'NFR-01', title: 'Response time' },
            "category": categories[0],
            "subCategory": {
              "id": 10,
              "name": "Time Behaviour",
            },
            "context": "",
            "id": "",
            "measurementMethod": "",
            "notes": "",
            "targetValue": '2s',
            "systemResponse": 'Responds in 2s',
            "owner": 'Team A',
            "acceptanceCriteria": 'p95 under 2s',
            "thresholdValue": "",
            "trigger": "",
            "unit": "",
    };
    expect(addItem).toHaveBeenCalledWith(item);
  });

  it('missing mandatory field:  System Response', async () => {
    const setCategoryId = vi.fn();
    const setSubCategoryId = vi.fn();
    const setSubCategories = vi.fn();
    const addItem = vi.fn();

    renderReportForm({
      mode: 'new',
      loaderData: {
        categories,
        report: { id: 1, name: 'Alpha', description: 'A sample report' },
      },
      display: {
        categoryId: 1,
        subCategoryId: 10,
        subCategories: categories[0].subCategories,
        setCategoryId,
        setSubCategoryId,
        setSubCategories,
      },
      cart: {
        items: [],
        addItem,
        removeItem: vi.fn(),
        clearCart: vi.fn(),
        setItems: vi.fn(),
      },
    });

    getRequirementsForSubCategory.mockResolvedValueOnce([
      { id: 31, identifier: 'NFR-01', title: 'Response time' },
    ]);

    const user = userEvent.setup();
    await user.click(screen.getByText('Time Behaviour'));
    await user.click(screen.getByText('Add'));
    //await user.type(screen.getByLabelText(/system response/i), 'Responds in 2s');
    await user.type(screen.getByLabelText(/^owner/i), 'Team A');
    await user.type(screen.getByLabelText(/acceptance criteria/i), 'p95 under 2s')
    await user.click(screen.getByText('Add to Report'));

    expect(screen.getByText('System Response is a mandatory field')).toBeInTheDocument();
    expect(addItem).not.toHaveBeenCalled();
  });

  it('missing mandatory field:  Owner', async () => {
    const setCategoryId = vi.fn();
    const setSubCategoryId = vi.fn();
    const setSubCategories = vi.fn();
    const addItem = vi.fn();

    renderReportForm({
      mode: 'new',
      loaderData: {
        categories,
        report: { id: 1, name: 'Alpha', description: 'A sample report' },
      },
      display: {
        categoryId: 1,
        subCategoryId: 10,
        subCategories: categories[0].subCategories,
        setCategoryId,
        setSubCategoryId,
        setSubCategories,
      },
      cart: {
        items: [],
        addItem,
        removeItem: vi.fn(),
        clearCart: vi.fn(),
        setItems: vi.fn(),
      },
    });

    getRequirementsForSubCategory.mockResolvedValueOnce([
      { id: 31, identifier: 'NFR-01', title: 'Response time' },
    ]);

    const user = userEvent.setup();
    await user.click(screen.getByText('Time Behaviour'));
    await user.click(screen.getByText('Add'));
    await user.type(screen.getByLabelText(/system response/i), 'Responds in 2s');
    //await user.type(screen.getByLabelText(/^owner/i), 'Team A');
    await user.type(screen.getByLabelText(/acceptance criteria/i), 'p95 under 2s')
    await user.click(screen.getByText('Add to Report'));

    expect(screen.getByText('Owner is a mandatory field')).toBeInTheDocument();
    expect(addItem).not.toHaveBeenCalled();
  });

  it('missing mandatory field:  Acceptance Criteria', async () => {
    const setCategoryId = vi.fn();
    const setSubCategoryId = vi.fn();
    const setSubCategories = vi.fn();
    const addItem = vi.fn();

    renderReportForm({
      mode: 'new',
      loaderData: {
        categories,
        report: { id: 1, name: 'Alpha', description: 'A sample report' },
      },
      display: {
        categoryId: 1,
        subCategoryId: 10,
        subCategories: categories[0].subCategories,
        setCategoryId,
        setSubCategoryId,
        setSubCategories,
      },
      cart: {
        items: [],
        addItem,
        removeItem: vi.fn(),
        clearCart: vi.fn(),
        setItems: vi.fn(),
      },
    });

    getRequirementsForSubCategory.mockResolvedValueOnce([
      { id: 31, identifier: 'NFR-01', title: 'Response time' },
    ]);

    const user = userEvent.setup();
    await user.click(screen.getByText('Time Behaviour'));
    await user.click(screen.getByText('Add'));
    await user.type(screen.getByLabelText(/system response/i), 'Responds in 2s');
    await user.type(screen.getByLabelText(/^owner/i), 'Team A');
    //await user.type(screen.getByLabelText(/acceptance criteria/i), 'p95 under 2s')
    await user.click(screen.getByText('Add to Report'));

    expect(screen.getByText('Acceptance Criteria is a mandatory field')).toBeInTheDocument();
    expect(addItem).not.toHaveBeenCalled();
  });

  it('edit an existing requirement previously added to a report', async () => {
    const setCategoryId = vi.fn();
    const setSubCategoryId = vi.fn();
    const setSubCategories = vi.fn();
    const addItem = vi.fn();
    const removeItem = vi.fn();

    renderReportForm({
      //mode: 'edit',
      loaderData: {
        categories,
        report: { id: 1, name: 'Alpha', description: 'A sample report' },
      },
      display: {
        categoryId: 1,
        subCategoryId: 10,
        subCategories: categories[0].subCategories,
        setCategoryId,
        setSubCategoryId,
        setSubCategories,
      },
      cart: {
        items: [{
          requirement: { id: 31, identifier: 'NFR-01', title: 'Response time' },
          category: { id: 1, name: 'Performance' },
          subCategory: { id: 10, name: 'Time Behaviour' },
          id: '200',
          targetValue: '1s',
          thresholdValue: '',
          unit: '',
          measurementMethod: '',
          trigger: '',
          context: '',
          systemResponse: 'old response',
          owner: 'Team A',
          acceptanceCriteria: 'old criteria',
          notes: '',
        }],
        addItem,
        removeItem,
        clearCart: vi.fn(),
        setItems: vi.fn(),
      },
    });

    getRequirementsForSubCategory.mockResolvedValueOnce([
      { id: 31, identifier: 'NFR-01', title: 'Response time' },
    ]);

    const user = userEvent.setup();
    await user.click(screen.getByText(/^Time Behaviour/));
    await user.click(screen.getByText(/^Edit/));

    let response;

    response = screen.getByLabelText(/target value/i);
    expect(response).toHaveValue('1s');
    await user.clear(response);
    await user.type(response, '2s');
    expect(response).toHaveValue('2s');

    response = screen.getByLabelText(/system response/i);
    expect(response).toHaveValue('old response');
    await user.clear(response);
    await user.type(response, 'Responds in 2s');
    expect(response).toHaveValue('Responds in 2s');

    response = screen.getByLabelText(/^owner/i);
    expect(response).toHaveValue('Team A');
    await user.clear(response);
    await user.type(response, 'Team B');
    expect(response).toHaveValue('Team B');

    response = screen.getByLabelText(/^acceptance criteria/i);
    expect(response).toHaveValue('old criteria');
    await user.clear(response);
    await user.type(response, 'p95 under 2s');
    expect(response).toHaveValue('p95 under 2s');

    await user.click(screen.getByText('Update'));

    expect(removeItem).toHaveBeenCalledTimes(1);
    expect(removeItem).toHaveBeenCalledWith(31);

    const item = {
            "requirement": { id: 31, identifier: 'NFR-01', title: 'Response time' },
            "category": categories[0],
            "subCategory": {
              "id": 10,
              "name": "Time Behaviour",
            },
            "context": "",
            "id": "200",
            "measurementMethod": "",
            "notes": "",
            "targetValue": '2s',
            "systemResponse": 'Responds in 2s',
            "owner": 'Team B',
            "acceptanceCriteria": 'p95 under 2s',
            "thresholdValue": "",
            "trigger": "",
            "unit": "",
    };
    expect(addItem).toHaveBeenCalledWith(item);
  });

  it('remove an existing requirement previously added to a report', async () => {
    const setCategoryId = vi.fn();
    const setSubCategoryId = vi.fn();
    const setSubCategories = vi.fn();
    const addItem = vi.fn();
    const removeItem = vi.fn();

    renderReportForm({
      //mode: 'edit',
      loaderData: {
        categories,
        report: { id: 1, name: 'Alpha', description: 'A sample report' },
      },
      display: {
        categoryId: 1,
        subCategoryId: null,
        subCategories: categories[0].subCategories,
        setCategoryId,
        setSubCategoryId,
        setSubCategories,
      },
      cart: {
        items: [{
          requirement: { id: 31, identifier: 'NFR-01', title: 'Response time' },
          category: { id: 1, name: 'Performance' },
          subCategory: { id: 10, name: 'Time Behaviour' },
          id: '200',
          targetValue: '1s',
          thresholdValue: '',
          unit: '',
          measurementMethod: '',
          trigger: '',
          context: '',
          systemResponse: 'old response',
          owner: 'Team A',
          acceptanceCriteria: 'old criteria',
          notes: '',
        }],
        addItem,
        removeItem,
        clearCart: vi.fn(),
        setItems: vi.fn(),
      },
    });

    getRequirementsForSubCategory.mockResolvedValueOnce([
      { id: 31, identifier: 'NFR-01', title: 'Response time' },
    ]);

    const user = userEvent.setup();
    await user.click(screen.getByText(/Time Behaviour/));
    await user.click(screen.getByText(/^Remove/));

    expect(removeItem).toHaveBeenCalledTimes(1);
    expect(removeItem).toHaveBeenCalledWith(31);
  });

  it('Clicking on home resets category and subCategory selection', async () => {
    const setCategoryId = vi.fn();
    const setSubCategoryId = vi.fn();
    const setSubCategories = vi.fn();

    renderReportForm({
      loaderData: {
        categories,
        report: { id: 1, name: 'Alpha', description: 'A sample report' },
      },
      display: {
        categoryId: 1,
        subCategoryId: null,
        subCategories: categories[0].subCategories,
        setCategoryId,
        setSubCategoryId,
        setSubCategories,
      },
    });

    const user = userEvent.setup();
    await user.click(screen.getByText(/Home/));

    expect(setCategoryId).toHaveBeenCalledWith(null);
    expect(setSubCategoryId).toHaveBeenCalledWith(null);
    expect(setSubCategories).toHaveBeenCalledWith([]);
  });

  it('Clicking on close closes the modal window', async () => {
    const setCategoryId = vi.fn();
    const setSubCategoryId = vi.fn();
    const setSubCategories = vi.fn();
    const addItem = vi.fn();

    renderReportForm({
      mode: 'new',
      loaderData: {
        categories,
        report: { id: 1, name: 'Alpha', description: 'A sample report' },
      },
      display: {
        categoryId: 1,
        subCategoryId: 10,
        subCategories: categories[0].subCategories,
        setCategoryId,
        setSubCategoryId,
        setSubCategories,
      },
      cart: {
        items: [],
        addItem,
        removeItem: vi.fn(),
        clearCart: vi.fn(),
        setItems: vi.fn(),
      },
    });

    getRequirementsForSubCategory.mockResolvedValueOnce([
      { id: 31, identifier: 'NFR-01', title: 'Response time' },
    ]);

    const user = userEvent.setup();
    await user.click(screen.getByText('Time Behaviour'));
    await user.click(screen.getByText('Add'));
    expect(screen.getByLabelText(/target value/i)).toBeInTheDocument();
    await user.click(screen.getByText('Close'));
    expect(screen.queryByLabelText(/target value/i)).not.toBeInTheDocument();
  });

  it('click on cart, verify contents', async () => {
    const setCategoryId = vi.fn();
    const setSubCategoryId = vi.fn();
    const setSubCategories = vi.fn();
    const addItem = vi.fn();

    renderReportForm({
      mode: 'new',
      loaderData: {
        categories,
        report: { id: 1, name: 'Alpha', description: 'A sample report' },
      },
      display: {
        categoryId: 1,
        subCategoryId: 10,
        subCategories: categories[0].subCategories,
        setCategoryId,
        setSubCategoryId,
        setSubCategories,
      },
      cart: {
        items: [{
          requirement: { id: 31, identifier: 'NFR-01', title: 'Response time' },
          category: { id: 1, name: 'Performance' },
          subCategory: { id: 10, name: 'Time Behaviour' },
          id: '200',
          targetValue: '1s',
          thresholdValue: '',
          unit: '',
          measurementMethod: '',
          trigger: '',
          context: '',
          systemResponse: 'old response',
          owner: 'Team A',
          acceptanceCriteria: 'old criteria',
          notes: '',
        }],
        addItem,
        removeItem: vi.fn(),
        clearCart: vi.fn(),
        setItems: vi.fn(),
      },
    });

//     getRequirementsForSubCategory.mockResolvedValueOnce([
//       { id: 31, identifier: 'NFR-01', title: 'Response time' },
//     ]);

    const user = userEvent.setup();
    await user.click(screen.getByText('1'));

    expect(screen.getByText(/response time/i)).toBeInTheDocument();
  });

  it('view cart, then close it', async () => {
    const setCategoryId = vi.fn();
    const setSubCategoryId = vi.fn();
    const setSubCategories = vi.fn();
    const addItem = vi.fn();

    renderReportForm({
      mode: 'new',
      loaderData: {
        categories,
        report: { id: 1, name: 'Alpha', description: 'A sample report' },
      },
      display: {
        categoryId: 1,
        subCategoryId: 10,
        subCategories: categories[0].subCategories,
        setCategoryId,
        setSubCategoryId,
        setSubCategories,
      },
      cart: {
        items: [{
          requirement: { id: 31, identifier: 'NFR-01', title: 'Response time' },
          category: { id: 1, name: 'Performance' },
          subCategory: { id: 10, name: 'Time Behaviour' },
          id: '200',
          targetValue: '1s',
          thresholdValue: '',
          unit: '',
          measurementMethod: '',
          trigger: '',
          context: '',
          systemResponse: 'old response',
          owner: 'Team A',
          acceptanceCriteria: 'old criteria',
          notes: '',
        }],
        addItem,
        removeItem: vi.fn(),
        clearCart: vi.fn(),
        setItems: vi.fn(),
      },
    });

    const user = userEvent.setup();
    await user.click(screen.getByText('1'));

    expect(screen.getByText(/^close$/i)).toBeInTheDocument();
    await user.click(screen.getByText('Close'));
    expect(screen.queryByText(/^close$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/response time/i)).not.toBeInTheDocument();
  });

  it('click on category breadcrumb', async () => {
    const setCategoryId = vi.fn();
    const setSubCategoryId = vi.fn();
    const setSubCategories = vi.fn();
    const addItem = vi.fn();

    renderReportForm({
      mode: 'new',
      loaderData: {
        categories,
        report: { id: 1, name: 'Alpha', description: 'A sample report' },
      },
      display: {
        categoryId: 1,
        subCategoryId: 10,
        subCategories: categories[0].subCategories,
        setCategoryId,
        setSubCategoryId,
        setSubCategories,
      },
      cart: {
        items: [{
          requirement: { id: 31, identifier: 'NFR-01', title: 'Response time' },
          category: { id: 1, name: 'Performance' },
          subCategory: { id: 10, name: 'Time Behaviour' },
          id: '200',
          targetValue: '1s',
          thresholdValue: '',
          unit: '',
          measurementMethod: '',
          trigger: '',
          context: '',
          systemResponse: 'old response',
          owner: 'Team A',
          acceptanceCriteria: 'old criteria',
          notes: '',
        }],
        addItem,
        removeItem: vi.fn(),
        clearCart: vi.fn(),
        setItems: vi.fn(),
      },
    });

    const user = userEvent.setup();

    // Once the breadcrumb exists:
    await user.click(screen.getByRole('link', { name: 'Performance' }));
    expect(setCategoryId).toHaveBeenCalledWith(1);
    expect(setSubCategoryId).toHaveBeenCalledWith(null);
    expect(setSubCategories).toHaveBeenCalledWith(categories[0].subCategories);

  });

  it('view cart, then close it by backdrop click', async () => {
    const setCategoryId = vi.fn();
    const setSubCategoryId = vi.fn();
    const setSubCategories = vi.fn();
    const addItem = vi.fn();

    renderReportForm({
      mode: 'new',
      loaderData: {
        categories,
        report: { id: 1, name: 'Alpha', description: 'A sample report' },
      },
      display: {
        categoryId: 1,
        subCategoryId: 10,
        subCategories: categories[0].subCategories,
        setCategoryId,
        setSubCategoryId,
        setSubCategories,
      },
      cart: {
        items: [{
          requirement: { id: 31, identifier: 'NFR-01', title: 'Response time' },
          category: { id: 1, name: 'Performance' },
          subCategory: { id: 10, name: 'Time Behaviour' },
          id: '200',
          targetValue: '1s',
          thresholdValue: '',
          unit: '',
          measurementMethod: '',
          trigger: '',
          context: '',
          systemResponse: 'old response',
          owner: 'Team A',
          acceptanceCriteria: 'old criteria',
          notes: '',
        }],
        addItem,
        removeItem: vi.fn(),
        clearCart: vi.fn(),
        setItems: vi.fn(),
      },
    });

    const user = userEvent.setup();
    await user.click(screen.getByText('1'));

    expect(screen.getByText(/response time/i)).toBeInTheDocument();
    await user.click(screen.getByTestId('modal-backdrop'));
    expect(screen.queryByText(/response time/i)).not.toBeInTheDocument();
  });

  it('add a requirement to a report, close modal by backdrop click', async () => {
    const setCategoryId = vi.fn();
    const setSubCategoryId = vi.fn();
    const setSubCategories = vi.fn();
    const addItem = vi.fn();

    renderReportForm({
      mode: 'new',
      loaderData: {
        categories,
        report: { id: 1, name: 'Alpha', description: 'A sample report' },
      },
      display: {
        categoryId: 1,
        subCategoryId: 10,
        subCategories: categories[0].subCategories,
        setCategoryId,
        setSubCategoryId,
        setSubCategories,
      },
      cart: {
        items: [],
        addItem,
        removeItem: vi.fn(),
        clearCart: vi.fn(),
        setItems: vi.fn(),
      },
    });

    getRequirementsForSubCategory.mockResolvedValueOnce([
      { id: 31, identifier: 'NFR-01', title: 'Response time' },
    ]);

    const user = userEvent.setup();
    await user.click(screen.getByText('Time Behaviour'));
    await user.click(screen.getByText('Add'));
    expect(screen.getByText(/target value/i)).toBeInTheDocument();
    await user.click(screen.getByTestId('modal-backdrop'));
    expect(screen.queryByText(/target value/i)).not.toBeInTheDocument();

  });

});