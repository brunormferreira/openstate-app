import type { Toast } from './types';

export function ToastItem({ toast }: { toast: Toast }) {
  const bgColor = toast.type === 'success' ? '#16a34a' : '#dc2626';

  return (
    <div
      role="alert"
      style={{
        padding: '12px 16px',
        borderRadius: 8,
        background: bgColor,
        color: '#fff',
        fontSize: 13,
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        animation: 'toast-in 0.2s ease-out',
      }}
    >
      {toast.message}
    </div>
  );
}
