// Every route the site ships. New pages must be added here so they get smoke + a11y coverage.
export const pages = [
  { path: '/', lang: 'en' },
  { path: '/es/', lang: 'es' },
  { path: '/blog/', lang: 'en' },
  { path: '/es/blog/', lang: 'es' },
  { path: '/design-system/', lang: 'en' },
  { path: '/es/design-system/', lang: 'es' },
  { path: '/blog/why-this-site-tests-itself/', lang: 'en' },
  { path: '/es/blog/por-que-este-sitio-se-prueba-a-si-mismo/', lang: 'es' },
] as const;
