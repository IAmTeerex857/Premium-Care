import { Link } from 'react-router-dom'
import { posts, type Post } from '@/data/blog'
import { formatDate } from '@/lib/utils'
import { SectionHeading } from '@/components/ui/Misc'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { Button, ArrowIcon } from '@/components/ui/Button'

export function BlogCard({ post }: { post: Post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="card-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-white shadow-[0_1px_3px_rgba(15,42,61,0.06)]"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={post.cover} alt="" loading="lazy"
          className="size-full object-cover transition-transform duration-700 [transition-timing-function:var(--ease-premium)] group-hover:scale-[1.04]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[0.75rem] font-semibold text-[color:var(--color-primary)] backdrop-blur-sm">
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-2 text-[0.8125rem] text-[color:var(--color-ink-muted)]">
          <time dateTime={post.date}>{formatDate(post.date, { month: 'short', day: 'numeric', year: 'numeric' })}</time>
          <span aria-hidden>·</span>
          <span>{post.readMinutes} min read</span>
        </div>
        <h3 className="t-h4 text-[1.125rem] leading-snug transition-colors group-hover:text-[color:var(--color-primary-light)]">
          {post.title}
        </h3>
        <p className="flex-1 text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)]">{post.excerpt}</p>
        <span className="mt-1 inline-flex items-center gap-2 font-[var(--font-display)] text-[0.875rem] font-semibold text-[color:var(--color-primary)]">
          Read article <ArrowIcon />
        </span>
      </div>
    </Link>
  )
}

export function BlogPreview() {
  return (
    <section className="section bg-[color:var(--color-bg-soft)]">
      <div className="shell">
        <SectionHeading
          tag="Latest insights"
          title="Guidance for families"
          lead="Practical writing from our nurses and care managers on the decisions families actually face."
        />

        <RevealGroup className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <RevealItem key={p.slug}><BlogCard post={p} /></RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-11 flex justify-center">
          <Button to="/blog" variant="secondary" size="lg">
            View all articles <ArrowIcon />
          </Button>
        </div>
      </div>
    </section>
  )
}
