import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import TwoColumnRow from './TwoColumnRow.jsx';

describe('TwoColumnRow', () => {
  it('renders two column row', () => {
    render(
      <table>
        <tbody>
          <TwoColumnRow title="Test Title" value="Test Value" />
        </tbody>
      </table>
    );
    expect(screen.getByText('Test Title:')).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });
});
