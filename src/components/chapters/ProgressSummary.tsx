import type { Subject } from '../../types';
import { getChapters } from '../../services/chapterService';
import { useRevisionProgress } from '../../hooks/useRevisionProgress';
import { revisionStats } from '../../utils/statistics';

export default function ProgressSummary({ subject }: { subject?: Subject }) {
  const { progress } = useRevisionProgress();
  const s = revisionStats(getChapters(subject), progress);
  const pct = (n: number) => (s.total ? (n / s.total) * 100 : 0);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="font-serif text-3xl font-medium tabular text-ink">{s.percent} %</p>
        <p className="text-sm text-muted">{s.maitrise} / {s.total} chapitres maîtrisés</p>
      </div>
      <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-sunken" role="img" aria-label={`${s.maitrise} maîtrisés, ${s.enCours} en cours, ${s.nonCommence} non commencés`}>
        <div className="bg-ok transition-[width]" style={{ width: `${pct(s.maitrise)}%` }} />
        <div className="bg-warn transition-[width]" style={{ width: `${pct(s.enCours)}%` }} />
      </div>
      <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
        <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-ok" /><dt>Maîtrisé</dt><dd className="tabular font-medium text-ink">{s.maitrise}</dd></div>
        <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-warn" /><dt>En cours</dt><dd className="tabular font-medium text-ink">{s.enCours}</dd></div>
        <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-line" /><dt>Non commencé</dt><dd className="tabular font-medium text-ink">{s.nonCommence}</dd></div>
      </dl>
    </div>
  );
}
