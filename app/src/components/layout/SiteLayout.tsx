import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Header } from './Header'
import { Footer } from './Footer'

/** Scrolls to top on route change; honours in-page hash links. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
}

export function SiteLayout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />
      <Header />
      <motion.main
        data-modal-background
        id="main"
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="flex-1 pt-[4.5rem]"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  )
}

/** Standard inner-page header band used by every non-home page. */
export function PageHero({
  eyebrow, title, lead, children,
}: { eyebrow: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-soft)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 size-[28rem] rounded-full opacity-25 blur-[90px]"
        style={{ background: 'radial-gradient(circle, #9FD2EC, transparent 68%)' }}
      />
      <div className="shell relative py-14 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
          className="flex max-w-[46rem] flex-col gap-4"
        >
          <span className="t-label text-[color:var(--color-accent)]">{eyebrow}</span>
          <h1 className="t-h1 text-[color:var(--color-primary-dark)]">{title}</h1>
          {lead && <p className="t-lead max-w-[38rem]">{lead}</p>}
          {children}
        </motion.div>
      </div>
    </section>
  )
}
