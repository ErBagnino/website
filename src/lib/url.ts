// The site is deployed under a GitHub Pages project path (see vite.config.ts's `base`),
// so any root-relative reference to a /public asset built by hand (not through an
// `import`, which Vite already rewrites) needs this prefix or it 404s once deployed.
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${cleanBase}${cleanPath}`
}
