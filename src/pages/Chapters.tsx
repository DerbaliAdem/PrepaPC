import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SubjectTile } from '../components/exams/subjectStyle';
import ChapterTable from '../components/chapters/ChapterTable';
import ChapterDetails from '../components/chapters/ChapterDetails';
import { Panel } from '../components/ui/primitives';
import ProgressSummary from '../components/chapters/ProgressSummary';
import { analysedSubjects, getChapter } from '../services/chapterService';
import { yearsForSubject } from '../utils/chapterAnalysis';
import { SUBJECT_LABEL, type Subject } from '../types';

export default function Chapters() {
  const [params, setParams] = useSearchParams();
  const subjects = analysedSubjects();
  const subject: Subject = subjects.find((s) => s === params.get('matiere')) ?? 'physique';
  const allYears = yearsForSubject(subject);
  const selected = getChapter(params.get('chapitre') ?? '');
  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params);
      for (const [k, v] of Object.entries(patch)) (v === null ? next.delete(k) : next.set(k, v));
      setParams(next, { replace: true });
    },
    [params, setParams],
  );
  const close = useCallback(() => update({ chapitre: null }), [update]);

  return (
    <div className="mx-auto flex max-w-[1040px] flex-col gap-6">
      <h1 className="font-serif text-[40px] leading-[1.1] font-semibold tracking-[-0.01em] max-sm:text-[30px]">
        <span className="max-sm:hidden">Analyse des chapitres</span>
        <span className="sm:hidden">Chapitres</span>
      </h1>

      <div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Matière">
          {subjects.map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={subject === s}
              onClick={() => update({ matiere: s, chapitre: null })}
              className={`flex h-11 shrink-0 items-center gap-2.5 rounded-xl border pr-4 pl-1.5 text-[15px] ${subject === s ? 'border-accent bg-accent-soft font-semibold text-accent' : 'border-line-strong bg-surface text-ink hover:bg-sunken'}`}
            >
              <SubjectTile subject={s} size={32} />
              {SUBJECT_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <Panel className="p-5">
        <ProgressSummary subject={subject} />
      </Panel>

      <Panel className="overflow-hidden">
        <ChapterTable subject={subject} years={allYears} onSelect={(id) => update({ chapitre: id })} />
      </Panel>

      {selected && <ChapterDetails chapter={selected} onClose={close} />}
    </div>
  );
}
