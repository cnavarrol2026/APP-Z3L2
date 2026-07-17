# Arquitectura

La aplicación usa Google Apps Script como backend y HTML Service como interfaz. La lógica crítica vive en backend.

## Capas

- Entrada web: `Code.gs`.
- API pública: `Api.gs`.
- Configuración: `Config.gs`.
- Seguridad: `SecurityService.gs`.
- Datos: `SheetRepository.gs`.
- Catálogos: `CatalogService.gs`.
- Artículos: `ArticleService.gs`.
- Borradores: `DraftService.gs`.
- Imágenes: `ImageService.gs`.
- Historial: `HistoryService.gs`.
- PDF: `PdfService.gs`.
- Respaldo: `BackupService.gs`.
- Utilidades: `Utils.gs`.

## Frontend

- `index.html`: estructura.
- `styles.html`: estilos.
- `client.html`: comportamiento del navegador.

## Principios

- Base vacía.
- Validaciones backend.
- Escrituras por lote cuando corresponda.
- Sin datos del HTML de referencia.
- Sin frameworks externos.
