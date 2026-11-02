import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Case, Notification } from './types';
import { loadCases, saveCases, generateId } from './utils';

// ─── Context shape ─────────────────────────────────────────────────────────────

interface AppContextType {
  // Cases (localStorage-backed)
  cases: Case[];
  addCase: (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateCase: (id: string, updates: Partial<Case>) => void;
  deleteCase: (id: string) => void;
  // Notifications
  notifications: Notification[];
  showNotification: (type: Notification['type'], message: string) => void;
  // Sidebar (mobile open/close)
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [cases, setCases]                   = useState<Case[]>(() => loadCases());
  const [notifications, setNotifications]   = useState<Notification[]>([]);
  const [sidebarOpen, setSidebarOpen]       = useState(false);

  // Persist cases to localStorage whenever they change
  useEffect(() => {
    saveCases(cases);
  }, [cases]);

  // ── Case mutations ──────────────────────────────────────────────────────────

  const addCase = useCallback((
    caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>
  ): string => {
    const id  = generateId();
    const now = new Date().toISOString();
    const newCase: Case = { ...caseData, id, createdAt: now, updatedAt: now };
    setCases(prev => [newCase, ...prev]);
    return id;
  }, []);

  const updateCase = useCallback((id: string, updates: Partial<Case>): void => {
    setCases(prev =>
      prev.map(c =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      )
    );
  }, []);

  const deleteCase = useCallback((id: string): void => {
    setCases(prev => prev.filter(c => c.id !== id));
  }, []);

  // ── Notifications ───────────────────────────────────────────────────────────

  function showNotification(type: Notification['type'], message: string) {
    const id = generateId();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  }

  return (
    <AppContext.Provider value={{
      cases, addCase, updateCase, deleteCase,
      notifications, showNotification,
      sidebarOpen, setSidebarOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
