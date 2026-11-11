import examsData from '../data/exams.json';
import { SUBJECTS, type Exam, type Subject } from '../types';

// pdfUrl is stored from the site root ("/exams/..."); serve it under the deploy base path.
const withBase = (u: string | null) => (u && u.startsWith('/') ? import.meta.env.BASE_URL + u.slice(1) : u);

const exams = (examsData as Exam[]).map((e) => ({ ...e, pdfUrl: withBase(e.pdfUrl), correctionUrl: withBase(e.correctionUrl ?? null) })).slice().sort((a, b) => b.year - a.year || SUBJECTS.indexOf(a.subject) - SUBJECTS.indexOf(b.subject) || a.id.localeCompare(b.id));

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
