# Plan de Desarrollo APP-Z3L2

## Fase 0: preparación

Objetivo: dejar la base local, documentación, Linear y GitHub preparados.

Alcance:
- Estructura `src/` para Apps Script.
- Documentación maestra.
- Configuración inicial de clasp.
- Registro del plan en Linear.
- Respaldo en GitHub.

Criterio de aceptación:
- El repositorio contiene documentación y código base modular.
- No existen datos de ejemplo en la aplicación.
- La conexión a Google se deja documentada como paso operativo.

## Fase 1: modelo de datos

Objetivo: crear hojas vacías con encabezados definitivos.

Tareas:
- Implementar `setupDatabase()`.
- Crear hojas de catálogos, artículos, borradores, historial, bloqueos, errores y respaldos.
- Validar que no se inserten registros iniciales.

## Fase 2: seguridad y sesión

Objetivo: exigir sesión Google y bloquear operaciones si Apps Script no entrega identidad.

Tareas:
- Centralizar `SecurityService`.
- Proteger cada función pública.
- Registrar errores sin exponer trazas al usuario.

## Fase 3: catálogos

Objetivo: administrar categorías, botellas, relaciones, secciones, campos y unidades.

Tareas:
- Crear, editar, activar y desactivar entidades.
- Evitar duplicados por nombre normalizado.
- Mostrar desactivados bajo demanda.

## Fase 4: configuración dinámica

Objetivo: permitir secciones y campos activos ordenados.

Tareas:
- Campos de tipo texto y número.
- Unidades opcionales para números.
- Carga automática de campos activos en artículos nuevos.

## Fase 5: asistente de creación

Objetivo: construir el flujo guiado “Agregar producto nuevo”.

Tareas:
- Seleccionar o crear categoría y botella.
- Crear relación categoría-botella.
- Capturar código, descripción, ETQ, CET, Medalla y valores dinámicos.
- Guardar borrador o activar si pasa validaciones.

## Fase 6: borradores

Objetivo: manejar pendientes, descartados y recuperación.

Tareas:
- Bloqueo de edición por 15 minutos.
- Modo lectura para otros usuarios.
- Motivo obligatorio al descartar.
- Recuperación con historial.

## Fase 7: consulta

Objetivo: consulta solo lectura con tres selectores en cascada.

Tareas:
- Categoría activa.
- Botella activa relacionada.
- Artículo activo.
- Ficha técnica completa.

## Fase 8: imágenes

Objetivo: validar y guardar PNG menores a 1 MB en Drive.

Tareas:
- Validación frontend y backend.
- Vista previa local.
- Subida a Drive.
- Reemplazo seguro y limpieza del archivo anterior.

## Fase 9: historial

Objetivo: registrar evento y detalle campo a campo.

Tareas:
- Crear, modificar, activar, desactivar, descartar, recuperar, reemplazar imagen y generar PDF.
- Filtros por producto, usuario y fechas.

## Fase 10: PDF

Objetivo: generar ficha textual sin imágenes.

Tareas:
- Branding.
- Datos principales.
- ETQ/CET/Medalla como código y estado, sin imagen.
- Campos dinámicos.

## Fase 11: respaldo

Objetivo: generar ZIP con CSV por hoja y JSON maestro.

Tareas:
- Exportar hojas.
- Crear JSON relacional.
- Guardar log de respaldo.

## Fase 12: responsive y revisión visual

Objetivo: pulir la experiencia para computador, tablet y celular.

Tareas:
- Revisar textos UTF-8.
- Validar contraste.
- Evitar solapes.

## Fase 13: pruebas

Objetivo: comprobar flujos críticos.

Tareas:
- Duplicados.
- Borradores bloqueados.
- Imagen inválida.
- PDF sin imágenes.
- Respaldo usable.

## Fase 14: despliegue

Objetivo: publicar versión estable.

Tareas:
- Probar URL `/dev`.
- Crear versión Apps Script.
- Publicar URL `/exec`.
- Registrar versión en `CAMBIOS.md`.
