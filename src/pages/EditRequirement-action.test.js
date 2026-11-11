import { describe, it, expect, vi, beforeEach } from 'vitest';
import { action } from './EditRequirement-action';
import { updateRequirement } from '../util/http.js';

vi.mock('../util/http.js', () => ({ updateRequirement: vi.fn() }));

const res = (status, body = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

const updateRequirementRequest = (identifier, title, description, priority, status, targetValue, thresholdValue, unit, measurementMethod, rationale, source, riskIfViolated ) => {
  const form = new FormData();
  form.append('subCategory', "1");
  form.append('identifier', identifier);
  form.append('title', title);
  form.append('description', description);
  form.append('priority', priority);
  form.append('status', status);
  form.append('targetValue', targetValue);
  form.append('thresholdValue', thresholdValue);
  form.append('unit', unit);
  form.append('measurementMethod', measurementMethod);
  form.append('rationale', rationale);
  form.append('source', source);
  form.append('riskIfViolated', riskIfViolated);

  return new Request('http://localhost/requirements/1', { method: 'PATCH', body: form });
};

describe('Edit Requirement action', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it.each([400, 409])('Edit Requirement api returns an error on %i', async (status) => {
    updateRequirement.mockResolvedValueOnce(res(status, { status, message: 'An error has occurred' }));
    const result = await action({ request: updateRequirementRequest('TST-TST-' + status, 'Title', 'description', 'priority', 'status', 'targetValue', 'thresholdValue', 'unit', 'measurementMethod', 'rationale', 'source', 'riskIfViolated'), params: {'id': 1} });
    expect(result).toEqual({ status, error: 'An error has occurred' });
    expect(updateRequirement).toHaveBeenCalledTimes(1);
  });

  it('500 error', async () => {
    updateRequirement.mockResolvedValueOnce(res(500, {status: 500, message: "System error when updating requirement"}));
    const result = await action({ request: updateRequirementRequest('TST-TST-1', 'Title', 'description', 'priority', 'status', 'targetValue', 'thresholdValue', 'unit', 'measurementMethod', 'rationale', 'source', 'riskIfViolated'), params: {'id': 1} });
    expect(result).toEqual({ error: 'System error when updating requirement' })
    expect(updateRequirement).toHaveBeenCalledTimes(1);
  });

  it('Success', async () => {
    updateRequirement.mockResolvedValueOnce(res(200));
    const request = { request: updateRequirementRequest('TST-TST-1', 'Title', 'description', 'priority', 'status', 'targetValue', 'thresholdValue', 'unit', 'measurementMethod', 'rationale', 'source', 'riskIfViolated'), params: {'id': 1} };
    const result = await action(request);
    expect(result.status).toBe(302);
    expect(updateRequirement).toHaveBeenCalledTimes(1);
    expect(updateRequirement).toHaveBeenCalledWith(1,
      {
      "subCategoryId": "1",
      "description": "description",
      "identifier": "TST-TST-1",
      "measurementMethod": "measurementMethod",
      "priority": "priority",
      "rationale": "rationale",
      "riskIfViolated": "riskIfViolated",
      "source": "source",
      "status": "status",
      "targetValue": "targetValue",
      "thresholdValue": "thresholdValue",
      "title": "Title",
      "unit": "unit"
      });
      expect(result.headers.get('Location')).toBe('/main/admin');
  });
});

