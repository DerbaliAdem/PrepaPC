import { NavLink, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { NAV_ITEMS } from './navItems';
import { useTheme } from '../../hooks/useTheme';

export function Wordmark() {
  return (
    <div className="flex items-baseline gap-2 px-3">
      <span className="font-serif text-[22px] font-semibold text-ink">Prépa PC</span>
      <span className="text-[11px] font-medium tracking-[0.14em] text-muted">ANNALES</span>
    </div>
  );
}

export default function Sidebar() {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  return (
    <aside className="sticky top-0 hidden h-dvh w-[232px] shrink-0 flex-col gap-7 border-r border-line bg-surface px-4 py-7 lg:flex">
      <Wordmark />
      <nav className="flex flex-col gap-1" aria-label="Navigation principale">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          // The exam page belongs to the archive.
          const active = pathname.startsWith(to) || (to === '/archives' && pathname.startsWith('/epreuve/'));
          return (
            <NavLink
              key={to}
              to={to}
              aria-current={active ? 'page' : undefined}
              className={`flex h-11 items-center gap-3 rounded-[10px] px-3 text-[15px] no-underline transition-colors ${
                active ? 'bg-accent-soft font-semibold text-accent' : 'text-[#3D4150] hover:bg-sunken hover:text-ink dark:text-muted'
              }`}
            >
              <Icon size={18} strokeWidth={2} aria-hidden />
              {label}
            </NavLink>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={toggle}
        className="mt-auto flex h-11 items-center gap-3 rounded-[10px] border border-line bg-surface px-3 text-sm text-[#3D4150] hover:bg-sunken dark:text-muted"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
      </button>
    </aside>
  );
}
