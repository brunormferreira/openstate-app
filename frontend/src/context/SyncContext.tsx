import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface SyncContextValue {
  isSyncing: boolean;
  setSyncing: (value: boolean) => void;
}

const SyncContext = createContext<SyncContextValue | undefined>(undefined);

export function SyncProvider({ children }: { readonly children: ReactNode }) {
  const [isSyncing, setSyncing] = useState(false);

  const value = useMemo<SyncContextValue>(() => ({ isSyncing, setSyncing }), [isSyncing]);

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSync(): SyncContextValue {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}