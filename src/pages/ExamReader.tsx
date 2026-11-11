import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, ListTree, NotebookPen } from 'lucide-react';
import { downloadName, getExam } from '../services/examService';
import PDFViewer from '../components/exams/PDFViewer';
import ExamChapters from '../components/exams/ExamChapters';
import ExamNotes from '../components/exams/ExamNotes';
import ExamTimer from '../components/exams/ExamTimer';
import { readNotes } from '../hooks/useNotes';
import { appearancesForExam } from '../services/chapterService';
import { ButtonAnchor, ButtonLink, SubjectTag } from '../components/ui/primitives';
import { SUBJECT_LABEL } from '../types';

export default function ExamReader() {
  const { examId = '' } = useParams();
  const exam = getExam(examId);
  const [showChapters, setShowChapters] = useState(false);
  const [showNotes, setShowNotes] = useState(() => Boolean(readNotes()[examId]));

  useEffect(() => {
    document.title = exam ? `${SUBJECT_LABEL[exam.subject]} ${exam.year} — Prépa PC` : 'Prépa PC';
    return () => {
      document.title = 'Prépa PC — Annales';
    };
  }, [exam]);

  if (!exam || !exam.pdfUrl) {
    return (
      <div className="grid min-h-dvh place-items-center px-6">
        <div className="max-w-sm text-center">
          <p className="font-serif text-2xl text-ink">Document indisponible</p>
          <p className="mt-2 text-sm text-muted">
            {exam ? "Le PDF de cette épreuve n'est pas encore dans l'archive." : "Cette épreuve n'existe pas dans l'archive."}
          </p>
          <ButtonLink to="/archives" className="mt-6"><ArrowLeft size={15} /> Retour aux archives</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line bg-surface px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/archives" className="grid size-9 shrink-0 place-items-center rounded-md text-muted hover:bg-sunken hover:text-ink" aria-label="Retour aux archives" title="Retour aux archives">
            <ArrowLeft size={18} />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-serif text-lg leading-tight font-medium text-ink">
              {exam.title} <span className="tabular">{exam.year}</span>
            </h1>
            <p className="flex items-center gap-2 text-[13px] text-muted">
              <SubjectTag subject={exam.subject} />
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExamTimer subject={exam.subject} />
          {appearancesForExam(exam.id).length > 0 && <button
            type="button"
            onClick={() => setShowChapters((s) => !s)}
            aria-pressed={showChapters}
            className={`inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-sm ${showChapters ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink hover:bg-sunken'}`}
          >
            <ListTree size={14} /> Chapitres
          </button>}
          <button
            type="button"
            onClick={() => setShowNotes((s) => !s)}
            aria-pressed={showNotes}
            className={`inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-sm ${showNotes ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink hover:bg-sunken'}`}
          >
            <NotebookPen size={14} /> Notes
          </button>
          <ButtonAnchor href={exam.pdfUrl} download={downloadName(exam)} variant="primary" size="sm">
            <Download size={14} /> Télécharger
          </ButtonAnchor>
        </div>
      </header>
      {showChapters && (
        <div className="max-h-[40vh] overflow-auto border-b border-line bg-surface px-4 py-4 sm:px-6">
          <ExamChapters exam={exam} />
        </div>
      )}
      {showNotes && (
        <div className="border-b border-line bg-surface px-4 py-4 sm:px-6">
          <ExamNotes examId={exam.id} />
        </div>
      )}
      <PDFViewer url={exam.pdfUrl} />
    </div>
  );
}
