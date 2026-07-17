# Estándar de Configuración Zona 3 Línea 2

Aplicación web empresarial para consultar y administrar fichas técnicas de configuración de Zona 3 Línea 2.

## Estado del proyecto

Fase actual: base inicial implementada.

La base de datos comienza completamente vacía. El archivo `referencias/MANUAL Z3 PRUEBA.html` se mantiene solo como referencia visual y no aporta datos, productos, parámetros ni lógica al sistema nuevo.

## Tecnologías

- Google Apps Script
- HTML Service
- HTML5, CSS y JavaScript
- Google Sheets como almacenamiento inicial
- Google Drive para imágenes y respaldos
- clasp para desarrollo local
- Git y GitHub para control de versiones

## Decisiones aprobadas

- Acceso: cualquier cuenta Google autenticada puede entrar si conoce el enlace.
- No hay roles; todos los usuarios con acceso a la web pueden administrar.
- Imágenes: solo PNG, máximo 1 MB.
- PDF: sin imágenes para mantenerlo liviano.
- Borradores: edición bloqueada por usuario, sin edición simultánea.
- Historial: registro general y detalle campo a campo.
- Respaldo: ZIP con CSV por hoja y JSON maestro.
- Zona horaria: `America/Santiago`.

## Estructura

- `src/`: código Apps Script y frontend HTML Service.
- `docs/`: documentación maestra, arquitectura, datos, seguridad, pruebas y despliegue.
- `branding/`: logo, favicon e iconos disponibles.
- `referencias/`: material visual de referencia.
- `skills/`: reglas locales de trabajo del proyecto.

## Preparación con clasp

1. Crear un Google Sheets nuevo y un proyecto de Apps Script nuevo.
2. Configurar el ID del spreadsheet y carpetas Drive en `src/Config.gs`.
3. Ejecutar `clasp login` si no existe sesión local.
4. Crear o asociar el proyecto Apps Script:

```powershell
clasp create --type webapp --title "Estándar de Configuración Zona 3 Línea 2" --rootDir src
```

5. Subir el código:

```powershell
clasp push
```

6. En Apps Script, ejecutar `setupDatabase()` una vez para crear las hojas vacías.
7. Desplegar como aplicación web con acceso para usuarios autenticados con Google.

## Validación rápida

- La pantalla inicial debe cargar sin datos de ejemplo.
- La opción de configuración debe permitir preparar catálogos vacíos.
- `setupDatabase()` debe crear solo encabezados, sin registros funcionales.
- Los PNG mayores a 1 MB deben ser rechazados.
- El PDF no debe incluir imágenes.
