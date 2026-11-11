import { useSyncExternalStore } from 'react';

export type ExamStatus = 'a-faire' | 'fait' | 'a-refaire';
export const EXAM_STATUS_KEY = 'prepa-exam-status';
export const EXAM_STATUS_LABEL: Record<ExamStatus, string> = { 'a-faire': 'À faire', fait: 'Fait', 'a-refaire': 'À refaire' };

const listeners = new Set<() => void>();
let cache: Record<string, ExamStatus> = read();

function read(): Record<string, ExamStatus> {
  try {
    return JSON.parse(localStorage.getItem(EXAM_STATUS_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function setStatus(examId: string, status: ExamStatus) {
  const next = { ...cache };
  if (status === 'a-faire') delete next[examId];
  else next[examId] = status;
  cache = next;
  try {
    localStorage.setItem(EXAM_STATUS_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Whether a paper has been practised; shared by every component showing it. */
export function useExamStatus(examId: string) {
  const all = useSyncExternalStore(subscribe, () => cache);
  return [all[examId] ?? 'a-faire', (s: ExamStatus) => setStatus(examId, s)] as const;
}

const ORDER: ExamStatus[] = ['a-faire', 'fait', 'a-refaire'];
const ACTIVE: Record<ExamStatus, string> = {
  'a-faire': 'bg-surface text-ink shadow-sm',
  fait: 'bg-ok-soft text-ok shadow-sm',
  'a-refaire': 'bg-warn-soft text-warn shadow-sm',
};

export function ExamStatusControl({ examId }: { examId: string }) {
  const [status, set] = useExamStatus(examId);
  return (
    <div role="radiogroup" aria-label="Statut de l'épreuve" className="inline-flex rounded-[10px] bg-sunken p-0.5">
      {ORDER.map((s) => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={status === s}
          onClick={() => set(s)}
          className={`h-8 rounded-lg px-3 text-[13px] whitespace-nowrap ${status === s ? `${ACTIVE[s]} font-semibold` : 'text-muted hover:text-ink'}`}
        >
          {EXAM_STATUS_LABEL[s]}
        </button>
      ))}
    </div>
  );
}

/** Small badge for lists; nothing for papers not yet done. */
export function ExamStatusBadge({ examId }: { examId: string }) {
  const [status] = useExamStatus(examId);
  if (status === 'a-faire') return null;
  return (
    <span className={`ml-2 inline-flex h-5 items-center rounded-full px-2 align-middle text-[11px] font-semibold ${status === 'fait' ? 'bg-ok-soft text-ok' : 'bg-warn-soft text-warn'}`}>
      {EXAM_STATUS_LABEL[status]}
    </span>
  );
}
