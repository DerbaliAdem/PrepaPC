import examsData from '../data/exams.json';
import { SUBJECTS, type Exam, type Subject } from '../types';

const exams = (examsData as Exam[]).slice().sort((a, b) => b.year - a.year || SUBJECTS.indexOf(a.subject) - SUBJECTS.indexOf(b.subject) || a.id.localeCompare(b.id));

export function getExams(): Exam[] {
  return exams;
}

export function getExam(id: string): Exam | undefined {
  return exams.find((e) => e.id === id);
}

export function getYears(): number[] {
  return [...new Set(exams.map((e) => e.year))].sort((a, b) => a - b);
}

export function hasPdf(exam: Exam): boolean {
  return Boolean(exam.pdfUrl);
}

export function examsFor(subject: Subject, year: number): Exam[] {
  return exams.filter((e) => e.subject === subject && e.year === year);
}

export function downloadName(exam: Exam): string {
  return `Concours-PC-${exam.id}.pdf`;
}
