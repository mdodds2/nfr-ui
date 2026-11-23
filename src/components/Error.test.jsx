import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

import ErrorPage from './Error.jsx';

vi.mock('react-router-dom', () => ({ useRouteError: vi.fn(), isRouteErrorResponse: vi.fn() }));

function renderErrorPage(isRouteError, routeError) {
  isRouteErrorResponse.mockReturnValue(isRouteError);
  useRouteError.mockReturnValue(routeError);

  return render(<ErrorPage />);
}

describe('ErrorPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('route error with statusText', () => {
    renderErrorPage(true, { statusText: 'Not Found' });
    expect(screen.getByText('Not Found')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'An error has occurred.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/main');
  });

  it('route error with message', () => {
    renderErrorPage(true, { message: 'Unexpected Error' });
    expect(screen.getByText('Unexpected Error')).toBeInTheDocument();
  });

  it('no route error with message', () => {
    renderErrorPage(false, { message: 'Some kind of error' });
    expect(screen.getByText('Some kind of error')).toBeInTheDocument();
  });

  it('no route error without message', () => {
    renderErrorPage(false, {});
    expect(screen.getByText('Unknown error')).toBeInTheDocument();
  });
});
