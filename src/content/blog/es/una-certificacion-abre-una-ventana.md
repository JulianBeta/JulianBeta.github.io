---
title: 'Una certificación abre una ventana: lo que me dejó Break Into AI Testing'
description: 'Obtuve la certificación Break Into AI Testing de Engenious University. Valió la pena, pero el verdadero resultado depende de lo que construyas con ella y de las personas que conoces en el camino.'
date: 2026-11-17
tags: ['AI Testing', 'Certificaciones', 'Aprendizaje']
draft: false
translation: 'a-certification-opens-a-window'
---

Acabo de obtener la certificación **Break Into AI Testing** de Engenious University. Quiero escribir
sobre ella sin convertirla en un post de trofeo, porque lo que me llevo no es el certificado en sí. Una
certificación no cambia tu carrera por sí sola. Lo que hace es abrir una nueva ventana para empezar a
explorar.

## Lo que cubrió el bootcamp

El curso gira alrededor de [Promptfoo](https://www.promptfoo.dev) y el red teaming, a lo largo de
ocho sesiones. Arranca con lo básico (prompts, providers, assertions), pasa a romper chatbots a mano,
como un bot de triage médico y uno de inversiones, y después deja que un agente en Claude Code redacte
y ejecute los ataques. Luego viene la evaluación avanzada (pesos, métricas, F-score, temperatura) y,
al final, el testing de aplicaciones reales: una app corriendo detrás de un endpoint, donde las
assertions revisan la decisión de enrutamiento y las citas, no solo el texto de la respuesta.

La lección que más se me quedó fue la de calificar al calificador. El curso muestra un caso real en el
que el juez LLM aprobó una filtración completa del system prompt. Como QA, eso me resulta familiar: si
el oráculo está mal, toda la suite está mal, por más verde que se vea.

Lo que más me sorprendió fue ver cómo rinden los modelos gratuitos frente a los pagos. El curso corre
por defecto con modelos gratuitos en el free tier de Groq, con modelos pagos como opción, así que la
diferencia se ve directamente en los resultados. Algunos modelos gratuitos todavía sirven para ciertas
cosas. Pero pagar por un modelo para estudiar, usar y experimentar con alto rendimiento te ayuda a
ganar confianza en lo que los modelos pueden hacer y en dónde están sus límites.

## Vale la pena, pero el resultado depende de ti

Creo que las certificaciones valen la pena. Te dan estructura, una fecha límite y un vocabulario
común, algo difícil de conseguir cuando estudias por tu cuenta entre el trabajo y todo lo demás.

Pero el verdadero resultado depende de dos cosas. La primera es lo que de verdad haces con lo que
aprendiste. Un certificado en LinkedIn dice que terminaste un curso; un repo dice lo que puedes hacer
con él. La segunda son las redes que construyes. En un bootcamp conoces personas que enfrentan los
mismos problemas desde otras empresas, otros dominios y otros países, y esa perspectiva es difícil de
conseguir desde adentro de tu propio equipo.

## La tecnología avanza más rápido que la industria

Sigo volviendo a la misma idea: el desarrollo de la tecnología avanza más rápido que la industria de
la tecnología. En el trabajo hay un stack definido, un cliente y compromisos, y mientras tanto, afuera,
aparece un estándar nuevo cada semana.

Este bootcamp me confirmó algo: estar al tanto de nuevas tecnologías es apenas una responsabilidad
básica que tenemos como profesionales. No es un mérito ni algo extra que haces si te sobra tiempo. Es
parte del trabajo, igual que lo fue cuando pasamos de Selenium a Playwright.

Lo que sí te da un curso como este, más allá del contenido, es una mente abierta. La IA trae nuevos
desafíos al testing que no encajan bien en las categorías de siempre: resultados que cambian entre
corridas, jueces que también son modelos, ataques escritos en lenguaje natural. Si solo los miras desde
el día a día, es fácil descartarlos o asumir que tus herramientas actuales ya los cubren.

## Un ejemplo reciente: Coda y la guía de Anthropic

El curso me llevó a empezar **Coda**, un proyecto personal para evaluar y hacerle red teaming a un
chatbot que asesora en composición musical, usando Promptfoo con Claude Haiku y Sonnet. La historia
completa la conté en [otro post](/es/blog/276-ataques-defendidos-quien-los-defendio/).

Mientras corría su último baseline, Anthropic publicó
[Building strong safety evaluations](https://www.anthropic.com/research/building-strong-safety-evaluations).
Dos de sus ideas me hicieron releer mis propios resultados con otros ojos: un modelo que rechace todo
puede sacar puntaje perfecto en una eval de tasa de rechazo, y si las conclusiones cambian cuando
cambias el juez, probablemente estás midiendo al juez. Mi red team tuvo 276 de 276 ataques defendidos,
y muchos de ellos los detuvo el filtro del proveedor con una respuesta vacía, no mi prompt.

La guía salió mientras yo todavía estaba aplicando lo que acababa de aprender. Esa es la velocidad de
la que hablo: el terreno se sigue moviendo mientras todavía estás aprendiendo.

## Lo que sigue

Mi siguiente paso es la certificación **Claude Certified Architect**. La estoy estudiando y espero
obtenerla pronto. Pero sé que va a hacer lo mismo: abrir otra ventana.

Las preguntas que quiero responder con ella son dos. ¿Cómo le saco el máximo provecho a una suite
completa como Claude para mejorar mi trabajo? Y, al mismo tiempo, ¿cómo mantengo mi trabajo
independiente del proveedor de IA? Coda ya me dio una primera pista: las evals viven en configuración,
así que agregar o pausar un proveedor es cuestión de editar un bloque, no de reescribir los tests. Eso
es lo que viene.

La certificación abrió la ventana. Lo que entre por ella depende de lo que construya y de las personas
con las que siga aprendiendo.

¿Y ustedes? ¿Qué les ha servido más para mantenerse al día: certificaciones, comunidades o proyectos
personales?
