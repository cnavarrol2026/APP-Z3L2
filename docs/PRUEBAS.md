# Pruebas

## Pruebas mínimas por fase

- `setupDatabase()` crea hojas y encabezados sin datos.
- La app carga sin registros de ejemplo.
- Acceso bloquea si no existe usuario identificable.
- Catálogos evitan duplicados.
- Selectores muestran solo activos.
- Código de artículo duplicado se rechaza.
- Borrador bloqueado no permite edición simultánea.
- Descarte exige motivo.
- Recuperación registra historial.
- PNG no válido se rechaza.
- PNG mayor a 1 MB se rechaza.
- PDF se genera sin imágenes.
- Respaldo ZIP contiene CSV y JSON.
- Textos visibles mantienen tildes y ñ.
