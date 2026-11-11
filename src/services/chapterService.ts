import physics from '../data/physics-chapters.json';
import chemistry from '../data/chemistry-chapters.json';
import mathematics from '../data/mathematics-chapters.json';
import informatique from '../data/informatique-chapters.json';
import sta from '../data/sta-chapters.json';
import appearancesData from '../data/chapter-appearances.json';
import { SUBJECTS, type Chapter, type ChapterAppearance, type Subject } from '../types';

const chapters = [...(mathematics as Chapter[]), ...(physics as Chapter[]), ...(chemistry as Chapter[]), ...(informatique as Chapter[]), ...(sta as Chapter[])];
/** Only verified appearances are ever used by the app. */
const appearances = (appearancesData as ChapterAppearance[]).filter((a) => a.verified);

export function getChapters(subject?: Subject): Chapter[] {
  return subject ? chapters.filter((c) => c.subject === subject) : chapters;
}

/** Subjects that have a chapter list, in display order. */
export function analysedSubjects(): Subject[] {
  return SUBJECTS.filter((s) => chapters.some((c) => c.subject === s));
}

export function getChapter(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}

export function getAppearances(): ChapterAppearance[] {
  return appearances;
}

/** First page of a range like "29–30" or "37→", for the reader link. */
export function firstPage(pages?: string | null): number | null {
  const n = parseInt(pages ?? '', 10);
  return Number.isFinite(n) ? n : null;
}

export function appearancesForExam(examId: string): ChapterAppearance[] {
  return appearances.filter((a) => a.examId === examId);
}

export function appearancesForChapter(chapterId: string): ChapterAppearance[] {
  return appearances.filter((a) => a.chapterId === chapterId);
}
