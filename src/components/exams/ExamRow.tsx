import { Link } from 'react-router-dom';
import { BookOpen, ChevronDown, ChevronUp, Download } from 'lucide-react';
import type { Exam } from '../../types';
import { downloadName } from '../../services/examService';
import { appearancesForExam, getChapter } from '../../services/chapterService';
import { ExamStatusBadge, ExamStatusControl } from '../../hooks/useExamStatus';
import { CorrectionPill, SubjectTile, examName, examSubtitle } from './subjectStyle';

const chapterLabel = (n: number) => (n === 0 ? 'Pas de chapitre' : `${n} chapitre${n > 1 ? 's' : ''}`);

/** Desktop row: tile, name, correction pill, chapter toggle, Ouvrir + download. */
export function ExamRow({ exam, open, onToggle }: { exam: Exam; open: boolean; onToggle: () => void }) {
  const chapters = appearancesForExam(exam.id);
  const n = chapters.length;
  return (
    <div className={`flex flex-col gap-3.5 border-b border-[#EEEDE8] px-5 py-4 last:border-0 dark:border-line ${open ? 'bg-[#FAFAF8] dark:bg-sunken' : ''}`}>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
        <SubjectTile subject={exam.subject} />
        <div className="min-w-0 flex-[1_1_220px]">
          <div className="text-base font-semibold">{examName(exam)}<ExamStatusBadge examId={exam.id} /></div>
          <div className="text-sm text-muted">{examSubtitle(exam)}</div>
        </div>
        <CorrectionPill exam={exam} />
        {(
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="inline-flex h-10 min-w-[120px] items-center gap-1.5 rounded-lg px-2.5 text-sm text-accent hover:bg-accent-soft"
          >
            {n ? chapterLabel(n) : 'Statut'}
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
        <ExamButtons exam={exam} />
      </div>
      {open && (
        <div className="flex flex-wrap items-center gap-2 pl-16">
          <ExamStatusControl examId={exam.id} />
          {chapters.map((a) => {
            const ch = getChapter(a.chapterId);
            return ch ? (
              <Link
                key={a.chapterId}
                to={`/chapitres?matiere=${ch.subject}&chapitre=${ch.id}`}
                title={a.questionReferences}
                className="inline-flex h-8 items-center rounded-lg border border-line bg-surface px-3 text-[13px] text-[#3D4150] no-underline hover:border-line-strong hover:text-ink dark:text-muted"
              >
                {ch.name}
              </Link>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}

export function ExamButtons({ exam }: { exam: Exam }) {
  if (!exam.pdfUrl) return <span className="ml-auto text-sm italic text-faint">Document indisponible</span>;
  return (
    <div className="ml-auto flex gap-2">
      <Link
        to={`/archives/${exam.id}`}
        className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-accent px-4 text-sm font-semibold text-accent-ink no-underline transition-[transform,opacity] hover:opacity-90 active:scale-[0.97]"
      >
        <BookOpen size={16} aria-hidden /> Ouvrir
      </Link>
      <a
        href={exam.pdfUrl}
        download={downloadName(exam)}
        aria-label={`Télécharger le sujet de ${examName(exam)} ${exam.year}`}
        title="Télécharger"
        className="inline-flex size-10 items-center justify-center rounded-[10px] border border-line-strong bg-surface text-ink transition-transform hover:bg-sunken active:scale-[0.95]"
      >
        <Download size={18} aria-hidden />
      </a>
    </div>
  );
}

/** Phone card: the whole card opens the exam's detail page; download on the side. */
export function ExamMobileCard({ exam }: { exam: Exam }) {
  const n = appearancesForExam(exam.id).length;
  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-line bg-surface p-3.5">
      <Link to={`/epreuve/${exam.id}`} className="flex min-w-0 flex-auto items-center gap-3 text-ink no-underline">
        <SubjectTile subject={exam.subject} />
        <span className="flex min-w-0 flex-col gap-1">
          <span className="text-base font-semibold">{examName(exam)}<ExamStatusBadge examId={exam.id} /></span>
          <span className="text-[13px] text-muted">
            {chapterLabel(n)} ·{' '}
            {exam.correctionIncluded ? <span className="font-medium text-ok">Corrigé inclus</span> : 'Corrigé non vérifié'}
          </span>
        </span>
      </Link>
      {exam.pdfUrl && (
        <a
          href={exam.pdfUrl}
          download={downloadName(exam)}
          aria-label={`Télécharger ${examName(exam)} ${exam.year}`}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-sunken text-ink"
        >
          <Download size={18} aria-hidden />
        </a>
      )}
    </div>
  );
}
