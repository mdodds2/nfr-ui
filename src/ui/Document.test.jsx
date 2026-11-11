import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import Document from './Document.jsx';

vi.mock('react-router-dom', () => ({ Link: ({ children, to }) => <a href={to}>{children}</a> }));

vi.mock('../assets/java.png', () => ({
  default: 'java.png',
}));

vi.mock('../assets/PDF.png', () => ({
  default: 'PDF.png',
}));

vi.mock('../assets/swagger_logo.png', () => ({
  default: 'swagger_logo.png',
}));

describe('Document', () => {
  it('renders default document tile', () => {
    render(<Document title="Test Document" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Test Document' })).toHaveAttribute('href', '#');
  });

  it('renders javadoc document tile', () => {
    render(<Document type="javadoc" title="Javadoc Document" />);
    expect(screen.getByRole('img', { name: 'JavaDoc' })).toHaveAttribute('src', 'java.png');
    expect(screen.getByRole('link', { name: 'Javadoc Document' })).toBeInTheDocument();
  });

  it('renders PDF document tile', () => {
    render(<Document type="pdf" title="PDF Document" />);
    expect(screen.getByRole('img', { name: 'PDF' })).toHaveAttribute('src', 'PDF.png');
    expect(screen.getByRole('link', { name: 'PDF Document' })).toBeInTheDocument();
  });

  it('renders swagger document tile', () => {
    render(<Document type="swagger" title="Swagger Document" />);
    expect(screen.getByRole('img', { name: 'Swagger' })).toHaveAttribute('src', 'swagger_logo.png');
    expect(screen.getByRole('link', { name: 'Swagger Document' })).toBeInTheDocument();
  });
});
