// Content of the /design-system/ page. Colors, type, spacing, radius and shadows live in
// design-system/tokens.json; component markup here is both the code shown and the live example rendered.
import type { Lang } from './profile';
import tokens from './design-system/tokens.json';

type L = Record<Lang, string>;
export { tokens };

export type Theme = 'dark' | 'light';
type ColorToken = (typeof tokens.color.tokens)[number];

const byName = new Map<string, ColorToken>(tokens.color.tokens.map((c) => [c.name, c]));

/** A token's final value in a theme, following `{alias}` references. */
export function resolveColor(name: string, theme: Theme): string {
  const token = byName.get(name);
  if (!token) throw new Error(`Unknown color token "${name}"`);
  const value = typeof token.value === 'string' ? token.value : (token.value as Record<Theme, string>)[theme];
  const alias = value.match(/^\{(.+)\}$/);
  return alias ? resolveColor(alias[1], theme) : value;
}

/** The CSS variable in src/styles/global.css that carries each token on the (dark) site. */
export const siteVars: Record<string, string> = {
  'ink-black': '--ink-black',
  'hot-fuchsia': '--hot-fuchsia',
  'light-sea-green': '--sea-green',
  'bright-snow': '--bright-snow',
  'blue-bell': '--blue-bell',
  surface: '--bg',
  'surface-alt': '--bg-alt',
  'surface-raised': '--surface',
  'surface-sunken': '--sunken',
  'surface-sunken-bar': '--sunken-bar',
  border: '--border',
  text: '--text',
  'text-muted': '--muted',
  primary: '--accent',
  'primary-text': '--accent',
  link: '--accent-2',
  hot: '--hot',
  'on-color': '--accent-ink',
  'chip-bg': '--chip-bg',
  'chip-text': '--chip-text',
  'chip-test-bg': '--chip-test-bg',
  'chip-test-text': '--chip-test-text',
};

function parseColor(value: string): [number, number, number, number] {
  const rgba = value.match(/^rgba?\(([^)]+)\)$/);
  if (rgba) {
    const [r, g, b, a = 1] = rgba[1].split(',').map(Number);
    return [r, g, b, a];
  }
  const hex = value.slice(1);
  return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16), 1];
}

function luminance([r, g, b]: number[]): number {
  const [lr, lg, lb] = [r, g, b].map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

const over = (top: number[], ground: number[]) => [0, 1, 2].map((i) => top[i] * top[3] + ground[i] * (1 - top[3]));

/** WCAG contrast of a text token on a ground token; `base` sits under a translucent ground. */
export function contrast(fg: string, bg: string, theme: Theme, base = 'surface-raised'): number {
  const ground = over(parseColor(resolveColor(bg, theme)), parseColor(resolveColor(base, theme)));
  const a = luminance(over(parseColor(resolveColor(fg, theme)), ground));
  const b = luminance(ground);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** The text-on-ground pairs the system allows. Each must reach 4.5:1 in both themes; a test enforces it. */
export const contrastPairs: [string, string][] = [
  ['text', 'surface'],
  ['text', 'surface-raised'],
  ['text-muted', 'surface'],
  ['text-muted', 'surface-alt'],
  ['text-muted', 'surface-raised'],
  ['primary-text', 'surface'],
  ['link', 'surface'],
  ['on-color', 'primary'],
  ['on-color', 'blue-bell'],
  ['on-color', 'hot'],
  ['chip-text', 'chip-bg'],
  ['chip-test-text', 'chip-test-bg'],
];

export const logos: { file: string; ground: 'dark' | 'light'; use: L }[] = [
  { file: 'jb-mark-snow-fuchsia.svg', ground: 'dark', use: { en: 'Primary on dark grounds (the website)', es: 'Principal sobre fondos oscuros (el sitio)' } },
  { file: 'jb-mark-ink-fuchsia.svg', ground: 'light', use: { en: 'Primary on light grounds (CV, print)', es: 'Principal sobre fondos claros (CV, impresión)' } },
  { file: 'jb-mark-snow-teal.svg', ground: 'dark', use: { en: 'Alternate on dark', es: 'Alternativa sobre oscuro' } },
  { file: 'jb-mark-ink-teal.svg', ground: 'light', use: { en: 'Alternate on light', es: 'Alternativa sobre claro' } },
  { file: 'jb-mark-blue-ink.svg', ground: 'light', use: { en: 'Alternate on light', es: 'Alternativa sobre claro' } },
  { file: 'jb-mark-black.svg', ground: 'light', use: { en: 'One color, black ink', es: 'Una tinta, negro' } },
  { file: 'jb-mark-white.svg', ground: 'dark', use: { en: 'One color, white ink', es: 'Una tinta, blanco' } },
];

export const motion: { name: string; value: string; use: L }[] = [
  { name: 'hover', value: '0.15s ease', use: { en: 'Button lift (1px), border and color changes', es: 'Elevación de botones (1px), cambios de borde y color' } },
  { name: 'tip', value: '0.18s ease-out', use: { en: 'Inspect tooltip entrance', es: 'Entrada del tooltip de inspección' } },
  { name: 'toast', value: '0.3s cubic-bezier(0.3, 1.4, 0.5, 1)', use: { en: 'Toast entrance', es: 'Entrada del toast' } },
  { name: 'switch', value: '0.4s cubic-bezier(0.3, 1.3, 0.5, 1)', use: { en: 'Role switch indicator', es: 'Indicador del selector de rol' } },
  { name: 'underline', value: '0.45s cubic-bezier(0.2, 0.7, 0.2, 1)', use: { en: 'Fuchsia underline on the hero name', es: 'Subrayado fucsia del nombre en el hero' } },
  { name: 'swap', value: '0.5s cubic-bezier(0.2, 0.7, 0.2, 1)', use: { en: 'Role panel content, second item delayed 0.1s', es: 'Contenido del panel de rol, segundo elemento con 0.1s de retraso' } },
  { name: 'rise', value: '0.7s cubic-bezier(0.2, 0.7, 0.2, 1)', use: { en: 'Hero entrance, staggered from 0.05s to 0.5s', es: 'Entrada del hero, escalonada de 0.05s a 0.5s' } },
  { name: 'loop', value: '1.6s, 1.8s', use: { en: 'The Inspect LED pulses while on (turn Inspect off to stop it); the scroll cue bobs twice, then rests', es: 'El LED de inspección pulsa mientras está activo (apágalo para detenerlo); la señal de desplazamiento rebota dos veces y se detiene' } },
];

interface ComponentBase {
  id: string;
  name: string;
  group: 'hero' | 'navigation' | 'content' | 'data' | 'brand';
  summary: L;
  /** What the consumer supplies. */
  provides: L;
  tokens: string[];
  rules: Record<Lang, string[]>;
  source: string;
}

/** `markup` is rendered live and shown as code; an Astro component shows `usage` instead. */
export type ComponentDoc = ComponentBase & ({ markup: (lang: Lang) => string; usage?: undefined } | { usage: string; markup?: undefined });

const pick = (lang: Lang, en: string, es: string) => (lang === 'en' ? en : es);

export const components: ComponentDoc[] = [
  {
    id: 'hero',
    name: 'Hero',
    group: 'hero',
    summary: {
      en: 'The home page opening: centered name, role switch, role panel, calls to action and scroll cue, on a dot grid. Used once, on the home page.',
      es: 'La apertura de la página de inicio: nombre centrado, selector de rol, panel de rol, llamadas a la acción y señal de desplazamiento, sobre una retícula de puntos. Se usa una vez, en el inicio.',
    },
    provides: { en: 'Language. Roles and copy come from `hero` in profile.ts.', es: 'Idioma. Los roles y textos salen de `hero` en profile.ts.' },
    tokens: ['surface', 'border', 'display-hero', 'eyebrow', 'hot', 'dot-pitch'],
    rules: {
      en: [
        'Size it to the viewport minus the header, so the calls to action stay above the fold at 1280×720.',
        'Without JavaScript, show the first role as a `headline` and hide the controls.',
        'One primary button only; give the ghost button a surface ground so the dots don’t show through.',
      ],
      es: [
        'Ajústalo al alto de la ventana menos el encabezado, para que las llamadas a la acción se vean a 1280×720.',
        'Sin JavaScript, muestra el primer rol como `headline` y oculta los controles.',
        'Un solo botón primario; da al botón ghost un fondo `surface` para que no se vean los puntos.',
      ],
    },
    usage: '<Hero lang={lang} />',
    source: 'src/components/Hero.astro',
  },
  {
    id: 'role-switch',
    name: 'Role switch',
    group: 'hero',
    summary: {
      en: 'A two-option pill that swaps the role panel below it, with a sea-green indicator under the selected role.',
      es: 'Una píldora de dos opciones que cambia el panel de rol inferior, con un indicador verde mar bajo el rol seleccionado.',
    },
    provides: { en: 'Two short role labels and the panels they control.', es: 'Dos etiquetas cortas de rol y los paneles que controlan.' },
    tokens: ['surface-alt', 'border', 'primary', 'on-color', 'text-muted', 'role-switch', 'radius-full'],
    rules: {
      en: [
        'Use real buttons in a named group, with `aria-pressed` on each.',
        'Labels wrap on narrow screens rather than overflow.',
        'Move the indicator through `data-active`, so it stays correct with motion off.',
      ],
      es: [
        'Usa botones reales en un grupo con nombre, con `aria-pressed` en cada uno.',
        'Las etiquetas pasan de línea en pantallas estrechas en vez de desbordarse.',
        'Mueve el indicador con `data-active`, para que siga correcto sin movimiento.',
      ],
    },
    markup: (lang) => `<div class="role-switch" role="group" aria-label="${pick(lang, 'Show role', 'Ver rol')}" data-active="engineer">
  <span class="role-switch-indicator" aria-hidden="true"></span>
  <button type="button" aria-pressed="true">Senior QA Automation Engineer</button>
  <button type="button" aria-pressed="false">QA Lead</button>
</div>`,
    source: 'src/components/Hero.astro',
  },
  {
    id: 'inspect-mode',
    name: 'Inspect mode',
    group: 'hero',
    summary: {
      en: 'A toggle that outlines hero elements and reveals a Playwright locator, with a Copy button, on hover, focus or tap.',
      es: 'Un interruptor que resalta elementos del hero y revela un locator de Playwright, con botón de copiar, al pasar el cursor, enfocar o tocar.',
    },
    provides: { en: 'A `data-locator` on each `.inspect-target`. Locators are built from the displayed strings.', es: 'Un `data-locator` en cada `.inspect-target`. Los locators se construyen con los textos visibles.' },
    tokens: ['surface-sunken-bar', 'primary', 'code-locator', 'shadow-float', 'surface-raised', 'radius-full'],
    rules: {
      en: [
        'Every offered locator must find exactly one visible element, in both languages; a test runs each one.',
        'Scope text locators to the hero, because the About summary repeats the same words.',
        'Add the tooltip to the page only while open, so its text can’t match the locators it offers.',
        'Esc closes the tooltip; it stays open while the pointer or focus is on it.',
        'Confirm with the toast only after the clipboard call succeeds; otherwise say it failed.',
      ],
      es: [
        'Cada locator ofrecido debe encontrar exactamente un elemento visible, en ambos idiomas; una prueba ejecuta cada uno.',
        'Limita los locators de texto al hero, porque el resumen de Sobre mí repite las mismas palabras.',
        'Agrega el tooltip a la página solo mientras esté abierto, para que su texto no coincida con los locators que ofrece.',
        'Esc cierra el tooltip; sigue abierto mientras el cursor o el foco estén sobre él.',
        'Confirma con el toast solo si el portapapeles respondió bien; si no, informa del fallo.',
      ],
    },
    markup: (lang) => `<button class="inspect-toggle" type="button" aria-pressed="true">
  <span class="inspect-led" aria-hidden="true"></span>
  ${pick(lang, 'Inspect mode', 'Modo inspección')} <span aria-hidden="true">· ${pick(lang, 'on', 'activo')}</span>
</button>
<div class="inspect-tip-box" style="margin-top: 1rem; width: fit-content">
  <code>page.getByRole('link', { name: '${pick(lang, 'Download CV', 'Descargar CV')}' })</code>
  <button class="inspect-copy" type="button">${pick(lang, 'Copy', 'Copiar')}</button>
</div>`,
    source: 'src/components/Hero.astro',
  },
  {
    id: 'scroll-cue',
    name: 'Scroll cue',
    group: 'hero',
    summary: { en: 'A small labeled link with a bobbing chevron that leads from the hero to About.', es: 'Un pequeño enlace con etiqueta y un chevrón en movimiento que lleva del hero a Sobre mí.' },
    provides: { en: 'The label and the target section.', es: 'La etiqueta y la sección de destino.' },
    tokens: ['text-muted', 'text', 'scroll-cue'],
    rules: { en: ['Use only once, at the end of the hero.'], es: ['Úsalo una sola vez, al final del hero.'] },
    markup: (lang) => `<a class="scroll-cue" href="/#about" style="margin: 0">${pick(lang, 'About', 'Sobre mí')}
  <svg class="icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9l6 6l6-6"/></svg>
</a>`,
    source: 'src/components/Hero.astro',
  },
  {
    id: 'header',
    name: 'Header',
    group: 'navigation',
    summary: { en: 'Sticky bar with the logo and name, the section navigation and the language switch.', es: 'Barra fija con el logo y el nombre, la navegación de secciones y el cambio de idioma.' },
    provides: { en: 'Language and page path; the layout builds the links.', es: 'Idioma y ruta de la página; el layout construye los enlaces.' },
    tokens: ['surface', 'border', 'brand-name', 'nav', 'text-muted'],
    rules: { en: ['The navigation hides under 760px; the language switch stays.', 'Keep the 85% surface ground with a 10px blur.'], es: ['La navegación se oculta bajo 760px; el cambio de idioma se mantiene.', 'Conserva el fondo `surface` al 85% con desenfoque de 10px.'] },
    usage: '<Base lang={lang}>…</Base>',
    source: 'src/layouts/Base.astro',
  },
  {
    id: 'lang-switch',
    name: 'Language switch',
    group: 'navigation',
    summary: { en: 'The pill in the header that links to the same page in the other language.', es: 'La píldora del encabezado que enlaza a la misma página en el otro idioma.' },
    provides: { en: 'The other language’s URL and its name, written in that language.', es: 'La URL del otro idioma y su nombre, escrito en ese idioma.' },
    tokens: ['border', 'text', 'primary', 'radius-full'],
    rules: { en: ['Set `hreflang` and `lang` on the link.'], es: ['Define `hreflang` y `lang` en el enlace.'] },
    markup: (lang) => (lang === 'en' ? '<a class="lang-switch" href="/es/" hreflang="es" lang="es">Español</a>' : '<a class="lang-switch" href="/" hreflang="en" lang="en">English</a>'),
    source: 'src/layouts/Base.astro',
  },
  {
    id: 'skip-link',
    name: 'Skip link',
    group: 'navigation',
    summary: { en: 'The first focusable element on every page; it appears on focus and jumps to the main content.', es: 'El primer elemento enfocable de cada página; aparece al enfocarlo y salta al contenido principal.' },
    provides: { en: 'The translated label.', es: 'La etiqueta traducida.' },
    tokens: ['primary', 'on-color'],
    rules: { en: ['Never remove it; keep it first in the document.'], es: ['Nunca lo elimines; mantenlo primero en el documento.'] },
    usage: '<a class="skip" href="#main">…</a>',
    source: 'src/layouts/Base.astro',
  },
  {
    id: 'footer',
    name: 'Footer',
    group: 'navigation',
    summary: { en: 'Closes every page with the logo, full name and year, the testing note, the design system link and social links.', es: 'Cierra cada página con el logo, el nombre completo y el año, la nota de pruebas, el enlace al sistema de diseño y las redes.' },
    provides: { en: 'Language; content comes from profile.ts and i18n.ts.', es: 'Idioma; el contenido sale de profile.ts e i18n.ts.' },
    tokens: ['border', 'text-muted', 'primary-text', 'meta'],
    rules: { en: ['It carries the full name, including Cuervo.'], es: ['Lleva el nombre completo, con Cuervo.'] },
    usage: '<Base lang={lang}>…</Base>',
    source: 'src/layouts/Base.astro',
  },
  {
    id: 'social-links',
    name: 'Social links',
    group: 'navigation',
    summary: { en: 'The LinkedIn, GitHub and Email links with icons.', es: 'Los enlaces de LinkedIn, GitHub y correo con íconos.' },
    provides: { en: 'Nothing: URLs come from profile.ts. External links get `rel="me noopener"`.', es: 'Nada: las URL salen de profile.ts. Los enlaces externos llevan `rel="me noopener"`.' },
    tokens: ['text-muted', 'primary-text', 'text', 'hot'],
    rules: { en: ['On hover the label turns `text` and the icon turns `hot`.'], es: ['Al pasar el cursor, la etiqueta pasa a `text` y el ícono a `hot`.'] },
    usage: '<SocialLinks />',
    source: 'src/components/SocialLinks.astro',
  },
  {
    id: 'section-title',
    name: 'Section title',
    group: 'content',
    summary: { en: 'The uppercase Oswald `h2` that opens every section, with a short fuchsia rule beneath it.', es: 'El `h2` en Oswald y mayúsculas que abre cada sección, con una regla fucsia corta debajo.' },
    provides: { en: 'The text, in sentence or title case (CSS uppercases it), and an id for `aria-labelledby`.', es: 'El texto, en minúsculas o tipo título (el CSS lo pone en mayúsculas), y un id para `aria-labelledby`.' },
    tokens: ['h2', 'hot', 'text'],
    rules: { en: ['One per section; use `h3` below it.', 'Don’t recolor the rule per section.'], es: ['Uno por sección; usa `h3` debajo.', 'No cambies el color de la regla por sección.'] },
    markup: (lang) => `<h2>${pick(lang, 'Experience', 'Experiencia')}</h2>`,
    source: 'src/styles/global.css',
  },
  {
    id: 'button',
    name: 'Button',
    group: 'content',
    summary: { en: 'Link-styled calls to action: a solid sea-green primary and an outlined ghost.', es: 'Llamadas a la acción con forma de enlace: un primario verde mar sólido y un ghost con contorno.' },
    provides: { en: 'Label, `href`, optional leading Tabler icon, and `download` or `target` as needed.', es: 'Etiqueta, `href`, ícono Tabler inicial opcional, y `download` o `target` según el caso.' },
    tokens: ['primary', 'on-color', 'blue-bell', 'border', 'text', 'link', 'radius-md', 'button'],
    rules: { en: ['One primary per group.', 'Group buttons in `.cta-row`.', 'Never white text on the primary fill.'], es: ['Un primario por grupo.', 'Agrupa los botones en `.cta-row`.', 'Nunca texto blanco sobre el primario.'] },
    markup: (lang) => `<div class="cta-row">
  <a class="btn btn-primary" href="/#contact">${pick(lang, 'Download CV', 'Descargar CV')}</a>
  <a class="btn btn-ghost" href="/#contact">${pick(lang, 'Get in touch', 'Contáctame')}</a>
</div>`,
    source: 'src/styles/global.css',
  },
  {
    id: 'card',
    name: 'Card',
    group: 'content',
    summary: { en: 'The raised panel for skill groups and projects. `project` adds the header and pinned links; `data-status="wip"` dashes the border.', es: 'El panel elevado para grupos de habilidades y proyectos. `project` agrega el encabezado y los enlaces al final; `data-status="wip"` puntea el borde.' },
    provides: { en: 'Title, content, optional chips and links.', es: 'Título, contenido, chips y enlaces opcionales.' },
    tokens: ['surface-raised', 'border', 'radius-lg', 'h3', 'text-muted', 'primary-text', 'space-4'],
    rules: { en: ['No shadow: cards sit flat.', 'Lay out in an auto-fill grid with a 1rem gap.'], es: ['Sin sombra: las tarjetas van planas.', 'Organízalas en una cuadrícula auto-fill con separación de 1rem.'] },
    markup: (lang) => `<article class="card project" data-status="wip">
  <header><h3>Coda · LLM evals</h3><span class="badge">${pick(lang, 'In progress', 'En progreso')}</span></header>
  <p>${pick(lang, 'Evaluating a music composition coach.', 'Evaluación de un asistente de composición musical.')}</p>
  <ul class="chips"><li>Promptfoo</li><li>TypeScript</li></ul>
</article>`,
    source: 'src/styles/global.css',
  },
  {
    id: 'collab-card',
    name: 'Collaboration card',
    group: 'content',
    summary: { en: 'A card with a site screenshot on top, then client, description, stacks and links.', es: 'Una tarjeta con una captura del sitio arriba y luego cliente, descripción, tecnologías y enlaces.' },
    provides: { en: 'A `collaborations` entry in profile.ts and a 16:10 screenshot in public/img/collab/.', es: 'Una entrada en `collaborations` de profile.ts y una captura 16:10 en public/img/collab/.' },
    tokens: ['surface-raised', 'surface-alt', 'border', 'eyebrow', 'meta', 'chip-test-bg'],
    rules: { en: ['Show the testing stack only where real tests exist.', 'Link a repository only if it is public.'], es: ['Muestra las pruebas solo donde existan pruebas reales.', 'Enlaza un repositorio solo si es público.'] },
    usage: 'collaborations.map((c) => <article class="card collab">…</article>)',
    source: 'src/components/Home.astro',
  },
  {
    id: 'chip',
    name: 'Chip',
    group: 'content',
    summary: { en: 'Small monospace tags for stacks, skills and project tags. Plain text, never links or buttons.', es: 'Etiquetas pequeñas monoespaciadas para tecnologías, habilidades y proyectos. Texto simple, nunca enlaces ni botones.' },
    provides: { en: 'List items as plain text; add `chips-test` for the testing stack.', es: 'Elementos de lista como texto simple; agrega `chips-test` para las pruebas.' },
    tokens: ['chip-bg', 'chip-text', 'chip-test-bg', 'chip-test-text', 'code-chip', 'radius-sm', 'space-1'],
    rules: { en: ['With two groups, label each with an `eyebrow`.'], es: ['Con dos grupos, rotula cada uno con un `eyebrow`.'] },
    markup: () => `<ul class="chips"><li>Astro</li><li>TypeScript</li></ul>
<ul class="chips chips-test"><li>Playwright</li><li>axe-core</li></ul>`,
    source: 'src/styles/global.css',
  },
  {
    id: 'badge',
    name: 'Badge',
    group: 'content',
    summary: { en: 'A small fuchsia pill that flags status, used for work-in-progress projects.', es: 'Una pequeña píldora fucsia que marca un estado, usada en proyectos en progreso.' },
    provides: { en: 'A one- or two-word label.', es: 'Una etiqueta de una o dos palabras.' },
    tokens: ['hot', 'on-color', 'badge', 'radius-full'],
    rules: { en: ['Status only; use Chip for tags.'], es: ['Solo para estados; usa Chip para etiquetas.'] },
    markup: (lang) => `<span class="badge">${pick(lang, 'In progress', 'En progreso')}</span>`,
    source: 'src/styles/global.css',
  },
  {
    id: 'stat',
    name: 'Stat',
    group: 'data',
    summary: { en: 'A tile with one large number and a short label, in a row of four at the end of About.', es: 'Un recuadro con un número grande y una etiqueta corta, en una fila de cuatro al final de Sobre mí.' },
    provides: { en: 'A short value and a lower-case label. Values come from `profile.stats`.', es: 'Un valor corto y una etiqueta en minúsculas. Los valores salen de `profile.stats`.' },
    tokens: ['surface-raised', 'border', 'radius-lg', 'stat-number', 'primary-text', 'meta', 'text-muted'],
    rules: { en: ['Four across; two across under 700px.', 'Only real, sourced figures.'], es: ['Cuatro en fila; dos bajo 700px.', 'Solo cifras reales y comprobables.'] },
    markup: (lang) => `<div class="stats" style="margin-top: 0">
  <div class="stat"><span class="stat-value">11+</span><span class="stat-label">${pick(lang, 'years in QA', 'años en QA')}</span></div>
  <div class="stat"><span class="stat-value">30%</span><span class="stat-label">${pick(lang, 'less maintenance with AI', 'menos mantenimiento con IA')}</span></div>
</div>`,
    source: 'src/components/Home.astro',
  },
  {
    id: 'timeline',
    name: 'Timeline',
    group: 'data',
    summary: { en: 'The work history: a vertical rail with a ringed dot per job, newest first.', es: 'La trayectoria: un riel vertical con un punto por trabajo, del más reciente al más antiguo.' },
    provides: { en: '`experience` entries in profile.ts.', es: 'Entradas de `experience` en profile.ts.' },
    tokens: ['border', 'surface-alt', 'primary', 'primary-text', 'meta', 'text-muted'],
    rules: { en: ['Keep highlights to 2–4 short lines per job.', 'Dates use `<time>`.'], es: ['Limita los logros a 2–4 líneas cortas por trabajo.', 'Las fechas usan `<time>`.'] },
    markup: (lang) => `<ol class="timeline">
  <li class="job">
    <h3>Senior QA Automation Engineer <span class="at">· Perficient Latin America</span></h3>
    <p class="job-meta">Sept 2026 – ${pick(lang, 'Present', 'Actual')} · Bogotá</p>
    <ul class="job-highlights"><li>${pick(lang, 'UI test automation with Playwright.', 'Automatización de pruebas de UI con Playwright.')}</li></ul>
  </li>
</ol>`,
    source: 'src/components/Home.astro',
  },
  {
    id: 'cert-list',
    name: 'Certification list',
    group: 'data',
    summary: { en: 'Outlined rows with a certification name on the left and its issuer on the right.', es: 'Filas con contorno con el nombre de la certificación a la izquierda y el emisor a la derecha.' },
    provides: { en: '`certifications` entries in profile.ts.', es: 'Entradas de `certifications` en profile.ts.' },
    tokens: ['border', 'radius-md', 'text-muted'],
    rules: { en: ['Certifications only; no formal education entries.'], es: ['Solo certificaciones; sin educación formal.'] },
    markup: () => `<ul class="certs"><li><strong>ISTQB® Certified Tester – Foundation Level</strong><span>iSQI</span></li></ul>`,
    source: 'src/components/Home.astro',
  },
  {
    id: 'post-list',
    name: 'Post list and cards',
    group: 'data',
    summary: { en: 'Blog entries: hairline rows with title and date on the home page, cards on the blog index.', es: 'Entradas del blog: filas con título y fecha en el inicio, tarjetas en el índice del blog.' },
    provides: { en: 'Posts from the blog content collection.', es: 'Artículos de la colección de contenido del blog.' },
    tokens: ['border', 'link', 'text-muted', 'meta'],
    rules: { en: ['Three latest posts on the home page.', 'Dates use `<time>`.'], es: ['Los tres artículos más recientes en el inicio.', 'Las fechas usan `<time>`.'] },
    markup: (lang) => `<ul class="post-list"><li><a href="/blog/">${pick(lang, 'Why this site tests itself', 'Por qué este sitio se prueba a sí mismo')}</a><time>Nov 2026</time></li></ul>`,
    source: 'src/components/BlogIndex.astro',
  },
  {
    id: 'prose',
    name: 'Prose',
    group: 'data',
    summary: { en: 'Article body styles: headings, inline code, code blocks and quotes.', es: 'Estilos del cuerpo de los artículos: títulos, código en línea, bloques de código y citas.' },
    provides: { en: 'Rendered Markdown inside `.prose`.', es: 'Markdown renderizado dentro de `.prose`.' },
    tokens: ['prose', 'surface-raised', 'surface-sunken', 'border', 'primary', 'text-muted', 'radius-md'],
    rules: { en: ['Keep the reading width at `prose-max`.'], es: ['Mantén el ancho de lectura en `prose-max`.'] },
    markup: (lang) => `<div class="prose">
  <p>${pick(lang, 'Run it with', 'Ejecútalo con')} <code>npx playwright test</code>.</p>
  <blockquote>${pick(lang, 'A test that cannot fail proves nothing.', 'Una prueba que no puede fallar no demuestra nada.')}</blockquote>
</div>`,
    source: 'src/styles/global.css',
  },
  {
    id: 'logo',
    name: 'Logo',
    group: 'brand',
    summary: { en: 'The JB monogram inlined as SVG, so colors follow the theme.', es: 'El monograma JB en SVG en línea, para que los colores sigan el tema.' },
    provides: { en: '`size`, `color`, `dot`, and `label` only when it stands alone without visible text.', es: '`size`, `color`, `dot` y `label` solo cuando aparece sin texto visible.' },
    tokens: ['bright-snow', 'hot-fuchsia'],
    rules: { en: ['Decorative beside text: it hides from assistive technology by default.', 'The dot may hop on hover; the mark never rotates.'], es: ['Decorativo junto a texto: por defecto se oculta a la tecnología de asistencia.', 'El punto puede saltar al pasar el cursor; la marca nunca gira.'] },
    usage: '<Logo size="2.1rem" color="var(--bright-snow)" />',
    source: 'src/components/Logo.astro',
  },
  {
    id: 'icon',
    name: 'Icon',
    group: 'brand',
    summary: { en: 'A Tabler icon rendered to inline SVG at build time, in `currentColor`, with no client JavaScript.', es: 'Un ícono de Tabler renderizado como SVG en línea al compilar, en `currentColor`, sin JavaScript en el cliente.' },
    provides: { en: 'The Tabler icon `name` and an optional `size`.', es: 'El `name` del ícono de Tabler y un `size` opcional.' },
    tokens: ['primary-text'],
    rules: { en: ['Stroke 2 only; no emoji as icons.', 'Always decorative: put the name in visible text.'], es: ['Solo trazo 2; sin emoji como íconos.', 'Siempre decorativo: pon el nombre en texto visible.'] },
    usage: '<Icon name="download" />',
    source: 'src/components/Icon.astro',
  },
];

export const retired: { name: string; replaced: L }[] = [
  {
    name: 'Terminal',
    replaced: {
      en: 'The career test-run panel left the hero in version 2, along with `code-terminal`. Its `surface-sunken-bar`, `shadow-float` and `code-bar` (now `code-locator`) moved to the Inspect mode tooltip.',
      es: 'El panel de carrera como ejecución de pruebas salió del hero en la versión 2, junto con `code-terminal`. Sus `surface-sunken-bar`, `shadow-float` y `code-bar` (ahora `code-locator`) pasaron al tooltip del modo inspección.',
    },
  },
];

export const pageCopy = {
  en: {
    title: 'Design system',
    description: 'The tokens, components and rules behind this site: color, type, spacing, motion, accessibility and every component, with live examples.',
    intro: 'Everything this site is built from: tokens, components and the rules for using them. Examples are live, styled by the same CSS as the rest of the site, and tests fail if the dark colors drift from it.',
    tokenUsageNote: '',
    toc: 'On this page',
    version: 'Version',
    voice: { title: 'Voice', items: ['Plain, confident and specific. Lead with real outcomes and numbers, name the tools, and keep claims honest.', 'Everything ships in English and Spanish. Product names, job titles and skill tags stay in English in both.', 'No job-availability messaging, and no filler figures.'] },
    logo: { title: 'Logo and assets', intro: 'The JB monogram is a heavy B with a J cut through it; the J’s dot sits above the B in Hot Fuchsia.', rules: ['Clear space: at least the dot’s diameter on every side.', 'Minimum size: 16px on screen, 8 mm in print.', 'Don’t stretch, outline or rotate it, and don’t set it in the same accent as the background behind it.'] },
    color: { title: 'Color', intro: 'Dark is the primary theme: it is the website. Light is a reference palette for light grounds; the CV keeps its own print colors. Sea green means action and pass, blue bell means link, and fuchsia is the accent mark. Text on any colored fill is `on-color`.', token: 'Token', dark: 'Dark', light: 'Light', variable: 'Site variable', usage: 'Usage', naming: 'Watch the names: the site’s `--surface` is the token `surface-raised`, while the token `surface` is the site’s `--bg`.', },
    contrast: { title: 'Contrast', intro: 'Every allowed text-on-ground pair, computed from the tokens. Each must reach 4.5:1 in both themes. `hot` is a mark, not text on light grounds (3.3:1 on `bright-snow`).', pair: 'Text on ground' },
    type: { title: 'Type', intro: 'Oswald for headings, numbers and small uppercase labels; Nunito for everything you read; JetBrains Mono for code and chips. JetBrains Mono isn’t bundled, so it falls back to the system monospace.', sample: 'Quality you can read' },
    spacing: { title: 'Spacing', name: 'Token', value: 'Value', usage: 'Usage' },
    radius: { title: 'Radius' },
    elevation: { title: 'Elevation', intro: 'Depth comes from surface steps and borders. One shadow exists, for the one element that floats.' },
    motion: { title: 'Motion', intro: 'Motion confirms an action or marks an entrance; it never carries information alone. Under `prefers-reduced-motion: reduce` all hero animation and transitions stop, and state stays correct because transforms that carry state are not removed.', name: 'Name', value: 'Timing', usage: 'Used for' },
    icons: { title: 'Icons', intro: 'Tabler Icons (MIT), stroke 2, in `currentColor`, rendered to inline SVG at build time. No emoji as icons. The ✓ and ✗ glyphs are used only as pass and fail marks.' },
    a11y: { title: 'Accessibility', items: ['WCAG 2.1 AA, checked by axe-core on every route, in both languages, on every deploy.', 'Text reaches 4.5:1; focus rings are a solid 3px `primary` with a 3px offset.', 'Controls are real `button` and `a` elements. Icons next to text hide from assistive technology.', 'Buttons and controls are at least 44px tall. Links inside text and lists are exempt.', 'Content revealed on hover also appears on focus or tap, can be dismissed with Esc, and stays open while the pointer is over it.', 'Everything essential works without JavaScript and without motion.', 'Nothing overflows horizontally at 320px wide.'] },
    components: { title: 'Components', provides: 'You provide', tokens: 'Tokens', rules: 'Rules', source: 'Source', usage: 'Usage', groups: { hero: 'Hero', navigation: 'Navigation and page frame', content: 'Content', data: 'Lists and data', brand: 'Brand' } },
    patterns: { title: 'Page patterns', items: ['Sections alternate between `surface` and `surface-alt` bands, each band with a hairline above and below.', 'Pages sit in a 1120px container with a 1.25rem gutter; reading text is limited to 760px.', 'A section opens with a section title, then an optional `lead` paragraph in `text-muted`.', 'The brand divider, a logo between fading hairlines, separates About from Experience.', 'Every page has an English and a Spanish version, linked by the language switch and `hreflang`.'] },
    retired: { title: 'Retired' },
  },
  es: {
    title: 'Sistema de diseño',
    description: 'Los tokens, componentes y reglas detrás de este sitio: color, tipografía, espaciado, movimiento, accesibilidad y cada componente, con ejemplos en vivo.',
    intro: 'Todo aquello con lo que está construido este sitio: tokens, componentes y las reglas para usarlos. Los ejemplos son en vivo, con el mismo CSS del resto del sitio, y las pruebas fallan si los colores oscuros dejan de coincidir con él.',
    tokenUsageNote: 'Las notas de uso de los tokens están en inglés, igual que el archivo de tokens.',
    toc: 'En esta página',
    version: 'Versión',
    voice: { title: 'Voz', items: ['Clara, segura y específica. Empieza por resultados y cifras reales, nombra las herramientas y sé honesto en lo que afirmas.', 'Todo se publica en inglés y español. Los nombres de productos, cargos y etiquetas de habilidades quedan en inglés en ambos.', 'Sin mensajes de disponibilidad laboral y sin cifras de relleno.'] },
    logo: { title: 'Logo y recursos', intro: 'El monograma JB es una B robusta con una J recortada; el punto de la J queda sobre la B en Hot Fuchsia.', rules: ['Espacio libre: al menos el diámetro del punto en cada lado.', 'Tamaño mínimo: 16px en pantalla, 8 mm en impresión.', 'No lo estires, delinees ni gires, y no lo pongas en el mismo acento que el fondo.'] },
    color: { title: 'Color', intro: 'El oscuro es el tema principal: es el sitio. El claro es una paleta de referencia para fondos claros; el CV mantiene sus propios colores de impresión. El verde mar significa acción y aprobado, el azul significa enlace y el fucsia es la marca de acento. El texto sobre cualquier relleno de color es `on-color`.', token: 'Token', dark: 'Oscuro', light: 'Claro', variable: 'Variable del sitio', usage: 'Uso', naming: 'Atención a los nombres: `--surface` del sitio es el token `surface-raised`, mientras que el token `surface` es `--bg` en el sitio.', },
    contrast: { title: 'Contraste', intro: 'Cada combinación permitida de texto y fondo, calculada a partir de los tokens. Todas deben llegar a 4.5:1 en ambos temas. `hot` es una marca, no texto sobre fondos claros (3.3:1 sobre `bright-snow`).', pair: 'Texto sobre fondo' },
    type: { title: 'Tipografía', intro: 'Oswald para títulos, números y etiquetas pequeñas en mayúsculas; Nunito para todo lo que se lee; JetBrains Mono para código y chips. JetBrains Mono no está incluida, así que usa la monoespaciada del sistema.', sample: 'Calidad que se puede leer' },
    spacing: { title: 'Espaciado', name: 'Token', value: 'Valor', usage: 'Uso' },
    radius: { title: 'Radios' },
    elevation: { title: 'Elevación', intro: 'La profundidad viene de los niveles de superficie y los bordes. Existe una sola sombra, para el único elemento que flota.' },
    motion: { title: 'Movimiento', intro: 'El movimiento confirma una acción o marca una entrada; nunca lleva información por sí solo. Con `prefers-reduced-motion: reduce` se detienen todas las animaciones y transiciones del hero, y el estado sigue correcto porque no se eliminan las transformaciones que lo representan.', name: 'Nombre', value: 'Tiempo', usage: 'Se usa para' },
    icons: { title: 'Íconos', intro: 'Tabler Icons (MIT), trazo 2, en `currentColor`, renderizados como SVG en línea al compilar. Sin emoji como íconos. Los glifos ✓ y ✗ se usan solo como marcas de aprobado y fallido.' },
    a11y: { title: 'Accesibilidad', items: ['WCAG 2.1 AA, verificado con axe-core en cada ruta, en ambos idiomas, en cada despliegue.', 'El texto llega a 4.5:1; los anillos de foco son `primary` sólido de 3px con 3px de separación.', 'Los controles son elementos `button` y `a` reales. Los íconos junto a texto se ocultan a la tecnología de asistencia.', 'Los botones y controles miden al menos 44px de alto. Los enlaces dentro de texto y listas están exentos.', 'Lo que aparece al pasar el cursor también aparece al enfocar o tocar, se puede cerrar con Esc y sigue abierto mientras el cursor esté encima.', 'Todo lo esencial funciona sin JavaScript y sin movimiento.', 'Nada se desborda horizontalmente a 320px de ancho.'] },
    components: { title: 'Componentes', provides: 'Tú aportas', tokens: 'Tokens', rules: 'Reglas', source: 'Código', usage: 'Uso', groups: { hero: 'Hero', navigation: 'Navegación y marco de página', content: 'Contenido', data: 'Listas y datos', brand: 'Marca' } },
    patterns: { title: 'Patrones de página', items: ['Las secciones alternan bandas `surface` y `surface-alt`, cada banda con una línea fina arriba y abajo.', 'Las páginas van en un contenedor de 1120px con margen de 1.25rem; el texto de lectura se limita a 760px.', 'Una sección abre con un título de sección y luego un párrafo `lead` opcional en `text-muted`.', 'El divisor de marca, un logo entre líneas que se desvanecen, separa Sobre mí de Experiencia.', 'Cada página tiene versión en inglés y español, enlazadas por el cambio de idioma y `hreflang`.'] },
    retired: { title: 'Retirado' },
  },
};
