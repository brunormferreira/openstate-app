import { useEffect, useCallback } from 'react';
import { Overlay, Dialog, Title, Message, ButtonRow, CancelButton, ConfirmButton } from './ConfirmDialog.styles';

interface ConfirmDialogProps {
  readonly open: boolean;
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Sync anyway',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    },
    [onCancel],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <Overlay onClick={onCancel}>
      <Dialog onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonRow>
          <CancelButton type="button" onClick={onCancel}>
            Cancel
          </CancelButton>
          <ConfirmButton type="button" onClick={onConfirm}>
            {confirmLabel}
          </ConfirmButton>
        </ButtonRow>
      </Dialog>
    </Overlay>
  );
}