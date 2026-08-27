import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Briefcase, CalendarCheck, ExternalLink, LayoutDashboard, LogOut, Mail,
  Menu, Users, X, type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { cn, initials } from '@/lib/utils'
import { Logo } from '@/components/layout/Logo'
import { useModalDialog } from '@/hooks/useModalDialog'

type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean; adminOnly?: boolean }

const navItems: NavItem[] = [
  { to: '/portal', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/portal/bookings', label: 'Appointments', icon: CalendarCheck },
  { to: '/portal/contacts', label: 'Messages', icon: Mail },
  { to: '/portal/applications', label: 'Applications', icon: Briefcase, adminOnly: true },
  { to: '/portal/team', label: 'Team', icon: Users, adminOnly: true },
]

export function PortalLayout() {
  const { profile, isAdmin, signOut } = useAuth()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useModalDialog(open, () => setOpen(false), dialogRef, closeRef)

  useEffect(() => setOpen(false), [pathname])

  const visible = navItems.filter((i) => !i.adminOnly || isAdmin)

  return (
    <div className="min-h-dvh bg-[color:var(--color-bg-soft)]">
      {/* Sidebar, desktop */}
      <aside data-modal-background className="fixed inset-y-0 left-0 z-40 hidden w-[16.5rem] flex-col border-r border-[color:var(--color-line)] bg-white lg:flex">
        <div className="px-6 py-6"><Logo /></div>
        <SidebarNav items={visible} />
        <SidebarFooter profile={profile} isAdmin={isAdmin} onSignOut={() => void signOut()} />
      </aside>

      {/* Topbar, mobile */}
      <header data-modal-background className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[color:var(--color-line)] bg-white px-5 lg:hidden">
        <Logo />
        <button
          onClick={() => setOpen(true)} aria-label="Open portal menu" aria-expanded={open} aria-controls="portal-mobile-menu"
          className="grid size-10 place-items-center rounded-full text-[color:var(--color-primary)] hover:bg-[color:var(--color-bg-soft)]"
        >
          <Menu size={21} />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-[color:var(--color-primary-dark)]/45 lg:hidden"
            />
            <motion.aside
              ref={dialogRef}
              id="portal-mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Portal navigation"
              tabIndex={-1}
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-[16.5rem] flex-col bg-white lg:hidden"
            >
              <div className="flex items-center justify-between px-6 py-5">
                <Logo />
                <button ref={closeRef} onClick={() => setOpen(false)} aria-label="Close menu" className="grid size-9 place-items-center rounded-full hover:bg-[color:var(--color-bg-soft)]">
                  <X size={18} />
                </button>
              </div>
              <SidebarNav items={visible} />
              <SidebarFooter profile={profile} isAdmin={isAdmin} onSignOut={() => void signOut()} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main data-modal-background className="lg:pl-[16.5rem]">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="mx-auto max-w-[80rem] px-5 py-7 md:px-8 md:py-10"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}

function SidebarNav({ items }: { items: NavItem[] }) {
  return (
    <nav aria-label="Portal" className="flex-1 overflow-y-auto px-3 py-2">
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 font-[var(--font-display)] text-[0.9375rem] font-medium transition-all duration-200',
                  isActive
                    ? 'bg-[color:var(--color-primary)] text-white shadow-[0_4px_14px_-6px_rgba(15,42,61,0.5)]'
                    : 'text-[color:var(--color-ink-secondary)] hover:bg-[color:var(--color-bg-soft)] hover:text-[color:var(--color-primary)]',
                )
              }
            >
              <item.icon size={18} strokeWidth={1.9} />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-[color:var(--color-line)] pt-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[0.875rem] font-medium text-[color:var(--color-ink-muted)] transition-colors hover:bg-[color:var(--color-bg-soft)] hover:text-[color:var(--color-primary)]"
        >
          <ExternalLink size={16} /> View public site
        </Link>
      </div>
    </nav>
  )
}

function SidebarFooter({ profile, isAdmin, onSignOut }: {
  profile: { full_name: string | null; email: string } | null
  isAdmin: boolean
  onSignOut: () => void
}) {
  return (
    <div className="border-t border-[color:var(--color-line)] p-4">
      <div className="flex items-center gap-3 rounded-xl bg-[color:var(--color-bg-soft)] p-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[color:var(--color-primary)] font-[var(--font-display)] text-[0.75rem] font-bold text-white">
          {initials(profile?.full_name, profile?.email)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-[var(--font-display)] text-[0.875rem] font-semibold text-[color:var(--color-primary)]">
            {profile?.full_name ?? profile?.email}
          </p>
          <p className="text-[0.75rem] font-medium text-[color:var(--color-accent-dark)]">
            {isAdmin ? 'Administrator' : 'Member'}
          </p>
        </div>
        <button
          onClick={onSignOut} aria-label="Sign out" title="Sign out"
          className="grid size-8 shrink-0 place-items-center rounded-lg text-[color:var(--color-ink-muted)] transition-colors hover:bg-white hover:text-[color:var(--color-warm)]"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  )
}
