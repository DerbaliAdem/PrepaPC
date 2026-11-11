import type { Chapter, Exam, Subject } from '../types';
import { getExams } from '../services/examService';
import { appearancesForChapter, getChapters } from '../services/chapterService';

export interface ChapterRow {
  chapter: Chapter;
  /** year -> exams of that year in which the chapter was verified */
  byYear: Map<number, Exam[]>;
  count: number;
}

/** Years for which at least one exam of this subject exists. */
export function yearsForSubject(subject: Subject): number[] {
  return [...new Set(getExams().filter((e) => e.subject === subject).map((e) => e.year))].sort((a, b) => a - b);
}

export function buildAppearanceMatrix(subject: Subject, years: number[]): ChapterRow[] {
  const exams = getExams();
  return getChapters(subject).map((chapter) => {
    const byYear = new Map<number, Exam[]>();
    for (const a of appearancesForChapter(chapter.id)) {
      const exam = exams.find((e) => e.id === a.examId);
      if (!exam || !years.includes(exam.year)) continue;
      byYear.set(exam.year, [...(byYear.get(exam.year) ?? []), exam]);
    }
    return { chapter, byYear, count: byYear.size };
  });
}

export function chapterHistory(chapterId: string) {
  const exams = getExams();
  return appearancesForChapter(chapterId)
    .map((a) => ({ appearance: a, exam: exams.find((e) => e.id === a.examId)! }))
    .filter((x) => x.exam)
    .sort((a, b) => a.exam.year - b.exam.year);
}
