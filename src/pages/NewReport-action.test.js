import { describe, it, expect, vi, beforeEach } from 'vitest';
import { action } from './NewReport-action';
import { addNewReport } from '../util/http.js';
import { getUserData } from '../util/auth.js';

vi.mock('../util/http.js', () => ({ addNewReport: vi.fn() }));
vi.mock('../util/auth.js', () => ({ getUserData: vi.fn() }));

const res = (status, body = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

const createReportRequest = (title, description) => {
  const form = new FormData();
  form.append('title', title);
  form.append('description', description);
  return new Request('http://localhost/reports', { method: 'POST', body: form });
};

const item = {
  requirement: { id: 100 },
  targetValue: 'targetValue',
  thresholdValue: 'thresholdValue',
  unit: 'unit',
  measurementMethod: 'measurementMethod',
  trigger: 'trigger',
  context: 'context',
  systemResponse: 'systemResponse',
  owner: 'owner',
  acceptanceCriteria: 'acceptanceCriteria',
  notes: 'notes',
};
const cartRef = { current: { items: [item], clearCart: vi.fn() } };

describe('New Report action', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getUserData.mockReturnValue({ id: 7 });
  });

  it('New Report with no items', async () => {
    const emptyCartRef = { current: { items: [], clearCart: vi.fn() } };
    const result = await action(emptyCartRef)({
      request: createReportRequest('title', 'description'),
    });
    expect(result.error).toBe('Please select at least 1 Quality Attribute to create this report.');
    expect(addNewReport).not.toHaveBeenCalled();
  });

  it.each([400, 409])('New Report api returns an error on %i', async (status) => {
    addNewReport.mockResolvedValueOnce(res(status, { status, message: 'An error has occurred' }));
    const result = await action(cartRef)({ request: createReportRequest('title', 'description') });
    expect(result.status).toBe(status);
    expect(result.message).toBe('An error has occurred');
    expect(addNewReport).toHaveBeenCalledTimes(1);
  });

  it('500 error', async () => {
    addNewReport.mockResolvedValueOnce(res(500));
    const result = await action(cartRef)({ request: createReportRequest('title', 'description') });
    expect(result.error).toBe('System error when adding report.');
    expect(addNewReport).toHaveBeenCalledTimes(1);
    expect(cartRef.current.clearCart).not.toHaveBeenCalled();
  });

  it('Success', async () => {
    addNewReport.mockResolvedValueOnce(res(200));
    const result = await action(cartRef)({ request: createReportRequest('title', 'description') });
    expect(result.status).toBe(302);
    expect(addNewReport).toHaveBeenCalledTimes(1);
    expect(result.headers.get('Location')).toBe('/reports');
    expect(cartRef.current.clearCart).toHaveBeenCalled();
    const expectedReport = {
      userId: 7,
      name: 'title',
      description: 'description',
      requirementIds: [100],
      measurements: [
        {
          requirementId: 100,
          targetValue: 'targetValue',
          thresholdValue: 'thresholdValue',
          unit: 'unit',
          measurementMethod: 'measurementMethod',
          trigger: 'trigger',
          context: 'context',
          systemResponse: 'systemResponse',
          owner: 'owner',
          acceptanceCriteria: 'acceptanceCriteria',
          notes: 'notes',
        },
      ],
    };
    expect(addNewReport).toHaveBeenCalledWith(expectedReport);
  });
});
