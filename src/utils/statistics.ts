import type { Chapter, RevisionProgress } from '../types';
import { getExams } from '../services/examService';

export function archiveStats() {
  const exams = getExams();
  return {
    total: exams.length,
    physique: exams.filter((e) => e.subject === 'physique').length,
    chimie: exams.filter((e) => e.subject.startsWith('chimie')).length,
    years: new Set(exams.map((e) => e.year)).size,
    withPdf: exams.filter((e) => e.pdfUrl).length,
  };
}

export function revisionStats(chapters: Chapter[], progress: Record<string, RevisionProgress>) {
  let maitrise = 0;
  let enCours = 0;
  for (const c of chapters) {
    const s = progress[c.id]?.status;
    if (s === 'maitrise') maitrise++;
    else if (s === 'en-cours') enCours++;
  }
  const total = chapters.length;
  return {
    total,
    maitrise,
    enCours,
    nonCommence: total - maitrise - enCours,
    percent: total ? Math.round((maitrise / total) * 100) : 0,
  };
}
