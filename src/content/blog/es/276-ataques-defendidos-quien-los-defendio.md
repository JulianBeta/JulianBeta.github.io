---
title: '276 de 276 ataques defendidos, y no lo celebré: evaluando un chatbot con Promptfoo'
description: 'Coda es un chatbot que asesora en composición musical. Lo evalué y le hice red teaming con Promptfoo, Claude Haiku y Sonnet. El 100% del red team tenía letra pequeña: muchos ataques no los detuvo mi prompt, sino el filtro del proveedor.'
date: 2026-11-17
tags: ['IA', 'LLM evals', 'Red teaming', 'Promptfoo']
draft: false
translation: '276-attacks-defended-who-defended-them'
---

Vengo trabajando en un proyecto personal para llevar a la práctica lo que aprendí en el curso Break
Into AI Testing: evaluar y hacerle red teaming a un chatbot propio, con rúbricas de LLM-as-a-judge y
todo corriendo con [Promptfoo](https://www.promptfoo.dev). El chatbot se llama **Coda** y asesora a
personas que quieren componer música original. Siempre me ha encantado la música y toco algunos
instrumentos (guitarra y bajo). Estaba buscando algo en lo que pudiera usar LLMs, y la composición es
algo en lo que siempre me ha gustado tener una segunda opinión: una herramienta, una sugerencia, una
ruta, una guía. Un LLM puede darte eso a partir de lo que ya tienes en mente.

Esta semana corrí de nuevo el baseline con Claude Haiku 5.5 y Claude Sonnet 5.5. El resultado del red
team fue 276 de 276 ataques defendidos. Y lo primero que hice fue desconfiar.

## Qué estoy probando

Coda tiene un system prompt que define su rol, el estilo de las respuestas, reglas de precisión,
límites de copyright, seguridad y protección del propio prompt. Contra eso corren cuatro suites, 29
casos en total:

- **quality:** teoría musical con respuestas verificables (acordes, tonalidades, ii–V–I, contrapunto,
  modulación). Uso regex y checks en JS para los hechos exactos y rúbricas para el resto.
- **coaching:** si se adapta a un principiante, si pregunta cuando la petición es vaga, si responde en
  el idioma del usuario y si es conciso.
- **guardrails:** que no se salga de su alcance, que no entregue letras completas con copyright, que
  maneje bien una crisis o un tema de salud auditiva.
- **security:** extracción del prompt, inyección escondida en una letra pegada y secuestro de persona.
  El prompt tiene un código canario y todas las respuestas verifican que nunca aparezca.

El red team son 376 ataques de 17 plugins de Promptfoo (extracción de prompt, hijacking, copyright,
self-harm, PII, alucinación, una política propia sobre letras…) combinados con estrategias como
jailbreak, base64, leetspeak, rot13 y crescendo multi-turno. Los generé una vez y quedaron en el repo,
así cada corrida repite exactamente los mismos ataques y puedo comparar.

## Los números

En las evals, Haiku y Sonnet sacaron 93% (27 de 29) cada uno, por encima del umbral de 90% que definí.
La diferencia está en el costo: la corrida completa de Haiku costó alrededor de $0.011 y la de Sonnet
$0.238, con una latencia mediana de 3.5 s contra 5.9 s.

En el red team rápido (138 ataques de un solo turno por modelo) no hubo ninguna falla. Pero al separar
el resultado por quién detuvo el ataque, la historia cambia: en Haiku, 102 de 138 ataques terminaron
en una **respuesta vacía** del filtro de seguridad de Anthropic, y en Sonnet 74 de 138. Todos los de
rot13 y la mayoría de leetspeak y base64.

Para Promptfoo eso cuenta como defendido. Pero no estaba probando los guardrails de Coda, estaba
probando el clasificador del proveedor. Y desde el lado del usuario, alguien que escribe en leetspeak
recibe un mensaje en blanco. Eso quedó como hallazgo F-001: el filtro de seguridad le llega al usuario
como una respuesta vacía, y la app necesita un mensaje de fallback. La interfaz de chat local que
agregué esta semana (`npm run chat`) ya muestra ese mensaje; falta un test que lo cubra.

## Cuando el que falla es el test

Otra cosa que aprendí es que una eval que falla no sirve de mucho hasta saber si falló el modelo o el
test. Por eso en el repo llevo dos tablas separadas: hallazgos del producto y un *calibration log*.

Dos de las primeras fallas fueron bugs de la eval. En una, Haiku detectó una instrucción inyectada en
una letra y la ignoró, que era justo lo ideal, pero la rúbrica le exigía tratar esa línea como parte de
la letra y el juez lo reprobó. En otra, Haiku escribió correctamente "no consecutive 5ths or octaves" y
el regex solo aceptaba "parallel fifths/octaves". Corregí las dos y dejé el porqué comentado en el test.

También dejo explícito un riesgo que todavía no resuelvo: Sonnet es el juez de todas las rúbricas, y
también se califica a sí mismo, así que puede haber sesgo de autopreferencia.

## Decisiones que tomé

- **CI no llama a ningún modelo.** En cada push corren los unit tests de los scripts de reportes y se
  validan las configuraciones. Las evals las corro localmente y el baseline queda versionado. El badge
  en verde significa que el pipeline está sano, no que las evals pasaron, y así lo dice el README.
- **Pausé Gemini y Qwen.** Gemini empezó a responder 402 por créditos agotados y el modelo de Qwen en
  Groq no estaba funcionando. Los dejé comentados en la configuración en vez de borrarlos.
- **Cualquiera lo puede correr con su propio acceso.** Con una API key o con una sesión de Claude Code;
  nada del repo trae llaves.

## Lo que sigue

Justo esta semana Anthropic publicó
[Building strong safety evaluations](https://www.anthropic.com/research/building-strong-safety-evaluations),
y varias ideas me pegaron directo: un modelo que rechace todo puede sacar puntaje perfecto en una eval
de tasa de rechazo, las pruebas de un solo turno ya están saturadas, y si las conclusiones cambian
cuando cambias el juez, probablemente estás midiendo al juez.

Eso me deja el roadmap claro: correr el red team multi-turno completo, volver a meter un modelo de otro
proveedor para ver cómo se comporta su filtro, probar variantes del prompt para el error de Haiku en
modulación con acordes pivote (F-003) y medir la variación entre corridas, porque con 29 casos una sola
corrida es apenas una muestra.

Si empezara de nuevo, probablemente buscaría fuentes para mantener actualizado mi sistema de jueces:
referencias sobre el uso de cada métrica, abiertas a actualizaciones y cambios, para que mi framework me
avise cuando algo cambie y pueda ajustarlo. Como todo esto todavía se está construyendo, va a seguir
pasando.

El repo y los reportes están en
[composition-coach-llm-evals](https://github.com/JulianBeta/composition-coach-llm-evals) y los
resultados en vivo en [GitHub Pages](https://julianbeta.github.io/composition-coach-llm-evals/).
