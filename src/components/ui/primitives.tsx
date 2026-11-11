import type { ComponentProps, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { SUBJECT_LABEL, type Subject } from '../../types';

const base =
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-[background-color,box-shadow,transform,opacity] duration-150 hover:-translate-y-px active:translate-y-0 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50';
const variants = {
  primary: 'bg-accent text-accent-ink shadow-[0_1px_0_rgba(0,0,0,0.08)] hover:opacity-90 hover:shadow-[0_3px_10px_-4px_var(--accent)]',
  secondary: 'border border-line bg-surface text-ink hover:border-faint/60 hover:bg-sunken',
  ghost: 'text-muted hover:bg-sunken hover:text-ink',
};
const sizes = { sm: 'h-8 px-2.5', md: 'h-9 px-3.5' };

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

export function Button({ variant = 'secondary', size = 'md', className = '', ...p }: ComponentProps<'button'> & { variant?: Variant; size?: Size }) {
  return <button type="button" className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...p} />;
}

export function ButtonLink({ variant = 'secondary', size = 'md', className = '', ...p }: LinkProps & { variant?: Variant; size?: Size }) {
  return <Link className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...p} />;
}

export function ButtonAnchor({ variant = 'secondary', size = 'md', className = '', ...p }: ComponentProps<'a'> & { variant?: Variant; size?: Size }) {
  return <a className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...p} />;
}

export function SubjectTag({ subject }: { subject: Subject }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-ink">
      <span aria-hidden className={`size-1.5 rounded-full ${subject === 'physique' ? 'bg-accent' : subject === 'chimie' ? 'bg-ok' : 'bg-faint'}`} />
      {SUBJECT_LABEL[subject]}
    </span>
  );
}

export function Section({ title, action, children, className = '' }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={className}>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-surface ${className}`}>{children}</div>;
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="px-6 py-12 text-center">
      <p className="font-medium text-ink">{title}</p>
      {children && <div className="mx-auto mt-1 max-w-sm text-sm text-muted">{children}</div>}
    </div>
  );
}

export function Unavailable({ label = 'Document indisponible' }: { label?: string }) {
  return <span className="text-sm italic text-faint">{label}</span>;
}
