import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import Profile from './Profile.jsx';

vi.mock('../components/UserProfile.jsx', () => ({ default: () => <div>UserProfile</div> }));
vi.mock('../components/ChangePassword.jsx', () => ({ default: () => <div>ChangePassword</div> }));

describe('Profile', () => {
  it('renders user profile page', () => {
    render(<Profile />);
    expect(screen.getByText('UserProfile')).toBeInTheDocument();
    expect(screen.getByText('ChangePassword')).toBeInTheDocument();
  });
});
