import { describe, it, expect, vi, beforeEach } from 'vitest';
import { action } from './NewRequirement-action';
import { addNewRequirement } from '../util/http.js';

vi.mock('../util/http.js', () => ({ addNewRequirement: vi.fn() }));

const res = (status, body = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

const createRequirementRequest = (subCategoryId, identifier, title, description, priority, status, targetValue, thresholdValue, unit, measurementMethod, rationale, source, riskIfViolated ) => {
  const form = new FormData();
  form.append('subCategory', subCategoryId);
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

  return new Request('http://localhost/requirements', { method: 'POST', body: form });
};

describe('New Requirement action', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it.each([400, 409])('New Requirement api returns an error on %i', async (status) => {
    addNewRequirement.mockResolvedValueOnce(res(status, { status, message: 'An error has occurred' }));
    const result = await action({ request: createRequirementRequest(1, 'TST-TST-' + status, 'Title', 'description', 'priority', 'status', 'targetValue', 'thresholdValue', 'unit', 'measurementMethod', 'rationale', 'source', 'riskIfViolated') });
    expect(result).toEqual({ status, error: 'An error has occurred' });
    expect(addNewRequirement).toHaveBeenCalledTimes(1)
  });

  it('500 error', async () => {
    addNewRequirement.mockResolvedValueOnce(res(status, { status: 500, message: 'Internal server error' }));
    const result = await action({ request: createRequirementRequest(1, 'TST-TST-1', 'Title', 'description', 'priority', 'status', 'targetValue', 'thresholdValue', 'unit', 'measurementMethod', 'rationale', 'source', 'riskIfViolated') });
    expect(result).toEqual({ error: 'System error when updating requirement' });
    expect(addNewRequirement).toHaveBeenCalledTimes(1);
  });

  it('Success', async () => {
    addNewRequirement.mockResolvedValueOnce(res(201));
    const request = { request: createRequirementRequest(1, 'TST-TST-1', 'Title', 'description', 'priority', 'status', 'targetValue', 'thresholdValue', 'unit', 'measurementMethod', 'rationale', 'source', 'riskIfViolated') };
    const result = await action(request);
    expect(result.status).toBe(302);
    expect(addNewRequirement).toHaveBeenCalledTimes(1);
    expect(addNewRequirement).toHaveBeenCalledWith({
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
      expect(result.headers.get('Location')).toBe('/requirements/displayAll');
  });
});

