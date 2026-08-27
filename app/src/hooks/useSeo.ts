import { useEffect } from 'react'

/**
 * Minimal document-head management for an SPA.
 * Sets title, meta description, and canonical URL per route.
 */
export function useSeo({ title, description, noindex = false }: {
  title: string
  description?: string
  noindex?: boolean
}) {
  useEffect(() => {
    document.title = title

    function setMeta(selector: string, attribute: 'name' | 'property', key: string, content?: string) {
      let meta = document.querySelector<HTMLMetaElement>(selector)
      if (!content) {
        meta?.remove()
        return
      }
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, key)
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    const existingDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (description) {
      const descriptionMeta = existingDescription ?? document.createElement('meta')
      if (!existingDescription) {
        descriptionMeta.name = 'description'
        document.head.appendChild(descriptionMeta)
      }
      descriptionMeta.content = description
    } else {
      existingDescription?.remove()
    }

    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = noindex ? 'noindex, nofollow' : 'index, follow'

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    const origin = import.meta.env.PROD ? 'https://premiumcareinc.com' : window.location.origin
    const canonical = origin + window.location.pathname
    link.href = canonical

    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical)
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website')
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
  }, [title, description, noindex])
}
