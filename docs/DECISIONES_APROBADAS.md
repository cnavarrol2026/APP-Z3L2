# Decisiones Aprobadas

Fecha: 2026-07-17

## Acceso

La aplicación se publicará para usuarios autenticados con Google. No habrá restricción por dominio ni lista de correos.

## Administración

No existen roles. Todos los usuarios que accedan a la web podrán administrar.

## Imágenes

- Solo PNG.
- Máximo 1 MB.
- Validación en frontend y backend.
- Sin conversión ni redimensionamiento pesado en Apps Script.
- Vista previa local antes de subir.

## PDF

El PDF no incluirá imágenes ETQ/CET. Debe ser textual, liviano y rápido.

## Borradores

No se permite edición simultánea. El bloqueo vence tras 15 minutos de inactividad.

## Historial

Se registra evento general y detalle campo a campo.

## Respaldo

La aplicación tendrá un botón manual para generar un ZIP con:

- un CSV por hoja;
- un `backup.json` maestro para restauración o migración futura.

## Repositorio y Linear

- Linear: `VSP-8 APP-Z3L2`.
- GitHub: `cnavarrol2026/APP-Z3L2`.
