import { useEffect } from 'react'

/**
 * Minimal document-head management for an SPA.
 * Sets title, meta description, and canonical URL per route.
 */
export function useSeo({ title, description }: { title: string; description?: string }) {
  useEffect(() => {
    document.title = title

    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = description
    }

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = window.location.origin + window.location.pathname
  }, [title, description])
}
