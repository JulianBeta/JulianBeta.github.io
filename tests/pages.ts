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
  { path: '/blog/a-certification-opens-a-window/', lang: 'en' },
  { path: '/es/blog/una-certificacion-abre-una-ventana/', lang: 'es' },
  { path: '/blog/276-attacks-defended-who-defended-them/', lang: 'en' },
  { path: '/es/blog/276-ataques-defendidos-quien-los-defendio/', lang: 'es' },
] as const;
