export type Subject = 'mathematiques' | 'physique' | 'chimie-inorganique' | 'chimie-organique' | 'informatique' | 'sta' | 'francais' | 'anglais';

/** Display order of subjects. */
export const SUBJECTS: Subject[] = ['mathematiques', 'physique', 'chimie-inorganique', 'chimie-organique', 'informatique', 'sta', 'francais', 'anglais'];

export interface Exam {
  id: string;
  year: number;
  subject: Subject;
  title: string;
  session: string;
  month: string;
  /** Path under /public. null when the document is not available. */
  pdfUrl: string | null;
  /** Separate correction document, if one exists. */
  correctionUrl?: string | null;
  /** true: the PDF also contains the corrigé; null: not verified. */
  correctionIncluded: boolean | null;
  totalPages?: number | null;
  sujetPages?: number | null;
  verified: boolean;
}

export interface Chapter {
  id: string;
  name: string;
  subject: Subject;
  category: string;
  description?: string;
}

export interface ChapterAppearance {
  chapterId: string;
  examId: string;
  questionReferences?: string;
  /** Part of the paper, e.g. "Problème 1, partie I". */
  part?: string | null;
  /** Page range in the PDF, e.g. "29–30" or "37→" (open-ended). */
  pages?: string | null;
  verified: boolean;
}

export type RevisionStatus = 'non-commence' | 'en-cours' | 'maitrise';

export interface RevisionProgress {
  chapterId: string;
  status: RevisionStatus;
  updatedAt: string;
}

export const SUBJECT_LABEL: Record<Subject, string> = {
  mathematiques: 'Mathématiques',
  physique: 'Physique',
  'chimie-inorganique': 'Chimie inorganique',
  'chimie-organique': 'Chimie organique',
  informatique: 'Informatique',
  sta: 'STA',  // Systèmes Techniques Automatisés
  francais: 'Français',
  anglais: 'Anglais',
};

export const STATUS_LABEL: Record<RevisionStatus, string> = {
  'non-commence': 'Non commencé',
  'en-cours': 'En cours',
  maitrise: 'Maîtrisé',
};
