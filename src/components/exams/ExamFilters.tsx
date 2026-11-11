import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { SUBJECTS, SUBJECT_LABEL, type Subject } from '../../types';

export interface ExamFilterState {
  q: string;
  year: string;
  subject: '' | Subject;
  withCorrection: boolean;
}

export const EMPTY_FILTERS: ExamFilterState = { q: '', year: '', subject: '', withCorrection: false };

const field = 'h-12 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-[15px] text-ink focus:border-accent focus:outline-none max-sm:text-base';

export default function ExamFilters({ value, onChange, years }: { value: ExamFilterState; onChange: (v: ExamFilterState) => void; years: number[] }) {
  const narrow = useNarrow();
  const set = <K extends keyof ExamFilterState>(k: K, v: ExamFilterState[K]) => onChange({ ...value, [k]: v });
  return (
    <section aria-label="Filtres" className="flex flex-col gap-3.5">
      <div className="flex flex-wrap gap-3 max-sm:gap-2.5">
        <label className="relative block flex-[1_1_360px] max-sm:basis-full">
          <span className="sr-only">Rechercher</span>
          <Search size={18} className="pointer-events-none absolute top-[15px] left-4 text-muted" aria-hidden />
          <input
            type="search"
            value={value.q}
            onChange={(e) => set('q', e.target.value)}
            placeholder="Matière, chapitre, année…"
            className={`${field} pl-[46px] placeholder:text-faint`}
          />
        </label>
        <label className="flex flex-[0_1_200px] flex-col gap-1.5 max-sm:flex-1">
          <span className="text-[13px] font-medium text-[#3D4150] sm:sr-only dark:text-muted">Année</span>
          <select className={field} value={value.year} onChange={(e) => set('year', e.target.value)}>
            <option value="">{narrow ? 'Toutes' : 'Toutes les années'}</option>
            {[...years].reverse().map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-[0_1_220px] flex-col gap-1.5 max-sm:flex-1">
          <span className="text-[13px] font-medium text-[#3D4150] sm:sr-only dark:text-muted">Matière</span>
          <select className={field} value={value.subject} onChange={(e) => set('subject', e.target.value as ExamFilterState['subject'])}>
            <option value="">{narrow ? 'Toutes' : 'Toutes les matières'}</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{SUBJECT_LABEL[s]}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex justify-end max-sm:justify-start">
        <label className="flex h-11 cursor-pointer items-center gap-2.5 text-sm text-[#3D4150] dark:text-muted">
          <input type="checkbox" checked={value.withCorrection} onChange={(e) => set('withCorrection', e.target.checked)} className="size-[18px] accent-accent" />
          Seulement avec corrigé
        </label>
      </div>
    </section>
  );
}

/** Phone width: the select labels are shown above, so the options can be short. */
function useNarrow() {
  const q = '(max-width: 639px)';
  const [narrow, setNarrow] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setNarrow(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return narrow;
}
