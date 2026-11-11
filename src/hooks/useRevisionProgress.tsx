import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { RevisionProgress, RevisionStatus } from '../types';

const KEY = 'prepa-revision-progress';

type ProgressMap = Record<string, RevisionProgress>;

function load(): ProgressMap {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

interface Ctx {
  progress: ProgressMap;
  statusOf: (chapterId: string) => RevisionStatus;
  setStatus: (chapterId: string, status: RevisionStatus) => void;
  reset: () => void;
}

const RevisionContext = createContext<Ctx | null>(null);

export function RevisionProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressMap>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress));
    } catch {
      /* storage unavailable */
    }
  }, [progress]);

  const setStatus = useCallback((chapterId: string, status: RevisionStatus) => {
    setProgress((p) => {
      const next = { ...p };
      if (status === 'non-commence') delete next[chapterId];
      else next[chapterId] = { chapterId, status, updatedAt: new Date().toISOString() };
      return next;
    });
  }, []);

  const statusOf = useCallback((id: string) => progress[id]?.status ?? 'non-commence', [progress]);
  const reset = useCallback(() => setProgress({}), []);

  return <RevisionContext.Provider value={{ progress, statusOf, setStatus, reset }}>{children}</RevisionContext.Provider>;
}

export function useRevisionProgress() {
  const ctx = useContext(RevisionContext);
  if (!ctx) throw new Error('useRevisionProgress must be used inside RevisionProvider');
  return ctx;
}
