import { useMemo, useState } from 'react'
import { PageHero } from '@/components/layout/SiteLayout'
import { BlogCard } from '@/components/sections/BlogPreview'
import { CtaBand } from '@/components/sections/CtaBand'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { categories, posts } from '@/data/blog'
import { cn } from '@/lib/utils'
import { useSeo } from '@/hooks/useSeo'

export default function Blog() {
  useSeo({
    title: 'Blog — Premium Care',
    description: 'Practical guidance for families from the nurses and care managers at Premium Care.',
  })

  const [category, setCategory] = useState<string>('All')
  const filtered = useMemo(
    () => (category === 'All' ? posts : posts.filter((p) => p.category === category)),
    [category],
  )

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Guidance for families"
        lead="Written by the people who do this work every day — our nurses, care managers, and coordinators."
      />

      <section className="section">
        <div className="shell">
          <div className="scrollbar-none -mx-1 mb-11 flex gap-2 overflow-x-auto px-1 pb-1">
            {['All', ...categories].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-2 font-[var(--font-display)] text-[0.875rem] font-medium transition-all duration-200 [transition-timing-function:var(--ease-premium)] active:scale-[0.97]',
                  category === c
                    ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white'
                    : 'border-[color:var(--color-line)] bg-white text-[color:var(--color-ink-secondary)] hover:border-[color:var(--color-primary-light)] hover:text-[color:var(--color-primary)]',
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <RevealGroup key={category} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <RevealItem key={p.slug}><BlogCard post={p} /></RevealItem>
            ))}
          </RevealGroup>

          {filtered.length === 0 && (
            <p className="py-20 text-center text-[color:var(--color-ink-muted)]">No articles in this category yet.</p>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  )
}
