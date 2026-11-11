import { LoaderCircle } from 'lucide-react';

export function Spinner({ label }: { label: string }) {
  return (
    <div role="status" className="flex items-center gap-2 text-sm text-muted">
      <LoaderCircle size={16} className="animate-spin" aria-hidden />
      {label}
    </div>
  );
}
