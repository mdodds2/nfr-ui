import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loader } from './EditRequirement-loader.js';
import { getRequirement } from '../util/http.js';

vi.mock('../util/http.js', () => ({ getRequirement: vi.fn() }));

const requirement = { id: 1, name: 'Performance' };

describe('Edit Requirement loader', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads the requirement', async () => {
    getRequirement.mockResolvedValueOnce(requirement);
    const result = await loader({ params: { id: '1' } } );
    expect(getRequirement).toHaveBeenCalledWith('1');
    expect(result).toEqual( requirement );
  });

  it('does not load a requirement when a fetch fails', async () => {
    getRequirement.mockRejectedValueOnce(new Error('boom'));
    await expect(loader({ params: { id: '1' } })).rejects.toThrow('boom');
  });
});