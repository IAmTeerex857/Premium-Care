import { Button, ArrowIcon } from '@/components/ui/Button'
import { OrbField } from '@/components/ui/Orb'
import { useSeo } from '@/hooks/useSeo'

export default function NotFound() {
  useSeo({ title: 'Page not found, Premium Care', noindex: true })

  return (
    <section className="relative grid min-h-[70vh] place-items-center overflow-hidden bg-[color:var(--color-bg-soft)]">
      <OrbField />
      <div className="shell relative flex flex-col items-center gap-6 py-20 text-center">
        <span className="font-[var(--font-mono)] text-[clamp(4rem,3rem+6vw,7rem)] font-bold leading-none text-[color:var(--color-accent)]/30">
          404
        </span>
        <h1 className="t-h2">We could not find that page</h1>
        <p className="t-lead max-w-[30rem]">
          The link may be outdated. Try our services, or get in touch and we will point you to what you need.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <Button to="/" size="lg">Back to home <ArrowIcon /></Button>
          <Button to="/contact" variant="secondary" size="lg">Contact us</Button>
        </div>
      </div>
    </section>
  )
}
