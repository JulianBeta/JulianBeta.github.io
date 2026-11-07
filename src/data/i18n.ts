import type { Lang } from './profile';

export const ui = {
  en: {
    'nav.about': 'About',
    'nav.experience': 'Experience',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.collab': 'Collaborations',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'hero.cta.cv': 'Download CV',
    'hero.cta.contact': 'Get in touch',
    'hero.roles': 'Show role',
    'hero.skills': 'Skills',
    'hero.inspect': 'Inspect mode',
    'hero.inspect.on': 'on',
    'hero.inspect.off': 'off',
    'hero.inspect.hintOn': 'Hover or tap any outlined element to get its Playwright locator',
    'hero.inspect.hintOff': 'Turn it on to see how I see a page',
    'hero.inspect.locator': 'Playwright locator',
    'hero.inspect.copy': 'Copy',
    'hero.inspect.copied': 'Locator copied — paste it into your next test',
    'hero.inspect.copyFailed': 'Couldn’t copy — select the locator and copy it by hand',
    'section.about': 'About',
    'section.experience': 'Experience',
    'section.skills': 'Skills & Tools',
    'section.certs': 'Certifications & Training',
    'section.projects': 'Projects',
    'section.collab': 'Development Collaborations',
    'collab.intro': 'Websites I’ve built for independent creatives and small businesses, from development to deployment.',
    'collab.dev': 'Development',
    'collab.testing': 'Testing',
    'collab.site': 'Live site',
    'collab.shot': 'Screenshot of the website for',
    'section.blog': 'Latest writing',
    'section.contact': 'Contact',
    'projects.repo': 'Repository',
    'projects.live': 'Live report',
    'projects.wip': 'In progress',
    'exp.present': 'Present',
    'blog.all': 'All posts',
    'blog.title': 'Blog',
    'blog.intro': 'Notes on test automation, quality strategy and AI in testing.',
    'blog.empty': 'First posts coming soon.',
    'blog.back': '← Back to blog',
    'contact.text': 'Want to talk test automation strategy, Playwright or AI in testing? I’m always happy to connect.',
    'footer.tested': 'This site is tested with Playwright and axe-core on every deploy.',
    'footer.ds': 'Design system',
    'lang.switch': 'Español',
    'skip': 'Skip to content',
  },
  es: {
    'nav.about': 'Sobre mí',
    'nav.experience': 'Experiencia',
    'nav.skills': 'Habilidades',
    'nav.projects': 'Proyectos',
    'nav.collab': 'Colaboraciones',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacto',
    'hero.cta.cv': 'Descargar CV',
    'hero.cta.contact': 'Contáctame',
    'hero.roles': 'Ver rol',
    'hero.skills': 'Habilidades',
    'hero.inspect': 'Modo inspección',
    'hero.inspect.on': 'activo',
    'hero.inspect.off': 'inactivo',
    'hero.inspect.hintOn': 'Pasa el cursor o toca un elemento resaltado para ver su locator de Playwright',
    'hero.inspect.hintOff': 'Actívalo para ver una página como yo la veo',
    'hero.inspect.locator': 'Locator de Playwright',
    'hero.inspect.copy': 'Copiar',
    'hero.inspect.copied': 'Locator copiado: pégalo en tu próxima prueba',
    'hero.inspect.copyFailed': 'No se pudo copiar: selecciona el locator y cópialo a mano',
    'section.about': 'Sobre mí',
    'section.experience': 'Experiencia',
    'section.skills': 'Habilidades y herramientas',
    'section.certs': 'Certificaciones y formación',
    'section.projects': 'Proyectos',
    'section.collab': 'Colaboraciones de desarrollo',
    'collab.intro': 'Sitios web que he desarrollado para creativos independientes y pequeños negocios, del desarrollo al despliegue.',
    'collab.dev': 'Desarrollo',
    'collab.testing': 'Pruebas',
    'collab.site': 'Ver sitio',
    'collab.shot': 'Captura del sitio web de',
    'section.blog': 'Últimos artículos',
    'section.contact': 'Contacto',
    'projects.repo': 'Repositorio',
    'projects.live': 'Reporte en vivo',
    'projects.wip': 'En progreso',
    'exp.present': 'Actual',
    'blog.all': 'Ver todos',
    'blog.title': 'Blog',
    'blog.intro': 'Notas sobre automatización de pruebas, estrategia de calidad e IA en testing.',
    'blog.empty': 'Pronto los primeros artículos.',
    'blog.back': '← Volver al blog',
    'contact.text': '¿Quieres hablar de estrategia de automatización, Playwright o IA en testing? Siempre estoy abierto a conectar.',
    'footer.tested': 'Este sitio se prueba con Playwright y axe-core en cada despliegue.',
    'footer.ds': 'Sistema de diseño',
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
