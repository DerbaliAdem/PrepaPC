import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import type { Chapter } from '../../types';
import { SUBJECT_LABEL } from '../../types';
import { chapterHistory, yearsForSubject } from '../../utils/chapterAnalysis';
import { firstPage } from '../../services/chapterService';
import ChapterFrequency from './ChapterFrequency';
import RevisionStatus from './RevisionStatus';
import ExamActions from '../exams/ExamActions';
import { useExamStatus } from '../../hooks/useExamStatus';

/** Done / not done for one paper; shares the Fait status shown in the archive. */
function DoneCheckbox({ examId, label }: { examId: string; label: string }) {
  const [status, setStatus] = useExamStatus(examId);
  const done = status === 'fait';
  return (
    <label className="mt-0.5 flex h-6 shrink-0 cursor-pointer items-start" title={done ? 'Fait' : 'Pas encore fait'}>
      <input
        type="checkbox"
        checked={done}
        onChange={(e) => {
          if (e.target.checked) return setStatus('fait');
          // Unticking by mistake would lose the mark: ask first.
          if (window.confirm(`Retirer la marque « Fait » de ${label} ?`)) setStatus('a-faire');
        }}
        aria-label={`${label} : ${done ? 'fait' : 'pas encore fait'}`}
        className="size-5 cursor-pointer accent-[var(--ok)]"
      />
    </label>
  );
}

export default function ChapterDetails({ chapter, onClose }: { chapter: Chapter; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const history = chapterHistory(chapter.id);
  const years = yearsForSubject(chapter.subject);
  const appearedYears = new Set(history.map((h) => h.exam.year));

  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, chapter.id]);

  return (
    <div className="fixed inset-0 z-30 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="chapter-title">
      <button type="button" aria-label="Fermer" className="absolute inset-0 bg-black/25" onClick={onClose} />
      <div ref={ref} tabIndex={-1} className="page-enter relative flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-line bg-surface shadow-xl outline-none">
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-faint">{SUBJECT_LABEL[chapter.subject]} · {chapter.category}</p>
            <h2 id="chapter-title" className="mt-1 font-serif text-2xl leading-tight font-medium text-ink">{chapter.name}</h2>
            {chapter.description && <p className="mt-1 text-sm text-muted">{chapter.description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="grid size-8 shrink-0 place-items-center rounded-md text-muted hover:bg-sunken"><X size={18} /></button>
        </div>

        <div className="space-y-7 px-6 py-6">
          <div>
            <h3 className="mb-2 text-sm font-medium text-ink">Statut de révision</h3>
            <RevisionStatus chapterId={chapter.id} chapterName={chapter.name} />
          </div>

          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="text-sm font-medium text-ink">Historique des apparitions</h3>
              <p className="text-sm tabular text-muted">
                {appearedYears.size} / {years.length} année{years.length > 1 ? 's' : ''}
              </p>
            </div>
            <ChapterFrequency years={years} appeared={appearedYears} />
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-ink">Épreuves concernées</h3>
            {history.length === 0 ? (
              <p className="text-sm text-muted">Ce chapitre n'apparaît dans aucune épreuve vérifiée de l'archive.</p>
            ) : (
              <ul className="divide-y divide-line border-y border-line">
                {history.map(({ exam, appearance }) => (
                  <li key={exam.id} className="flex gap-3 py-3.5">
                    <DoneCheckbox examId={exam.id} label={`${exam.title} ${exam.year}`} />
                    <div className="min-w-0 flex-1">
                      <Link to={`/archives/${exam.id}`} className="text-sm font-medium text-ink hover:text-accent">
                        {exam.title} <span className="tabular">{exam.year}</span>
                      </Link>
                      {(appearance.part || appearance.pages) && (
                        <p className="mt-0.5 text-[13px] text-muted">
                          {appearance.part}
                          {appearance.pages && (
                            <>
                              {appearance.part ? ' · ' : ''}
                              {firstPage(appearance.pages) ? <Link to={`/archives/${exam.id}?page=${firstPage(appearance.pages)}`} className="text-accent hover:underline">p. {appearance.pages}</Link> : <span>p. {appearance.pages}</span>}
                            </>
                          )}
                        </p>
                      )}
                      <div className="mt-2.5"><ExamActions exam={exam} /></div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
