import type { Exam, Subject } from '../../types';
import { SUBJECT_LABEL } from '../../types';

// Tile colours from the design mockups (light), with dark-mode equivalents.
const TILE: Record<Subject, { abbr: string; cls: string }> = {
  mathematiques: { abbr: 'Ma', cls: 'bg-[#E6ECFB] text-[#23306B] dark:bg-[#232a44] dark:text-[#b7c3f0]' },
  physique: { abbr: 'Ph', cls: 'bg-[#EDE7FB] text-[#4B2C8F] dark:bg-[#2d2544] dark:text-[#c9b8f2]' },
  'chimie-inorganique': { abbr: 'Ci', cls: 'bg-[#E2F3EA] text-[#1C5E3B] dark:bg-[#1c3029] dark:text-[#8fd3ae]' },
  'chimie-organique': { abbr: 'Co', cls: 'bg-[#E4EEF7] text-[#1F4A6E] dark:bg-[#1c2a36] dark:text-[#9cc4e4]' },
  informatique: { abbr: 'In', cls: 'bg-[#FCEBDD] text-[#8A4512] dark:bg-[#3a2a1c] dark:text-[#eab68a]' },
  sta: { abbr: 'SA', cls: 'bg-[#DDF1F1] text-[#17615F] dark:bg-[#183434] dark:text-[#86d0cd]' },
  francais: { abbr: 'Fr', cls: 'bg-[#FBE6EE] text-[#8E2650] dark:bg-[#3a1f2b] dark:text-[#eba3c0]' },
  anglais: { abbr: 'An', cls: 'bg-[#F1EEE4] text-[#6B5A22] dark:bg-[#332e1f] dark:text-[#d8c78c]' },
};

export function SubjectTile({ subject, size = 44 }: { subject: Subject; size?: 32 | 44 | 52 }) {
  const t = TILE[subject];
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center font-semibold ${t.cls} ${size === 52 ? 'size-[52px] rounded-[14px] text-base' : size === 32 ? 'size-8 rounded-lg text-xs' : 'size-11 rounded-xl text-sm'}`}
    >
      {t.abbr}
    </span>
  );
}

/** Display name: "Chimie inorganique" for chemistry papers, the subject otherwise. */
export function examName(exam: Exam): string {
  const part = exam.title.split(' — ')[1];
  return part ?? SUBJECT_LABEL[exam.subject];
}

export function examSubtitle(exam: Exam): string {
  if (exam.title.includes(' — ')) return SUBJECT_LABEL[exam.subject];
  if (exam.subject === 'sta') return 'Systèmes techniques automatisés';
  return 'Épreuve écrite';
}

export function CorrectionPill({ exam, large = false }: { exam: Exam; large?: boolean }) {
  const h = large ? 'h-[30px] px-3' : 'h-7 px-2.5';
  if (exam.correctionIncluded)
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-ok-soft text-[13px] font-medium text-ok ${h}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m5 12 5 5 9-10" /></svg>
        {large ? 'Corrigé inclus dans le PDF' : 'Corrigé inclus'}
      </span>
    );
  return <span className={`inline-flex items-center rounded-full bg-sunken text-[13px] font-medium text-muted ${h}`}>Corrigé non vérifié</span>;
}
