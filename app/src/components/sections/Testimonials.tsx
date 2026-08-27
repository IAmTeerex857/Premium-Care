import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { testimonials } from '@/data/content'
import { cn } from '@/lib/utils'
import { SectionHeading, StarRating } from '@/components/ui/Misc'

const EASE = [0.23, 1, 0.32, 1] as const

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)

  const go = useCallback((next: number, direction: number) => {
    setDir(direction)
    setIndex((next + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => go(index + 1, 1), 6000)
    return () => clearInterval(t)
  }, [index, paused, go])

  const t = testimonials[index]!

  return (
    <section
      className="section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="shell">
        <SectionHeading
          tag="Client stories"
          title="What families tell us"
          lead="Unedited feedback from the people we serve, the ones who were hesitant at first included."
        />

        <div className="relative mx-auto mt-14 max-w-[46rem]">
          <Quote
            aria-hidden size={64}
            className="absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-[color:var(--color-accent)]/10 text-transparent"
          />

          <div className="relative min-h-[19rem] sm:min-h-[16rem]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.figure
                key={index}
                custom={dir}
                initial={{ opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="flex flex-col items-center gap-7 text-center"
              >
                <blockquote className="text-[1.0625rem] italic leading-[1.75] text-[color:var(--color-ink)] sm:text-[1.25rem]">
                  “{t.quote}”
                </blockquote>
                <figcaption className="flex flex-col items-center gap-3">
                  <img
                    src={t.avatar} alt=""
                    loading="lazy" width={48} height={48}
                    className="size-12 rounded-full object-cover ring-2 ring-white shadow-[0_4px_12px_rgba(15,42,61,0.14)]"
                  />
                  <div>
                    <p className="font-[var(--font-display)] font-semibold text-[color:var(--color-primary)]">{t.name}</p>
                    <p className="text-[0.875rem] text-[color:var(--color-ink-muted)]">{t.role}</p>
                  </div>
                  <StarRating value={t.rating} />
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-center gap-5">
            <button
              onClick={() => go(index - 1, -1)}
              aria-label="Previous testimonial"
              className="grid size-10 place-items-center rounded-full border border-[color:var(--color-line)] text-[color:var(--color-ink-secondary)] transition-all duration-200 hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)] hover:text-white active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1">
              {testimonials.map((item, i) => (
                <button
                  key={item.name}
                  onClick={() => go(i, i > index ? 1 : -1)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={i === index}
                  className="group/dot grid h-11 place-items-center px-2"
                >
                  {/* The button carries a 44px tap target; the dot is just the visual. */}
                  <span
                    className={cn(
                      'block h-2 rounded-full transition-all duration-300 [transition-timing-function:var(--ease-premium)]',
                      i === index
                        ? 'w-7 bg-[color:var(--color-accent)]'
                        : 'w-2 bg-[color:var(--color-line)] group-hover/dot:bg-[color:var(--color-ink-muted)]',
                    )}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={() => go(index + 1, 1)}
              aria-label="Next testimonial"
              className="grid size-10 place-items-center rounded-full border border-[color:var(--color-line)] text-[color:var(--color-ink-secondary)] transition-all duration-200 hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)] hover:text-white active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
