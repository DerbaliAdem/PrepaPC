import { Link } from 'react-router-dom';
import type { Exam } from '../../types';
import { appearancesForExam, firstPage, getChapter } from '../../services/chapterService';
import { StatusDot } from '../chapters/RevisionStatus';
import { useRevisionProgress } from '../../hooks/useRevisionProgress';

/** Verified chapters of one exam, with the part of the paper where each appears. */
export default function ExamChapters({ exam }: { exam: Exam }) {
  const { statusOf } = useRevisionProgress();
  const items = appearancesForExam(exam.id);
  if (!items.length) return <p className="text-sm text-muted">Aucun chapitre vérifié pour cette épreuve.</p>;
  return (
    <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
      {items.map((a) => {
        const ch = getChapter(a.chapterId);
        if (!ch) return null;
        return (
          <li key={a.chapterId} className="flex gap-2.5">
            <span className="mt-[7px]"><StatusDot status={statusOf(ch.id)} /></span>
            <div className="min-w-0">
              <Link to={`/chapitres?matiere=${ch.subject}&chapitre=${ch.id}`} className="text-sm font-medium text-ink hover:text-accent">
                {ch.name}
              </Link>
              {(a.part || a.pages) && (
                <p className="text-[13px] leading-snug text-muted">
                  {a.part}
                  {a.pages && (
                    <>
                      {a.part ? ' · ' : ''}
                      {firstPage(a.pages) ? <Link to={`/archives/${exam.id}?page=${firstPage(a.pages)}`} className="text-accent underline-offset-2 hover:underline">p. {a.pages}</Link> : <span>p. {a.pages}</span>}
                    </>
                  )}
                </p>
              )}
              {a.questionReferences && !a.part && <p className="text-[13px] leading-snug text-muted">{a.questionReferences}</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
