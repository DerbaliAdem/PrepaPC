import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import type { Subject } from '../../types';
import { buildAppearanceMatrix } from '../../utils/chapterAnalysis';
import { examsFor } from '../../services/examService';
import { useRevisionProgress } from '../../hooks/useRevisionProgress';
import { StatusDot } from './RevisionStatus';

export default function ChapterTable({ subject, years, onSelect }: { subject: Subject; years: number[]; onSelect: (id: string) => void }) {
  const rows = buildAppearanceMatrix(subject, years);
  const { statusOf } = useRevisionProgress();
  const categories = [...new Set(rows.map((r) => r.chapter.category))];

  if (!years.length) return <p className="px-5 py-10 text-center text-sm text-muted">Aucune année dans cet intervalle.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left sm:min-w-[560px]">
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="sticky left-0 z-10 bg-surface py-3 pr-4 pl-5 max-sm:pr-2 max-sm:pl-4 max-sm:shadow-[1px_0_0_var(--line)] text-xs font-medium uppercase tracking-wider text-faint">Chapitre</th>
            {years.map((y) => {
              const exams = examsFor(subject, y).filter((e) => e.pdfUrl);
              return (
                <th key={y} scope="col" className="w-16 px-1 py-3 text-center max-sm:w-11 max-sm:px-0">
                  {exams.length === 1 ? (
                    <Link to={`/archives/${exams[0].id}`} title={`Ouvrir ${exams[0].title} ${y}`} className="rounded px-1.5 py-0.5 font-serif text-[15px] max-sm:text-[13px] font-medium tabular text-accent hover:bg-accent-soft">
                      {y}
                    </Link>
                  ) : exams.length > 1 ? (
                    <Link to={`/archives?annee=${y}&matiere=${subject}`} title={`${exams.length} épreuves en ${y}`} className="rounded px-1.5 py-0.5 font-serif text-[15px] max-sm:text-[13px] font-medium tabular text-accent hover:bg-accent-soft">
                      {y}
                    </Link>
                  ) : (
                    <span className="font-serif text-[15px] max-sm:text-[13px] tabular text-faint">{y}</span>
                  )}
                </th>
              );
            })}
            <th scope="col" className="w-14 py-3 pr-5 max-sm:pr-4 max-sm:pl-2 text-right text-xs font-medium uppercase tracking-wider text-faint">Total</th>
          </tr>
        </thead>
        {categories.map((cat) => (
          <tbody key={cat}>
            <tr>
              <th colSpan={years.length + 2} scope="colgroup" className="bg-surface px-5 max-sm:px-4 pt-4 pb-1 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-faint">
                <span className="sticky left-5 max-sm:left-4 inline-block">{cat}</span>
              </th>
            </tr>
            {rows
              .filter((r) => r.chapter.category === cat)
              .map(({ chapter, byYear, count }) => (
                <tr key={chapter.id} className="group border-b border-line/70 last:border-0">
                  <th scope="row" className="sticky left-0 z-10 bg-surface py-0 pr-4 pl-5 max-sm:w-[150px] max-sm:min-w-[150px] max-sm:max-w-[150px] max-sm:pr-2 max-sm:pl-4 max-sm:shadow-[1px_0_0_var(--line)] font-normal group-hover:bg-sunken">
                    <button type="button" onClick={() => onSelect(chapter.id)} className="flex w-full items-center gap-2.5 py-2.5 text-left text-sm max-sm:text-[13px] max-sm:leading-snug text-ink hover:text-accent">
                      <StatusDot status={statusOf(chapter.id)} />
                      {chapter.name}
                    </button>
                  </th>
                  {years.map((y) => {
                    const exams = byYear.get(y);
                    return (
                      <td key={y} className="px-1 max-sm:px-0 py-1.5 text-center group-hover:bg-sunken">
                        {exams ? (
                          <Link
                            to={`/archives/${exams[0].id}`}
                            title={`${chapter.name} — ${exams.map((e) => e.title).join(', ')} ${y}`}
                            aria-label={`Présent en ${y} — ouvrir l'épreuve`}
                            className="mx-auto grid size-7 max-sm:size-6 place-items-center rounded bg-accent text-accent-ink transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_10px_-4px_var(--accent)] active:scale-95"
                          >
                            <Check size={15} strokeWidth={2.5} />
                          </Link>
                        ) : (
                          <span aria-label={`Absent en ${y}`} className="text-faint">—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="py-1.5 pr-5 max-sm:pr-4 max-sm:pl-2 text-right text-sm tabular text-muted group-hover:bg-sunken">{count}</td>
                </tr>
              ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
