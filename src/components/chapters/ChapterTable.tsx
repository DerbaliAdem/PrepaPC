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
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="sticky left-0 z-10 bg-surface py-3 pr-4 pl-5 text-xs font-medium uppercase tracking-wider text-faint">Chapitre</th>
            {years.map((y) => {
              const exams = examsFor(subject, y).filter((e) => e.pdfUrl);
              return (
                <th key={y} scope="col" className="w-16 px-1 py-3 text-center">
                  {exams.length === 1 ? (
                    <Link to={`/archives/${exams[0].id}`} title={`Ouvrir ${exams[0].title} ${y}`} className="rounded px-1.5 py-0.5 font-serif text-[15px] font-medium tabular text-accent hover:bg-accent-soft">
                      {y}
                    </Link>
                  ) : exams.length > 1 ? (
                    <Link to={`/archives?annee=${y}&matiere=${subject}`} title={`${exams.length} épreuves en ${y}`} className="rounded px-1.5 py-0.5 font-serif text-[15px] font-medium tabular text-accent hover:bg-accent-soft">
                      {y}
                    </Link>
                  ) : (
                    <span className="font-serif text-[15px] tabular text-faint">{y}</span>
                  )}
                </th>
              );
            })}
            <th scope="col" className="w-14 py-3 pr-5 text-right text-xs font-medium uppercase tracking-wider text-faint">Total</th>
          </tr>
        </thead>
        {categories.map((cat) => (
          <tbody key={cat}>
            <tr>
              <th colSpan={years.length + 2} scope="colgroup" className="sticky left-0 bg-surface px-5 pt-4 pb-1 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-faint">
                {cat}
              </th>
            </tr>
            {rows
              .filter((r) => r.chapter.category === cat)
              .map(({ chapter, byYear, count }) => (
                <tr key={chapter.id} className="group border-b border-line/70 last:border-0">
                  <th scope="row" className="sticky left-0 z-10 bg-surface py-0 pr-4 pl-5 font-normal group-hover:bg-sunken">
                    <button type="button" onClick={() => onSelect(chapter.id)} className="flex w-full items-center gap-2.5 py-2.5 text-left text-sm text-ink hover:text-accent">
                      <StatusDot status={statusOf(chapter.id)} />
                      {chapter.name}
                    </button>
                  </th>
                  {years.map((y) => {
                    const exams = byYear.get(y);
                    return (
                      <td key={y} className="px-1 py-1.5 text-center group-hover:bg-sunken">
                        {exams ? (
                          <Link
                            to={`/archives/${exams[0].id}`}
                            title={`${chapter.name} — ${exams.map((e) => e.title).join(', ')} ${y}`}
                            aria-label={`Présent en ${y} — ouvrir l'épreuve`}
                            className="mx-auto grid size-7 place-items-center rounded bg-accent text-accent-ink transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_10px_-4px_var(--accent)] active:scale-95"
                          >
                            <Check size={15} strokeWidth={2.5} />
                          </Link>
                        ) : (
                          <span aria-label={`Absent en ${y}`} className="text-faint">—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="py-1.5 pr-5 text-right text-sm tabular text-muted group-hover:bg-sunken">{count}</td>
                </tr>
              ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
