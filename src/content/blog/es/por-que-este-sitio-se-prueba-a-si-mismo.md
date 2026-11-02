---
title: 'Por qué mi portafolio tiene una suite de pruebas'
description: 'El sitio de un ingeniero de QA debe predicar con el ejemplo: E2E, accesibilidad y validación de enlaces antes de cada despliegue.'
date: 2026-11-01
tags: ['Playwright', 'Accesibilidad', 'CI/CD']
translation: 'why-this-site-tests-itself'
---

Un portafolio es un producto pequeño. Tiene usuarios (reclutadores, líderes técnicos, colegas),
flujos críticos (leer el perfil, descargar el CV, contactarme) y regresiones que duelen (un enlace
roto al CV es una oportunidad perdida). Así que lo trato como cualquier producto que probaría.

## Qué se ejecuta en cada push

Antes de que GitHub Pages publique algo, un job de GitHub Actions construye el sitio y ejecuta una
suite de Playwright contra el build de producción:

- **Smoke y contenido:** ambas versiones de idioma muestran el perfil, la experiencia y los proyectos.
- **Flujos críticos:** la descarga del CV devuelve un PDF real; el cambio de idioma te mantiene en
  la página equivalente; todos los enlaces internos responden.
- **Accesibilidad:** [axe-core](https://github.com/dequelabs/axe-core) analiza cada página y falla
  el build ante violaciones WCAG A/AA.
- **SEO básico:** URLs canónicas, alternativas `hreflang` y meta descripciones se verifican, no se asumen.

Si algo falla, el despliegue nunca empieza. La misma regla que aplico en el trabajo: **la calidad es
una compuerta, no un reporte que se lee después.**

## ¿Por qué molestarse en un sitio estático?

Porque el lugar más barato para mostrar cómo trabajas es tu propio código. El
[código está en GitHub](https://github.com/JulianBeta/JulianBeta.github.io) — las pruebas son la
parte más interesante.
