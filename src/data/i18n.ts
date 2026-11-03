import type { Lang } from './profile';

export const ui = {
  en: {
    'nav.about': 'About',
    'nav.experience': 'Experience',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'hero.cta.cv': 'Download CV',
    'hero.cta.contact': 'Get in touch',
    'section.about': 'About',
    'section.experience': 'Experience',
    'section.skills': 'Skills & Tools',
    'section.certs': 'Certifications & Training',
    'section.projects': 'Projects',
    'section.blog': 'Latest writing',
    'section.contact': 'Contact',
    'projects.repo': 'Repository',
    'projects.wip': 'In progress',
    'exp.present': 'Present',
    'blog.all': 'All posts',
    'blog.title': 'Blog',
    'blog.intro': 'Notes on test automation, quality strategy and AI in testing.',
    'blog.empty': 'First posts coming soon.',
    'blog.back': '← Back to blog',
    'contact.text': 'Want to talk test automation strategy, Playwright or AI in testing? I’m always happy to connect.',
    'footer.tested': 'This site is tested with Playwright and axe-core on every deploy.',
    'lang.switch': 'Español',
    'skip': 'Skip to content',
  },
  es: {
    'nav.about': 'Sobre mí',
    'nav.experience': 'Experiencia',
    'nav.skills': 'Habilidades',
    'nav.projects': 'Proyectos',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacto',
    'hero.cta.cv': 'Descargar CV',
    'hero.cta.contact': 'Contáctame',
    'section.about': 'Sobre mí',
    'section.experience': 'Experiencia',
    'section.skills': 'Habilidades y herramientas',
    'section.certs': 'Certificaciones y formación',
    'section.projects': 'Proyectos',
    'section.blog': 'Últimos artículos',
    'section.contact': 'Contacto',
    'projects.repo': 'Repositorio',
    'projects.wip': 'En progreso',
    'exp.present': 'Actual',
    'blog.all': 'Ver todos',
    'blog.title': 'Blog',
    'blog.intro': 'Notas sobre automatización de pruebas, estrategia de calidad e IA en testing.',
    'blog.empty': 'Pronto los primeros artículos.',
    'blog.back': '← Volver al blog',
    'contact.text': '¿Quieres hablar de estrategia de automatización, Playwright o IA en testing? Siempre estoy abierto a conectar.',
    'footer.tested': 'Este sitio se prueba con Playwright y axe-core en cada despliegue.',
    'lang.switch': 'English',
    'skip': 'Saltar al contenido',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];

export function t(lang: Lang, key: UIKey): string {
  return ui[lang][key];
}

/** Prefix a site path with the language segment. */
export function localePath(lang: Lang, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return lang === 'en' ? clean : `/es${clean === '/' ? '/' : clean}`;
}

/** Map the current pathname to its equivalent in the other language. */
export function switchLangPath(pathname: string, to: Lang): string {
  const base = pathname.replace(/^\/es(?=\/|$)/, '') || '/';
  return localePath(to, base);
}

export function formatMonth(ym: string, lang: Lang): string {
  const [y, m] = ym.split('-').map(Number);
  const label = new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-CO', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
  // es-CO gives "sept de 2026"; render "Sept 2026" to match the English style.
  return lang === 'es' ? label.replace(' de ', ' ').replace(/^./, (c) => c.toUpperCase()) : label;
}
