---
title: 'De 2 a 99 escenarios: cómo reconstruí mi framework de Playwright para Swag Labs'
description: 'Un repo viejo de CucumberJS pasó a Playwright Test + playwright-bdd en TypeScript: 99 escenarios, 3 navegadores, 16 bugs documentados y el reporte publicado por CI.'
date: 2026-11-03
tags: ['Playwright', 'BDD', 'TypeScript']
draft: true
translation: 'from-2-to-99-scenarios-playwright-swag-labs'
---

Tenía en GitHub un repo con Playwright y CucumberJS contra [saucedemo.com](https://www.saucedemo.com),
el e-commerce de demo de Sauce Labs. Era mi repo de automatización más fuerte y aun así tenía dos
escenarios: un happy path de login y carrito, y una falla intencional. Usaba APIs viejas (`$$`,
`isVisible`, validaciones con `if/throw` a mano), no corría en CI y la mayoría de sus archivos eran
reportes generados que nunca debieron estar en git.

Para alguien que se presenta como Playwright SME, eso no cuadraba. Así que lo reconstruí desde cero.
El resultado es [playwright-pom-saucedemo](https://github.com/JulianBeta/playwright-pom-saucedemo):
99 escenarios BDD en Chromium, Firefox y WebKit, con el
[reporte en vivo](https://julianbeta.github.io/playwright-pom-saucedemo/) que CI publica en cada ejecución.

[COMPLETAR: cuánto tiempo te tomó y si usaste IA (Copilot, Claude, Playwright MCP) en el proceso. Si sí, cuéntalo: es coherente con tu perfil de AI-assisted testing.]

## Primero explorar, después automatizar

Antes de escribir una línea de código recorrí el sitio con los seis usuarios de demo, con una
exploración guiada por scripts, y armé un mapa: páginas, flujos, mensajes de error y comportamientos
raros por usuario. Ahí salieron cosas como `problem_user` con todas las imágenes iguales, `error_user`
al que el botón Finish nunca le completa la orden, `visual_user` con precios que cambian en cada carga,
y algo que me sorprendió más: con `standard_user` se puede hacer checkout con el carrito vacío y
terminar una orden de $0.00.

Ese mapa se volvió primero la propuesta de features y después la matriz de cobertura del README.

## Las decisiones que más pesaron

**Playwright Test + playwright-bdd en vez de CucumberJS.** Quería conservar el Gherkin, pero ganar
todo lo que trae el runner oficial: fixtures, `expect` con auto-waiting, traces, sharding y UI mode.
playwright-bdd genera specs de Playwright a partir de los `.feature`, y con `missingSteps: 'fail-on-gen'`
un step sin implementar rompe la generación, no la ejecución.

**Page Object Model con componentes.** Los page objects exponen locators y acciones; las aserciones
viven en los steps. Header, menú lateral, footer y la tarjeta de producto son componentes compartidos.
Todos los locators usan `data-test` o roles ARIA, nada de selectores CSS frágiles.

**Setup rápido e independiente.** Solo los tests de login usan el formulario. El resto arranca la
sesión poniendo la cookie de la app y siembra el carrito por `localStorage`, así que cada escenario es
independiente y no paga el costo de loguearse por la UI.

**Un oráculo independiente para los totales.** El subtotal, el impuesto del 8% y el total se validan
contra un catálogo de productos en los datos de prueba (con la plata calculada en centavos), no contra
los números que la misma página muestra. Si la página calcula mal, comparar la página contra sí misma
nunca lo va a detectar.

**Cero sleeps.** Locators con auto-waiting, `expect.poll` para listas asíncronas y `page.clock` para
controlar el slider que rota solo. Sin `page.clock`, ese test depende de tener suerte con los tiempos.

## Los bugs conocidos como fallos esperados

Esta es la decisión que más me gusta del proyecto. Encontré 16 defectos reales, y cada uno tiene su
reporte en `docs/bugs/` y un escenario que describe el comportamiento **correcto**, etiquetado
`@known-bug @fail`:

```gherkin
@fail @BUG-005
Scenario: The last name field accepts input
  Given my cart contains "Sauce Labs Backpack"
  And I am on the checkout information page
  When I type "Betancourt" into the last name field
  Then the last name field should contain "Betancourt"
```

La suite se mantiene en verde mientras el bug exista. El día que lo arreglen, Playwright reporta que
el test se esperaba que fallara pero pasó, y eso es la señal para cerrar el bug y quitar la etiqueta.
Me parece mucho mejor que comentar el test o dejar el pipeline en rojo hasta que todo el equipo se
acostumbra a ignorarlo.

## Visual, accesibilidad y CI

La regresión visual usa `toHaveScreenshot()` sobre 7 pantallas, con el texto dinámico enmascarado y
solo en Chromium, porque las baselines dependen del navegador. Con `visual_user` el test compara contra
la baseline del usuario estándar, y ahí salta el layout distinto. La accesibilidad la revisa axe-core
en esas mismas pantallas: WCAG 2.1 AA tiene que pasar, y los hallazgos de best practices se adjuntan al
reporte en vez de romper el build.

En GitHub Actions primero corren formato, lint y type check; después 3 navegadores × 2 shards, los
reportes se unen en un solo HTML y se publican en GitHub Pages. Además corre una vez al día contra el
sitio en vivo. En local, Husky y lint-staged pasan ESLint (con `eslint-plugin-playwright`) y Prettier
antes de cada commit.

## Qué aprendí y qué haría distinto

Las baselines visuales dependen también del sistema operativo: lo que se renderiza en mi Mac no es
pixel a pixel lo que renderiza Linux en CI. Por eso quedaron guardadas por OS y el workflow tiene una
opción `update_snapshots` para regenerar las de Linux después de un cambio intencional de UI.

[COMPLETAR: lo más difícil o lo que más te enseñó el rebuild, con tus palabras.]

[COMPLETAR: qué harías distinto o qué sigue. Idea del plan: una capa de API y una variante Screenplay en un framework más grande, o generar escenarios con Playwright MCP y comparar.]

## Pruébalo

Necesitas Node.js 20+:

```bash
git clone https://github.com/JulianBeta/playwright-pom-saucedemo
cd playwright-pom-saucedemo
npm install
npx playwright install
npm run test:smoke        # solo @smoke
npm run test:known-bugs   # solo los escenarios @known-bug
npm run test:ui           # UI mode de Playwright
```

Si ves algo que harías distinto, el repo está abierto. Me interesa más esa conversación que las
estrellas.
