import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Modal from './Modal.jsx';

describe('Modal', () => {
  it('renders Modal closed', () => {
    const handleClick = vi.fn();
    render(
      <Modal isOpen={false} onClose={handleClick}>
        <p>element representing children</p>
      </Modal>
    );
    expect(screen.queryByTestId('modal-backdrop')).not.toBeInTheDocument();
  });

  it('renders Modal open', () => {
    const handleClick = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClick}>
        <p>element representing children</p>
      </Modal>
    );
    expect(screen.getByText('element representing children')).toBeInTheDocument();
  });

  it('clicking on background called handleClick', async () => {
    const handleClick = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClick}>
        <p>element representing children</p>
      </Modal>
    );
    await userEvent.click(screen.getByTestId('modal-backdrop'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('clicking on content does not call handleClick', async () => {
    const handleClick = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClick}>
        <p>element representing children</p>
      </Modal>
    );
    await userEvent.click(screen.getByText('element representing children'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
