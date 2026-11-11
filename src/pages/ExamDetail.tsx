import { Link, useParams } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { downloadName, getExam, getExams } from '../services/examService';
import { appearancesForExam, getChapter } from '../services/chapterService';
import { CorrectionPill, SubjectTile, examName, examSubtitle } from '../components/exams/subjectStyle';
import NotFound from './NotFound';
import { ExamStatusControl } from '../hooks/useExamStatus';

/** One exam: its chapters, the same paper in other years, and the open / download actions. */
export default function ExamDetail() {
  const { examId = '' } = useParams();
  const exam = getExam(examId);
  if (!exam) return <NotFound />;

  const chapters = appearancesForExam(exam.id);
  const others = getExams().filter((e) => e.id !== exam.id && e.subject === exam.subject && examName(e) === examName(exam));

  return (
    <div className="mx-auto flex max-w-[640px] flex-col gap-6 pb-28">
      <Link to="/archives" className="-ml-2 inline-flex h-11 items-center gap-1 self-start rounded-xl pr-3 pl-2 text-[15px] font-medium text-accent no-underline hover:bg-accent-soft">
        <ChevronLeft size={20} /> Archives
      </Link>

      <div className="flex flex-col gap-3">
        <SubjectTile subject={exam.subject} size={52} />
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-[30px] leading-[1.15] font-semibold">{examName(exam)}</h1>
          <p className="text-[15px] text-muted">Concours {exam.year} · {examSubtitle(exam)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CorrectionPill exam={exam} large />
          <ExamStatusControl examId={exam.id} />
        </div>
      </div>

      {chapters.length > 0 && (
        <section aria-labelledby="chap" className="flex flex-col gap-2.5">
          <h2 id="chap" className="text-[13px] font-semibold tracking-[0.08em] text-muted">CHAPITRES ABORDÉS · {chapters.length}</h2>
          <div className="overflow-hidden rounded-[14px] border border-line bg-surface">
            {chapters.map((a) => {
              const ch = getChapter(a.chapterId);
              return ch ? (
                <Link
                  key={a.chapterId}
                  to={`/chapitres?matiere=${ch.subject}&chapitre=${ch.id}`}
                  className="flex min-h-14 items-center justify-between gap-3 border-b border-[#EEEDE8] px-4 py-2 text-ink no-underline last:border-0 hover:bg-sunken dark:border-line"
                >
                  <span className="flex flex-col">
                    <span className="text-[15px] font-medium">{ch.name}</span>
                    <span className="text-xs text-muted">Voir les autres sujets</span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-muted" />
                </Link>
              ) : null;
            })}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section aria-labelledby="other" className="flex flex-col gap-2.5">
          <h2 id="other" className="text-[13px] font-semibold tracking-[0.08em] text-muted">{examName(exam).toUpperCase()}, AUTRES ANNÉES</h2>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
            {others.map((o) => (
              <Link key={o.id} to={`/epreuve/${o.id}`} className="inline-flex h-11 shrink-0 items-center rounded-xl border border-line-strong bg-surface px-[18px] text-[15px] tabular text-ink no-underline hover:bg-sunken">
                {o.year}
              </Link>
            ))}
          </div>
        </section>
      )}

      {exam.pdfUrl && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface px-4 pt-3 pb-[max(24px,env(safe-area-inset-bottom))] lg:left-[232px]">
          <div className="mx-auto flex max-w-[640px] gap-2.5">
            <Link to={`/archives/${exam.id}`} className="inline-flex h-[52px] flex-auto items-center justify-center gap-2 rounded-[14px] bg-accent text-base font-semibold text-accent-ink no-underline active:scale-[0.98]">
              <BookOpen size={18} /> Consulter le sujet
            </Link>
            <a href={exam.pdfUrl} download={downloadName(exam)} aria-label="Télécharger le PDF" className="inline-flex size-[52px] shrink-0 items-center justify-center rounded-[14px] border border-line-strong bg-surface text-ink">
              <Download size={20} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
