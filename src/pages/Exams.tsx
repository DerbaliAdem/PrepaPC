import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, Moon, Sun } from 'lucide-react';
import ExamFilters, { EMPTY_FILTERS, type ExamFilterState } from '../components/exams/ExamFilters';
import { ExamMobileCard, ExamRow } from '../components/exams/ExamRow';
import { EmptyState } from '../components/ui/primitives';
import { getExams, getYears } from '../services/examService';
import { appearancesForExam, getChapter } from '../services/chapterService';
import { useTheme } from '../hooks/useTheme';
import { SUBJECTS, SUBJECT_LABEL, type Subject } from '../types';

const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

export default function Exams() {
  const [params] = useSearchParams();
  const { theme, toggle } = useTheme();
  const [filters, setFilters] = useState<ExamFilterState>(() => ({
    ...EMPTY_FILTERS,
    year: params.get('annee') ?? '',
    subject: (SUBJECTS.includes(params.get('matiere') as Subject) ? params.get('matiere') : '') as '' | Subject,
  }));
  const all = getExams();
  const years = getYears();
  // The latest year starts open; the others are collapsed until clicked.
  const [openYears, setOpenYears] = useState<Set<number>>(() => new Set([years[years.length - 1]]));
  const [openRow, setOpenRow] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = norm(filters.q.trim());
    return all.filter((e) => {
      if (filters.year && e.year !== Number(filters.year)) return false;
      if (filters.subject && e.subject !== filters.subject) return false;
      if (filters.withCorrection && !e.correctionIncluded && !e.correctionUrl) return false;
      if (!q) return true;
      const chapters = appearancesForExam(e.id).map((a) => `${getChapter(a.chapterId)?.name ?? ''} ${a.questionReferences ?? ''}`);
      const hay = norm([e.year, e.title, SUBJECT_LABEL[e.subject], ...chapters].join(' '));
      return q.split(/\s+/).every((w) => hay.includes(w));
    });
  }, [all, filters]);

  const filtering = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);
  const groups = [...new Set(results.map((e) => e.year))].map((y) => ({ year: y, exams: results.filter((e) => e.year === y) }));
  const toggleYear = (y: number) =>
    setOpenYears((s) => {
      const n = new Set(s);
      if (n.has(y)) n.delete(y);
      else n.add(y);
      return n;
    });

  return (
    <div className="mx-auto flex max-w-[1040px] flex-col gap-7 max-sm:gap-4">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-medium tracking-[0.14em] text-muted lg:hidden">PRÉPA PC · ANNALES</span>
          <h1 className="font-serif text-[40px] leading-[1.1] font-semibold tracking-[-0.01em] max-sm:text-[30px] max-sm:leading-[1.15]">
            <span className="max-sm:hidden">Archives des concours</span>
            <span className="sm:hidden">Archives</span>
          </h1>
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          className="inline-flex size-11 items-center justify-center rounded-xl border border-line bg-surface text-ink lg:hidden"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <ExamFilters value={filters} onChange={setFilters} years={years} />

      {groups.length === 0 && (
        <div className="rounded-2xl border border-line bg-surface">
          <EmptyState title="Aucune épreuve ne correspond">Modifiez la recherche ou les filtres.</EmptyState>
        </div>
      )}

      {groups.map(({ year, exams }) => {
        const open = filtering || openYears.has(year);
        if (!open)
          return (
            <button
              key={year}
              type="button"
              aria-expanded={false}
              onClick={() => toggleYear(year)}
              className="flex h-16 w-full items-center justify-between rounded-2xl border border-line bg-surface px-5 text-ink hover:bg-sunken"
            >
              <span className="flex items-baseline gap-3">
                <span className="font-serif text-[22px] font-semibold tabular">{year}</span>
                <span className="text-sm text-muted">Afficher les {exams.length} épreuves</span>
              </span>
              <ChevronDown size={18} className="text-muted" />
            </button>
          );
        return (
          <section key={year} aria-labelledby={`y${year}`} className="flex flex-col gap-3 max-sm:gap-2.5">
            <button
              type="button"
              onClick={() => !filtering && toggleYear(year)}
              aria-expanded
              className="flex items-baseline gap-3 self-start text-left"
            >
              <h2 id={`y${year}`} className="font-serif text-[26px] font-semibold tabular max-sm:text-[22px]">{year}</h2>
              <span className="text-sm text-muted">{exams.length} épreuve{exams.length > 1 ? 's' : ''}</span>
            </button>
            <div className="overflow-hidden rounded-2xl border border-line bg-surface max-sm:hidden">
              {exams.map((e) => (
                <ExamRow key={e.id} exam={e} open={openRow === e.id} onToggle={() => setOpenRow(openRow === e.id ? null : e.id)} />
              ))}
            </div>
            <div className="flex flex-col gap-2.5 sm:hidden">
              {exams.map((e) => (
                <ExamMobileCard key={e.id} exam={e} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
