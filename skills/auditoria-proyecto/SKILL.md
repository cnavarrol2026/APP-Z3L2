# Skill: Auditoría y planificación del proyecto

## Propósito

Esta skill define el proceso obligatorio que Codex debe seguir antes de desarrollar el proyecto “Estándar de Configuración Zona 3 Línea 2”.

Su objetivo es impedir que se programe prematuramente, asegurar que el alcance sea coherente y obligar a presentar riesgos, mejoras y decisiones técnicas antes de modificar el proyecto.

## Regla principal

No escribas código de producción, no crees archivos funcionales y no despliegues nada hasta que el usuario apruebe explícitamente:

1. La auditoría.
2. Las mejoras propuestas.
3. El plan de desarrollo definitivo.

## Orden obligatorio de trabajo

1. Leer completamente `docs/PROMPT_PROYECTO.md`.
2. Leer esta skill.
3. Leer `skills/apps-script-webapp/SKILL.md`.
4. Analizar `referencias/MANUAL Z3 PRUEBA.html` solo como referencia visual.
5. Revisar los recursos disponibles en `branding/`.
6. Realizar la auditoría.
7. Presentar mejoras clasificadas.
8. Esperar decisión del usuario.
9. Preparar el plan definitivo.
10. Esperar aprobación explícita.
11. Desarrollar por fases.

## Alcance de la auditoría

La auditoría debe revisar como mínimo:

- coherencia funcional;
- relaciones de datos;
- estados;
- flujos de creación;
- borradores;
- bloqueos de edición;
- historial;
- imágenes;
- PDF;
- permisos;
- acceso por dominios;
- concurrencia;
- rendimiento;
- límites de Apps Script;
- Google Sheets como almacenamiento;
- Google Drive como repositorio de imágenes;
- estructura de código;
- mantenibilidad;
- responsive;
- accesibilidad;
- ortografía;
- UTF-8;
- riesgos de caracteres extraños;
- escalabilidad futura.

## Clasificación obligatoria de mejoras

Cada mejora debe clasificarse como:

- Obligatoria
- Recomendada
- Opcional

Cada propuesta debe incluir:

- nombre;
- problema que resuelve;
- beneficio;
- complejidad;
- impacto en el usuario;
- impacto técnico;
- si cambia algún requerimiento;
- recomendación final.

No apliques automáticamente cambios funcionales.

## Preguntas

Haz preguntas solo cuando exista un bloqueo real.

No generes cuestionarios extensos.

Haz como máximo una pregunta por vez, concreta y funcional.

Evita preguntas de estilo o detalles que Codex pueda proponer directamente.

## Entregables de la auditoría

Debes entregar:

1. Resumen ejecutivo.
2. Interpretación funcional.
3. Contradicciones.
4. Vacíos.
5. Riesgos funcionales.
6. Riesgos técnicos.
7. Limitaciones de Apps Script.
8. Mejoras obligatorias.
9. Mejoras recomendadas.
10. Mejoras opcionales.
11. Arquitectura recomendada.
12. Modelo de datos.
13. Relaciones.
14. Estructura de Sheets.
15. Estructura de carpetas.
16. Flujo de pantallas.
17. Flujo del asistente.
18. Estrategia de imágenes.
19. Estrategia de borradores.
20. Estrategia de bloqueos.
21. Estrategia de historial.
22. Estrategia de PDF.
23. Estrategia de seguridad.
24. Estrategia de pruebas.
25. Criterios de aceptación.
26. Plan por fases propuesto.
27. Confirmación de no modificar proyectos anteriores.

## Plan de desarrollo

El plan debe dividirse en fases pequeñas, verificables y aprobables.

Cada fase debe incluir:

- objetivo;
- alcance;
- tareas;
- archivos afectados;
- dependencias;
- riesgos;
- pruebas;
- criterios de aceptación;
- resultado esperado.

No avances a la siguiente fase sin comprobar la anterior.

## Control de alcance

No agregues:

- React;
- Node.js;
- Firebase;
- Cloudflare;
- bases de datos externas;
- frameworks innecesarios;
- servicios de terceros;

salvo que exista una limitación real, se justifique y el usuario lo apruebe.

## Calidad de redacción

Toda salida debe usar español claro, profesional y consistente.

Revisar:

- ortografía;
- tildes;
- ñ;
- nombres;
- etiquetas;
- mensajes;
- codificación UTF-8.

No deben aparecer caracteres corruptos.

## Cierre

Cuando termines la auditoría, detente.

No programes.

Espera la aprobación explícita del usuario.
