import { useEffect } from 'react'

// Update if you move to a custom domain — see public/CNAME notes.
export const SITE_URL = 'https://erbagnino.github.io/website'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`

interface DocumentMetaConfig {
  title: string
  description: string
  /** Route path starting with "/", e.g. "/tech". Use "/" for the home page. */
  path: string
  image?: string
}

function setMetaByName(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setMetaByProperty(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** Sets document title + description + Open Graph/Twitter tags + canonical link for the current route. */
export function useDocumentMeta({ title, description, path, image = DEFAULT_OG_IMAGE }: DocumentMetaConfig) {
  useEffect(() => {
    const url = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`

    document.title = title
    setMetaByName('description', description)

    setMetaByProperty('og:type', 'website')
    setMetaByProperty('og:title', title)
    setMetaByProperty('og:description', description)
    setMetaByProperty('og:url', url)
    setMetaByProperty('og:image', image)

    setMetaByName('twitter:card', 'summary_large_image')
    setMetaByName('twitter:title', title)
    setMetaByName('twitter:description', description)
    setMetaByName('twitter:image', image)

    setCanonical(url)
  }, [title, description, path, image])
}
