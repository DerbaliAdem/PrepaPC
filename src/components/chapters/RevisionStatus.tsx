import { STATUS_LABEL, type RevisionStatus as Status } from '../../types';
import { useRevisionProgress } from '../../hooks/useRevisionProgress';

const ORDER: Status[] = ['non-commence', 'en-cours', 'maitrise'];
const ACTIVE: Record<Status, string> = {
  'non-commence': 'bg-surface text-ink shadow-sm',
  'en-cours': 'bg-warn-soft text-warn shadow-sm',
  maitrise: 'bg-ok-soft text-ok shadow-sm',
};

/** Segmented control to set a chapter's revision status. */
export default function RevisionStatus({ chapterId, chapterName, compact = false }: { chapterId: string; chapterName: string; compact?: boolean }) {
  const { statusOf, setStatus } = useRevisionProgress();
  const current = statusOf(chapterId);
  return (
    <div role="radiogroup" aria-label={`Statut de révision — ${chapterName}`} className="inline-flex rounded-md bg-sunken p-0.5">
      {ORDER.map((s) => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={current === s}
          onClick={() => setStatus(chapterId, s)}
          className={`rounded px-2 ${compact ? 'py-0.5 text-xs' : 'py-1 text-[13px]'} whitespace-nowrap transition-colors ${
            current === s ? `${ACTIVE[s]} font-medium` : 'text-muted hover:text-ink'
          }`}
        >
          {STATUS_LABEL[s]}
        </button>
      ))}
    </div>
  );
}

export function StatusDot({ status }: { status: Status }) {
  const c = status === 'maitrise' ? 'bg-ok' : status === 'en-cours' ? 'bg-warn' : 'bg-line';
  return <span aria-label={STATUS_LABEL[status]} title={STATUS_LABEL[status]} className={`inline-block size-2 shrink-0 rounded-full ${c}`} />;
}
