---
title: 'Cuando la tecnología avanza más rápido que la industria'
description: 'Lancé mi página, mi LinkedIn y mis CV de manera asistida con IA. Una retrospectiva sobre la brecha entre el día a día y los nuevos estándares, y lo que esta semana mostró sobre seguridad en agentes de IA.'
date: 2026-11-02
tags: ['IA', 'QA', 'Seguridad']
draft: true
translation: 'technology-moves-faster-than-the-industry'
---

Esta semana lancé esta página, actualicé mi perfil de LinkedIn y mis CV. Todo lo hice de manera
asistida con Claude, y no fue un atajo: fue un ejercicio personal para usar la IA de varias formas al
mismo tiempo y, de paso, empezar a generar contenido que me sirva como retrospectiva de lo que voy
aprendiendo y aplicando.

Quiero usar este primer post de reflexión para poner en perspectiva una problemática que creo que
muchos en tecnología vivimos y pocas veces decimos en voz alta.

## La brecha entre el día a día y los nuevos estándares

En el trabajo uno hace determinadas cosas con determinadas herramientas. Hay un stack definido, un
cliente, unos tiempos y unas expectativas que hay que cumplir. Al mismo tiempo, por fuera, cada semana
aparece un estándar nuevo: un protocolo para conectar agentes, una forma distinta de generar pruebas,
un framework de evaluación de LLMs, una nueva versión de Playwright que cambia cómo escribo un test.

Lo difícil es que muchas veces no se puede conectar una cosa con la otra. Lo que estoy aprendiendo no
siempre tiene espacio en lo que hago a diario, y lo que hago a diario no siempre corresponde a los
nuevos estándares. No es culpa de nadie: los proyectos tienen compromisos, y cambiar de herramienta
en medio de una entrega tiene un costo real.

Mi conclusión es que el desarrollo de la tecnología está avanzando más rápido que la industria de la
tecnología. Y si uno se queda en la burbuja del día a día, se queda atrás.

## Mi estrategia: proyectos personales y escribir

Por eso, nuevamente, hay que encontrar estrategias. Las mías, por ahora, son dos:

- **Proyectos personales como laboratorio.** Este sitio es un ejemplo: está hecho en Astro y se prueba
  a sí mismo con Playwright y axe-core en GitHub Actions antes de cada despliegue. El CV en inglés y
  español se genera desde los mismos datos de la página, y una prueba verifica que quepa en dos
  páginas. También reconstruí mi framework de Playwright para Swag Labs, que pasó de 2 a 99 escenarios
  en tres navegadores.
- **Escribir.** Este blog es mi retrospectiva. Obligarme a explicar qué hice y por qué me ayuda a
  separar lo que de verdad entendí de lo que solo copié.

Y la IA está en el centro de las dos. Incluso este post salió de una rutina semanal en la que un agente
me pregunta qué avancé, revisa mis repositorios, busca noticias de la industria y me propone
borradores. Yo decido qué se queda y qué no.

[COMPLETAR: un ejemplo concreto de algo que la IA hizo bien y algo que tuviste que corregir o decidir tú
al armar la página o los CV.]

## Esta semana la brecha se vio en seguridad

La velocidad tiene un costo, y esta semana se notó en varias herramientas de desarrollo con IA:

- Investigadores de Forever Security encontraron un `AGENTS.md` malicioso en la carpeta Downloads de un
  cliente que llevó a un agente de código a intentar instalar un paquete npm falso
  ([BleepingComputer](https://bleepingcomputer.com/news/security/ai-coding-agents-hijacked-using-agentsmd-file-in-downloads-folder),
  25 de octubre).
- El mismo equipo mostró fallas en los navegadores embebidos de Cursor, GitHub Copilot, OpenAI Codex,
  VS Code y Claude Desktop: una página web o un archivo local podía llegar al computador del
  desarrollador ([Help Net Security](https://www.helpnetsecurity.com/2026/10/29/research-ai-assistant-browser-vulnerabilities/),
  29 de octubre). Algunos ya están corregidos y otros no.
- Wiz le dice a este mes "Black October" por la cantidad de incidentes en plataformas de desarrollo con
  IA ([Anadolu Agency](https://www.aa.com.tr/en/world/timeline-ai-at-center-of-october-cyberattack-wave-targeting-tech-giants-developer-platforms/4108775)).

Para mí, esto conecta directamente con lo anterior. Los agentes llegaron a nuestro día a día más rápido
que las prácticas para probarlos y asegurarlos. Y yo no estoy por fuera de eso: el mismo agente que me
ayuda con este blog tiene acceso a una carpeta de mi computador.

## Lo que me llevo como QA

- **Los archivos de instrucciones son código.** Un `AGENTS.md` o un `CLAUDE.md` cambia lo que hace el
  agente, así que merece la misma revisión que un script en un PR.
- **El agente trabaja en carpetas de proyecto, no en Downloads.** Es la recomendación de los propios
  investigadores, y es fácil de aplicar.
- **Las extensiones, los permisos y el navegador embebido también son superficie de prueba.** Si un
  equipo adopta un agente, alguien debería probar qué pasa cuando el agente lee contenido malicioso.
  Eso es prompt injection indirecta, y es justo el tipo de caso que quiero cubrir en mi proyecto de
  evaluación y red teaming con Promptfoo.

[COMPLETAR: si quieres, una línea sobre cómo lo vives en el trabajo, sin datos del cliente.]

## Para cerrar

No creo que la solución sea perseguir cada herramienta nueva. Lo que me funciona es tener un espacio
propio para explorar, con la misma disciplina que aplico en el trabajo: pruebas, CI y revisar lo que
la IA produce antes de confiar en ello.

¿Y ustedes? ¿Cómo conectan lo que aprenden con lo que hacen a diario?
