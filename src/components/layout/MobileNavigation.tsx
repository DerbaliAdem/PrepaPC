import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './navItems';

/** Bottom tab bar on phones (the design has no top bar; pages carry their own header). */
export default function MobileNavigation() {
  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-20 grid h-[72px] grid-cols-3 border-t border-line bg-surface pb-2 lg:hidden"
    >
      {NAV_ITEMS.map(({ to, mobile, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `flex flex-col items-center justify-center gap-1 text-xs no-underline ${isActive ? 'font-semibold text-accent' : 'text-muted'}`}
        >
          <Icon size={22} strokeWidth={2} aria-hidden />
          {mobile}
        </NavLink>
      ))}
    </nav>
  );
}
