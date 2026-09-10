export interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

export interface ToastContextValue {
  addToast: (type: Toast['type'], message: string) => void;
}
