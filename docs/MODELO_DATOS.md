# Modelo de Datos

## Hojas

- `CONFIGURACION`
- `CATEGORIAS`
- `BOTELLAS`
- `CATEGORIA_BOTELLA`
- `ARTICULOS`
- `SECCIONES`
- `CAMPOS`
- `UNIDADES`
- `VALORES_ARTICULO`
- `IMAGENES_ARTICULO`
- `BORRADORES`
- `VALORES_BORRADOR`
- `BORRADORES_DESCARTADOS`
- `HISTORIAL_EVENTOS`
- `HISTORIAL_DETALLE`
- `BLOQUEOS`
- `ERRORES_LOG`
- `RESPALDOS_LOG`

## Reglas

- `codigoArticulo` es único en todo el sistema.
- Las relaciones categoría-botella viven en `CATEGORIA_BOTELLA`.
- Los valores dinámicos viven en tablas verticales.
- Las imágenes guardan metadatos, no binarios.
- Los borradores descartados no se eliminan.
- Cada tabla administrable usa auditoría básica: fechas, usuario y versión.
