import type { ReactNode } from 'react';

export default function Header({ eyebrow, title, children, actions }: { eyebrow?: string; title: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-accent">
            <span aria-hidden className="h-px w-6 bg-accent" />
            {eyebrow}
          </p>
        )}
        <h1 className="font-serif text-[40px] leading-[1.1] font-semibold tracking-[-0.01em] text-ink max-sm:text-[30px]">{title}</h1>
        {children && <div className="mt-2 text-[15px] leading-relaxed text-muted">{children}</div>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </header>
  );
}
