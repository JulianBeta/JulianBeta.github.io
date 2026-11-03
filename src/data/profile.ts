// Single source of truth for profile content. Keep in sync with the CV and LinkedIn.
export type Lang = 'en' | 'es';
type L = Record<Lang, string>;

export const profile = {
  name: 'Julian Betancourt Cuervo',
  initials: 'JB',
  headline: {
    en: 'Lead QA Automation Engineer · Playwright SME · AI-Assisted Testing',
    es: 'Lead QA Automation Engineer · Playwright SME · Testing asistido por IA',
  } as L,
  location: { en: 'Bogotá, Colombia · Remote', es: 'Bogotá, Colombia · Remoto' } as L,
  email: 'carramplancha@gmail.com',
  phone: '+57 300 682 2639', // CV only
  website: 'https://julianbeta.github.io',
  linkedin: 'https://www.linkedin.com/in/julian-betancourt-cuervo-a05820ab/',
  github: 'https://github.com/JulianBeta',
  cv: { en: '/cv/Julian-Betancourt-CV.pdf', es: '/cv/Julian-Betancourt-CV-ES.pdf' } as L,
  yearsExperience: 11,
  summary: {
    en: 'I design, build and scale test automation that teams actually trust. Over 11 years I have gone from manual and Selenium suites to leading a QA Center of Excellence that standardized Playwright for E2E and API testing across client teams — and today I focus on bringing AI into testing responsibly: MCP-driven test generation, self-healing, and evaluating LLM-powered products.',
    es: 'Diseño, construyo y escalo automatización de pruebas en la que los equipos realmente confían. En 11 años pasé de suites manuales y Selenium a liderar un Centro de Excelencia de QA que estandarizó Playwright para pruebas E2E y de API en múltiples equipos — y hoy me enfoco en llevar la IA al testing de forma responsable: generación de pruebas con MCP, self-healing y evaluación de productos basados en LLMs.',
  } as L,
  stats: [
    { value: '11+', label: { en: 'years in QA', es: 'años en QA' } as L },
    { value: '4+', label: { en: 'years leading', es: 'años liderando' } as L },
    { value: '40%', label: { en: 'faster, more reliable runs', es: 'ejecuciones más rápidas y estables' } as L },
    { value: '30%', label: { en: 'less maintenance with AI', es: 'menos mantenimiento con IA' } as L },
  ],
};

export interface Job {
  role: L;
  company: string;
  place: L;
  start: string;
  end: string | null;
  highlights: Record<Lang, string[]>;
  stack: string[];
}

export const experience: Job[] = [
  {
    role: { en: 'Senior QA Automation Engineer', es: 'Senior QA Automation Engineer' },
    company: 'Perficient Latin America',
    place: { en: 'Bogotá, Colombia', es: 'Bogotá, Colombia' },
    start: '2026-09',
    end: null,
    highlights: {
      en: [
        'UI test automation with Playwright.',
        'Data validation and backend checks with SQL.',
        'Working in a Microsoft Azure environment with Copilot for AI-assisted test development.',
      ],
      es: [
        'Automatización de pruebas de UI con Playwright.',
        'Validación de datos y verificaciones de backend con SQL.',
        'Trabajo en un entorno Microsoft Azure con Copilot para desarrollo de pruebas asistido por IA.',
      ],
    },
    stack: ['Playwright', 'SQL', 'Microsoft Azure', 'Copilot'],
  },
  {
    role: { en: 'QA TechLab CoE Lead · QA Subject Matter Expert', es: 'Líder CoE QA TechLab · QA Subject Matter Expert' },
    company: 'LeanTech',
    place: { en: 'Remote', es: 'Remoto' },
    start: '2024-03',
    end: '2026-02',
    highlights: {
      en: [
        'Established Playwright as the enterprise-wide standard for E2E and API automation, improving execution speed and reliability by 40%.',
        'Led the QA Center of Excellence, defining the quality roadmap across multiple client-facing product teams.',
        'Pioneered Playwright MCP for AI-assisted test generation and self-healing scripts, cutting maintenance by 30%.',
        'Architected a Playwright API layer validating Auth0 OAuth 2.0/OIDC token exchanges and RBAC across microservices.',
        'Integrated API security checks into CI/CD: token expiry, signature validation and unauthorized redirect-URI prevention.',
        'Implemented Page Object Model and Screenplay patterns in TypeScript for large, maintainable enterprise suites.',
        'Founded "QA Forums" to mentor junior and mid-level engineers and raise technical maturity.',
      ],
      es: [
        'Establecí Playwright como estándar empresarial para automatización E2E y de API, mejorando velocidad y confiabilidad en un 40%.',
        'Lideré el Centro de Excelencia de QA, definiendo la hoja de ruta de calidad para múltiples equipos de producto.',
        'Impulsé Playwright MCP para generación de pruebas asistida por IA y scripts self-healing, reduciendo el mantenimiento un 30%.',
        'Diseñé una capa de pruebas de API en Playwright para validar intercambios de tokens OAuth 2.0/OIDC de Auth0 y RBAC en microservicios.',
        'Integré pruebas de seguridad de API en CI/CD: expiración de tokens, validación de firmas y prevención de redirect URI no autorizados.',
        'Implementé los patrones Page Object Model y Screenplay en TypeScript para suites empresariales grandes y mantenibles.',
        'Fundé "QA Forums" para mentorear ingenieros junior y semi-senior y elevar la madurez técnica.',
      ],
    },
    stack: ['Playwright', 'TypeScript', 'Node.js', 'AI/LLM', 'Jenkins', 'AWS', 'GitHub Actions'],
  },
  {
    role: { en: 'Test System Specialist', es: 'Test System Specialist' },
    company: 'Amadeus',
    place: { en: 'Bogotá, Colombia', es: 'Bogotá, Colombia' },
    start: '2023-08',
    end: '2024-03',
    highlights: {
      en: [
        'SME for the core Inventory and Flight Systems (UCS) serving global airline clients.',
        'Developed and debugged backend test scripts; deep log investigations for root-cause analysis.',
        'Primary technical contact for airline clients on testability and escalated issues.',
      ],
      es: [
        'SME de los sistemas centrales de Inventario y Vuelos (UCS) para aerolíneas globales.',
        'Desarrollé y depuré scripts de prueba backend; análisis profundo de logs para causa raíz.',
        'Contacto técnico principal con aerolíneas en testabilidad y casos escalados.',
      ],
    },
    stack: ['Backend testing', 'Log analysis', 'SaaS integrations'],
  },
  {
    role: { en: 'QA Automation Engineer', es: 'QA Automation Engineer' },
    company: 'Zemoga',
    place: { en: 'Bogotá, Colombia', es: 'Bogotá, Colombia' },
    start: '2020-12',
    end: '2023-08',
    highlights: {
      en: [
        'QA for the DirecTV Roku native app: planning, resourcing and automation strategy.',
        'Led the migration from a legacy Node.js solution to Playwright for critical streaming flows.',
        'Designed the E2E strategy for SSO and session persistence across the streaming ecosystem.',
        'Maintained Selenium (Java/Node.js) UI and backend frameworks for Morningstar; introduced BDD and shift-left practices.',
      ],
      es: [
        'QA de la app nativa de DirecTV para Roku: planeación, recursos y estrategia de automatización.',
        'Lideré la migración de una solución legacy en Node.js a Playwright para flujos críticos de streaming.',
        'Diseñé la estrategia E2E de SSO y persistencia de sesión en el ecosistema de streaming.',
        'Mantuve frameworks Selenium (Java/Node.js) de UI y backend para Morningstar; introduje BDD y shift-left.',
      ],
    },
    stack: ['Playwright', 'TypeScript', 'Selenium', 'Java', 'Cucumber', 'Roku/OTT'],
  },
  {
    role: { en: 'Senior Test Automation Engineer', es: 'Senior Test Automation Engineer' },
    company: 'CSG International',
    place: { en: 'Bogotá, Colombia', es: 'Bogotá, Colombia' },
    start: '2020-02',
    end: '2020-10',
    highlights: {
      en: [
        'Designed the test strategy for a Journey Orchestration backend serving three global clients.',
        'Built a Cypress (TypeScript) framework from scratch reaching 90% regression coverage.',
        'Implemented Cucumber for testing AWS-hosted microservices.',
      ],
      es: [
        'Diseñé la estrategia de pruebas de un backend de Journey Orchestration para tres clientes globales.',
        'Construí desde cero un framework Cypress (TypeScript) con 90% de cobertura de regresión.',
        'Implementé Cucumber para probar microservicios alojados en AWS.',
      ],
    },
    stack: ['Cypress', 'TypeScript', 'Cucumber', 'AWS'],
  },
  {
    role: { en: 'QA Analyst', es: 'QA Analyst' },
    company: 'Huge Inc.',
    place: { en: 'Bogotá, Colombia', es: 'Bogotá, Colombia' },
    start: '2018-09',
    end: '2020-02',
    highlights: {
      en: ['Functional, UI and cross-browser QA for premium brands such as Revlon, ExxonMobil and Hublot.'],
      es: ['QA funcional, de UI y cross-browser para marcas premium como Revlon, ExxonMobil y Hublot.'],
    },
    stack: ['Selenium', 'JavaScript', 'Jenkins', 'BrowserStack'],
  },
  {
    role: { en: 'Senior QA Engineer', es: 'Senior QA Engineer' },
    company: 'IT Crowd',
    place: { en: 'Remote · Argentina', es: 'Remoto · Argentina' },
    start: '2018-05',
    end: '2018-09',
    highlights: {
      en: ['Built a mobile/UI automation framework with Ruby, Appium and Selenium following TDD.'],
      es: ['Construí un framework de automatización móvil/UI con Ruby, Appium y Selenium siguiendo TDD.'],
    },
    stack: ['Ruby', 'Appium', 'Selenium'],
  },
  {
    role: { en: 'Senior Functional & Automation QA', es: 'Senior Functional & Automation QA' },
    company: 'Prodigious Brand Logistics',
    place: { en: 'Bogotá, Colombia', es: 'Bogotá, Colombia' },
    start: '2015-06',
    end: '2018-04',
    highlights: {
      en: ['Features lead for the HELIOS Alliance (Renault, Nissan): test plans and Ruby/Selenium regression suites.'],
      es: ['Líder de features para la Alianza HELIOS (Renault, Nissan): planes de prueba y regresión con Ruby/Selenium.'],
    },
    stack: ['Ruby', 'Selenium'],
  },
];

export const skills: { group: L; items: string[] }[] = [
  { group: { en: 'Automation', es: 'Automatización' }, items: ['Playwright (SME)', 'Cypress', 'Selenium WebDriver', 'Appium', 'WebdriverIO'] },
  { group: { en: 'Languages', es: 'Lenguajes' }, items: ['TypeScript', 'JavaScript', 'Java', 'Python', 'Ruby'] },
  { group: { en: 'API & Security', es: 'API y Seguridad' }, items: ['REST', 'Microservices', 'Auth0', 'OAuth 2.0 / OIDC', 'SAML / SSO', 'RBAC', 'Postman', 'SQL'] },
  { group: { en: 'AI in Testing', es: 'IA en Testing' }, items: ['Playwright MCP', 'LLM evaluation', 'Promptfoo', 'Red teaming', 'LLM-as-a-judge'] },
  { group: { en: 'DevOps & Cloud', es: 'DevOps y Cloud' }, items: ['GitHub Actions', 'Jenkins', 'Docker', 'AWS', 'Microsoft Azure', 'Git'] },
  { group: { en: 'Practices', es: 'Prácticas' }, items: ['Test strategy', 'BDD / Gherkin', 'Shift-left', 'TDD', 'QA governance', 'Mentorship'] },
];

export const certifications: { name: string; issuer: string }[] = [
  { name: 'ISTQB® Certified Tester – Foundation Level', issuer: 'iSQI' },
  { name: 'AWS Certified AI Practitioner', issuer: 'Amazon Web Services' },
  { name: 'Break Into AI Testing', issuer: 'Engenious University' },
  { name: 'AI-powered QA: Automatización y Agentes en Software Testing', issuer: 'Udemy' },
];

export interface Project {
  name: string;
  description: L;
  tags: string[];
  repo?: string;
  demo?: string;
  status: 'live' | 'wip';
}

// Order = display order. "wip" cards come from the GitHub roadmap in planning/01-github-assessment.md.
export const projects: Project[] = [
  {
    name: 'julianbeta.github.io',
    description: {
      en: 'This website. Static Astro site that tests itself: Playwright E2E, axe accessibility checks and link validation run in GitHub Actions before every deploy.',
      es: 'Este sitio. Sitio estático en Astro que se prueba a sí mismo: E2E con Playwright, accesibilidad con axe y validación de enlaces en GitHub Actions antes de cada despliegue.',
    },
    tags: ['Astro', 'Playwright', 'axe-core', 'GitHub Actions'],
    repo: 'https://github.com/JulianBeta/JulianBeta.github.io',
    status: 'live',
  },
  {
    name: 'Playwright + Cucumber BDD',
    description: {
      en: 'BDD framework for an e-commerce flow with Page Object Model, cross-browser parallel runs (Chromium, Firefox, WebKit) and HTML reports with failure screenshots.',
      es: 'Framework BDD para un flujo de e-commerce con Page Object Model, ejecución paralela cross-browser (Chromium, Firefox, WebKit) y reportes HTML con capturas de fallos.',
    },
    tags: ['Playwright', 'CucumberJS', 'POM', 'BDD'],
    repo: 'https://github.com/JulianBeta/FPTLA-QATEST',
    status: 'live',
  },
  {
    name: 'LLM Eval & Red Team',
    description: {
      en: 'Evaluating and red-teaming LLM chatbots with Promptfoo: guardrail tests, LLM-as-a-judge rubrics, local vs. cloud model comparisons, all in CI.',
      es: 'Evaluación y red teaming de chatbots LLM con Promptfoo: pruebas de guardrails, rúbricas LLM-as-a-judge, comparación de modelos locales vs. nube, todo en CI.',
    },
    tags: ['Promptfoo', 'LLM', 'Red teaming', 'CI'],
    status: 'wip',
  },
  {
    name: 'Playwright MCP · AI-assisted testing',
    description: {
      en: 'Generating tests from user stories with Playwright MCP and an LLM, plus self-healing locator experiments — with an honest write-up of what works and what flakes.',
      es: 'Generación de pruebas desde historias de usuario con Playwright MCP y un LLM, más experimentos de localizadores self-healing — con un análisis honesto de qué funciona y qué falla.',
    },
    tags: ['Playwright MCP', 'AI', 'TypeScript'],
    status: 'wip',
  },
  {
    name: 'OAuth / OIDC API Security Tests',
    description: {
      en: 'Playwright API suite for identity flows: token exchange, expiry, signature tampering, redirect-URI validation and an RBAC permission matrix.',
      es: 'Suite de API en Playwright para flujos de identidad: intercambio y expiración de tokens, manipulación de firmas, validación de redirect URI y matriz de permisos RBAC.',
    },
    tags: ['Playwright API', 'OAuth 2.0', 'OIDC', 'RBAC'],
    status: 'wip',
  },
];

export const languages: { name: L; level: L }[] = [
  { name: { en: 'Spanish', es: 'Español' }, level: { en: 'Native', es: 'Nativo' } },
  { name: { en: 'English', es: 'Inglés' }, level: { en: 'Fluent (professional)', es: 'Fluido (profesional)' } },
];
