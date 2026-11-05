import { describe, it, expect, vi, beforeEach } from 'vitest';
import { action } from './EditReport-action';
import { updateReport } from '../util/http.js';
import { getUserData } from '../util/auth.js';

vi.mock('../util/http.js', () => ({ updateReport: vi.fn() }));
vi.mock('../util/auth.js', () => ({ getUserData: vi.fn() }));

const res = (status, body = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

const updateReportRequest = (title, description) => {
  const form = new FormData();
  form.append('title', title);
  form.append('description', description);
  return new Request('http://localhost/reports/1', { method: 'POST', body: form });
};

const item = {
  id: 1,
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

describe('Edit Report action', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getUserData.mockReturnValue({ id: 7 });
  });

  it('Edit Report with no items', async () => {
    const emptyCartRef = { current: { items: [], clearCart: vi.fn() } };
    const result = await action(emptyCartRef)({
      request: updateReportRequest('title', 'description'), params: {'id': 1}
    });
    expect(result.error).toBe('Please select at least 1 Quality Attribute to create this report.');
    expect(updateReport).not.toHaveBeenCalled();
  });

  it.each([400, 409])('Update Report api returns an error on %i', async (status) => {
    updateReport.mockResolvedValueOnce(res(status, { status, message: 'An error has occurred' }));
    const result = await action(cartRef)({ request: updateReportRequest('title', 'description'), params: {'id': 1} });
    expect(result.status).toBe(status);
    expect(result.message).toBe('An error has occurred');
    expect(updateReport).toHaveBeenCalledTimes(1);
  });

  it('500 error', async () => {
    updateReport.mockResolvedValueOnce(res(500));
    const result = await action(cartRef)({ request: updateReportRequest('title', 'description'), params: {'id': 1} });
    expect(result.error).toBe('System error when updating report');
    expect(updateReport).toHaveBeenCalledTimes(1);
    expect(cartRef.current.clearCart).not.toHaveBeenCalled();
  });

  it('Success', async () => {
    updateReport.mockResolvedValueOnce(res(200));
    const cartRef = { current: { items: [item], clearCart: vi.fn() } };
    const result = await action(cartRef)({ request: updateReportRequest('title', 'description'), params: {'id': 1} } );
    expect(result.status).toBe(302);
    expect(updateReport).toHaveBeenCalledTimes(1);
    expect(result.headers.get('Location')).toBe('/reports');
    expect(cartRef.current.clearCart).toHaveBeenCalled();
    const expectedReport = {
      userId: 7,
      name: 'title',
      description: 'description',
      requirementIds: [100],
      measurements: [
        {
          id: 1,
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
    expect(updateReport).toHaveBeenCalledWith(1, expectedReport);
  });

  it('Success with minimal data', async () => {
    updateReport.mockResolvedValueOnce(res(200));

    const minimalItem = {
      requirement: { id: 102},
    };
    const minimalCartRef = { current: { items: [minimalItem], clearCart: vi.fn() } };
    const result = await action(minimalCartRef)({ request: updateReportRequest('title', 'description'), params: {'id': 1} } );

    expect(result.status).toBe(302);
    expect(updateReport).toHaveBeenCalledTimes(1);
    expect(result.headers.get('Location')).toBe('/reports');
    expect(minimalCartRef.current.clearCart).toHaveBeenCalled();

    const expectedReport = {
        userId: 7,
        name: 'title',
        description: 'description',
        requirementIds: [102],
        measurements: [
          {
            id: '',
            requirementId: 102,
            targetValue: '',
            thresholdValue: '',
            unit: '',
            measurementMethod: '',
            trigger: '',
            context: '',
            systemResponse: '',
            owner: '',
            acceptanceCriteria: '',
            notes: '',
          },
        ],
      };
      expect(updateReport).toHaveBeenCalledWith(1, expectedReport);
    });

});
