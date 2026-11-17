import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import OrgPicker from './OrgPicker.jsx';
import { OrgProvider } from '../store/org-context.jsx';

describe('OrgPicker', () => {
  const org1 = { id: '111', name: 'Organization 1' };
  const org2 = { id: '222', name: 'Organization 2' };

  beforeEach(() => localStorage.clear());

  it('saves the selected org', async () => {
    render(
      <OrgProvider orgs={[org1, org2]}>
        <OrgPicker />
      </OrgProvider>
    );

    const user = userEvent.setup();
    const picker = screen.getByRole('combobox', { name: 'Organization' });
    expect(picker).toHaveValue('111');
    await user.selectOptions(picker, 'Organization 2');
    expect(picker).toHaveValue('222');
    expect(localStorage.getItem('currentOrgId')).toBe('222');
  });

  it('starts on the saved org', async () => {
    localStorage.setItem('currentOrgId', '222');

    render(
      <OrgProvider orgs={[org1, org2]}>
        <OrgPicker />
      </OrgProvider>
    );

    const picker = screen.getByRole('combobox', { name: 'Organization' });
    expect(picker).toHaveValue('222');
  });
});
