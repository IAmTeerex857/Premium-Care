import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Clock } from 'lucide-react'
import { postBySlug, posts } from '@/data/blog'
import { formatDate } from '@/lib/utils'
import { BlogCard } from '@/components/sections/BlogPreview'
import { CtaBand } from '@/components/sections/CtaBand'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { useSeo } from '@/hooks/useSeo'

/** Renders the light **bold** markup used in post bodies. */
function Paragraph({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <p className="text-[1.0625rem] leading-[1.8] text-[color:var(--color-ink-secondary)]">
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-semibold text-[color:var(--color-ink)]">{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </p>
  )
}

export default function BlogPost() {
  const { slug = '' } = useParams()
  const post = postBySlug(slug)

  useSeo({
    title: post ? `${post.title} — Premium Care` : 'Article — Premium Care',
    description: post?.excerpt,
  })

  if (!post) return <Navigate to="/blog" replace />

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <>
      <article>
        <header className="border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-soft)]">
          <div className="shell py-12 md:py-16">
            <Link to="/blog" className="group mb-8 inline-flex items-center gap-2 text-[0.875rem] font-medium text-[color:var(--color-ink-secondary)] transition-colors hover:text-[color:var(--color-primary)]">
              <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
              All articles
            </Link>

            <div className="max-w-[46rem]">
              <span className="t-label text-[color:var(--color-accent)]">{post.category}</span>
              <h1 className="t-h1 mt-3 text-[color:var(--color-primary-dark)]">{post.title}</h1>
              <p className="t-lead mt-5">{post.excerpt}</p>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.875rem] text-[color:var(--color-ink-muted)]">
                <span className="font-medium text-[color:var(--color-primary)]">{post.author}</span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {post.readMinutes} min read</span>
              </div>
            </div>
          </div>
        </header>

        <div className="shell py-12 md:py-16">
          <Reveal className="mx-auto max-w-[52rem]">
            <div className="overflow-hidden rounded-[1.25rem] shadow-[0_20px_60px_-24px_rgba(15,42,61,0.28)]">
              <img src={post.cover} alt="" loading="eager" className="aspect-[3/2] w-full object-cover" />
            </div>
          </Reveal>

          <div className="mx-auto mt-12 flex max-w-[44rem] flex-col gap-6">
            {post.body.map((p, i) => <Paragraph key={i} text={p} />)}
          </div>

          <div className="mx-auto mt-12 max-w-[44rem] rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-soft)] p-7">
            <p className="text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)]">
              <strong className="font-semibold text-[color:var(--color-primary)]">Need to talk this through?</strong>{' '}
              Our care managers answer questions like these every day, whether or not you become a client.{' '}
              <Link to="/contact" className="link-underline font-medium text-[color:var(--color-primary)]">
                Book a free consultation
              </Link>
              .
            </p>
          </div>
        </div>
      </article>

      <section className="section bg-[color:var(--color-bg-soft)]">
        <div className="shell">
          <h2 className="t-h2 text-center">Keep reading</h2>
          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
            {related.map((p) => <RevealItem key={p.slug}><BlogCard post={p} /></RevealItem>)}
          </RevealGroup>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
