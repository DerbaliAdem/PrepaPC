import { BookOpen, Download } from 'lucide-react';
import type { Exam } from '../../types';
import { downloadName } from '../../services/examService';
import { ButtonAnchor, ButtonLink, Unavailable } from '../ui/primitives';

export default function ExamActions({ exam, size = 'sm' }: { exam: Exam; size?: 'sm' | 'md' }) {
  if (!exam.pdfUrl) return <Unavailable />;
  return (
    <div className="flex flex-wrap gap-1.5">
      <ButtonLink to={`/archives/${exam.id}`} variant="primary" size={size}>
        <BookOpen size={14} aria-hidden /> Consulter le sujet
      </ButtonLink>
      <ButtonAnchor href={exam.pdfUrl} download={downloadName(exam)} size={size} aria-label={`Télécharger ${exam.title} ${exam.year}`}>
        <Download size={14} aria-hidden /> Télécharger
      </ButtonAnchor>
    </div>
  );
}

export function CorrectionInfo({ exam }: { exam: Exam }) {
  if (exam.correctionUrl)
    return (
      <a href={exam.correctionUrl} download className="text-sm text-accent underline-offset-2 hover:underline">
        Télécharger
      </a>
    );
  if (exam.correctionIncluded) return <span className="text-sm text-ink">Inclus dans le PDF</span>;
  return <Unavailable label="Non vérifié" />;
}
