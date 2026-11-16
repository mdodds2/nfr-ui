import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useLoaderData } from 'react-router-dom';

import Profile from './Profile.jsx';

vi.mock('react-router-dom', () => ({ useLoaderData: vi.fn() }));
vi.mock('../components/UserProfile.jsx', () => ({ default: () => <div>UserProfile</div> }));
vi.mock('../components/ChangePassword.jsx', () => ({ default: () => <div>ChangePassword</div> }));

describe('Profile', () => {
  it('renders user profile page', () => {
    const orgs = useLoaderData.mockReturnValue([{ id: 111, name: 'TEST ORG', slug: 'test-org' }]);
    render(<Profile orgs={orgs}/>);
    expect(screen.getByText('UserProfile')).toBeInTheDocument();
    expect(screen.getByText('ChangePassword')).toBeInTheDocument();
  });
});
