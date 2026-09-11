import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '@/styles/theme';
import { ConfirmDialog } from './ConfirmDialog';

function renderDialog(props: Partial<React.ComponentProps<typeof ConfirmDialog>> = {}) {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();
  return {
    onConfirm,
    onCancel,
    ...render(
      <ThemeProvider theme={lightTheme}>
        <ConfirmDialog
          open={true}
          title="Are you sure?"
          message="This action cannot be undone."
          onConfirm={onConfirm}
          onCancel={onCancel}
          {...props}
        />
      </ThemeProvider>,
    ),
  };
}

describe('ConfirmDialog', () => {
  it('renders title and message when open', () => {
    renderDialog();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('renders nothing when closed', () => {
    renderDialog({ open: false });
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderDialog();
    await user.click(screen.getByRole('button', { name: 'Sync anyway' }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const { onCancel } = renderDialog();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('does not call onCancel when dialog body is clicked', async () => {
    const user = userEvent.setup();
    const { onCancel } = renderDialog();
    await user.click(screen.getByText('Are you sure?'));
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('calls onCancel when Escape is pressed', async () => {
    const user = userEvent.setup();
    const { onCancel } = renderDialog();
    await user.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('uses custom confirm label', () => {
    renderDialog({ confirmLabel: 'Proceed' });
    expect(screen.getByRole('button', { name: 'Proceed' })).toBeInTheDocument();
  });
});
