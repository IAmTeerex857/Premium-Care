import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { Mail, Menu, Phone, X } from 'lucide-react'
import { navLinks, site } from '@/data/site'
import { cn } from '@/lib/utils'
import { Button, ArrowIcon } from '@/components/ui/Button'
import { Logo } from './Logo'
import { useModalDialog } from '@/hooks/useModalDialog'

/** Thin accent progress bar at the very top, spec §11.3. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 34, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-[linear-gradient(90deg,var(--color-accent),var(--color-primary-light))]"
    />
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the drawer on navigation.
  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <ScrollProgress />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-[color:var(--color-primary)] focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <header
        data-modal-background
        className={cn(
          'fixed inset-x-0 top-0 z-[60] glass transition-all duration-300 [transition-timing-function:var(--ease-premium)]',
          scrolled
            ? 'h-16 border-b border-[color:var(--color-line)]/70 shadow-[0_4px_24px_-12px_rgba(15,42,61,0.18)]'
            : 'h-[4.5rem] border-b border-transparent',
        )}
      >
        <div className="shell flex h-full items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'group/nav relative font-[var(--font-display)] text-[0.9375rem] font-medium transition-colors duration-200',
                    isActive
                      ? 'text-[color:var(--color-primary)]'
                      : 'text-[color:var(--color-ink-secondary)] hover:text-[color:var(--color-primary-light)]',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {/* active underline; also grows in on hover */}
                    <span
                      className={cn(
                        'absolute -bottom-1.5 left-0 h-[2px] w-full origin-left rounded-full bg-[color:var(--color-primary)]',
                        'transition-transform duration-300 [transition-timing-function:var(--ease-premium)]',
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100',
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/portal/login"
              className="link-underline font-[var(--font-display)] text-[0.9375rem] font-medium text-[color:var(--color-ink-secondary)] transition-colors hover:text-[color:var(--color-primary)]"
            >
              Staff Portal
            </Link>
            <Button to="/contact" size="sm">
              Book a Call <ArrowIcon />
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="public-mobile-menu"
            className="lg:hidden grid place-items-center size-11 -mr-2 rounded-full text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-bg-soft)]"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useModalDialog(open, onClose, dialogRef, closeRef)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-[color:var(--color-primary-dark)]/45 backdrop-blur-[2px] lg:hidden"
          />
          <motion.aside
            ref={dialogRef}
            id="public-mobile-menu"
            role="dialog" aria-modal="true" aria-label="Navigation menu"
            tabIndex={-1}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
            className="fixed right-0 top-0 z-[85] flex h-dvh w-[min(21rem,88vw)] flex-col bg-white shadow-[-16px_0_48px_-20px_rgba(15,42,61,0.45)] lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--color-line)]">
              <Logo />
              <button
                ref={closeRef}
                onClick={onClose} aria-label="Close menu"
                className="grid place-items-center size-10 rounded-full text-[color:var(--color-ink-secondary)] transition-colors hover:bg-[color:var(--color-bg-soft)]"
              >
                <X size={20} />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-6">
              <ul className="flex flex-col">
                {navLinks.map((l, i) => (
                  <motion.li
                    key={l.to}
                    initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <NavLink
                      to={l.to}
                      end={l.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between border-b border-[color:var(--color-line)]/70 py-4 font-[var(--font-display)] text-[1.0625rem] font-medium transition-colors',
                          isActive ? 'text-[color:var(--color-accent)]' : 'text-[color:var(--color-primary)]',
                        )
                      }
                    >
                      {l.label}
                      <ArrowIcon className="opacity-40" />
                    </NavLink>
                  </motion.li>
                ))}
                <li>
                  <NavLink to="/portal/login" className="flex items-center justify-between border-b border-[color:var(--color-line)]/70 py-4 font-[var(--font-display)] text-[1.0625rem] font-medium text-[color:var(--color-ink-secondary)]">
                    Staff Portal <ArrowIcon className="opacity-40" />
                  </NavLink>
                </li>
              </ul>

              <div className="mt-7 flex flex-col gap-3 text-[0.9375rem]">
                <a href={site.phoneHref} className="flex items-center gap-3 text-[color:var(--color-ink-secondary)]">
                  <Phone size={16} className="text-[color:var(--color-accent)]" /> {site.phoneDisplay}
                </a>
                <a href={site.emailHref} className="flex items-center gap-3 text-[color:var(--color-ink-secondary)] break-all">
                  <Mail size={16} className="text-[color:var(--color-accent)]" /> {site.email}
                </a>
              </div>
            </nav>

            <div className="px-6 pb-8 pt-2">
              <Button to="/contact" full size="lg">
                Book a Consultation <ArrowIcon />
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
