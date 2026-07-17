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

1. Google Sheets corporativo creado desde `clasp` con `cnavarrol@vspt.cl`.
2. Configurar las carpetas Drive corporativas en `src/Config.gs` cuando queden creadas.
3. Ejecutar `clasp login` con `cnavarrol@vspt.cl` si no existe sesión local.
4. Crear o asociar el proyecto Apps Script:

```powershell
clasp create --type webapp --title "Estándar de Configuración Zona 3 Línea 2" --rootDir src
```

5. Subir el código:

```powershell
clasp push
```

6. En Apps Script, ejecutar `setupDatabase()` una vez para validar las hojas vacías.
7. Desplegar como aplicación web con acceso para usuarios autenticados con Google.

## Propiedad de recursos Google

Todos los recursos definitivos deben pertenecer a la cuenta corporativa `cnavarrol@vspt.cl`.

Los recursos creados por error en Gmail fueron eliminados antes de continuar.

Google Sheets corporativo:

- https://docs.google.com/spreadsheets/d/1vdFkhk0nGzlnX_aZ80l9hmSdHhD3_LSQOVBdXbURH6A/edit

Apps Script corporativo:

- https://script.google.com/d/1mgAMib7TF1n0vjTiuAghftgrqVD-A2sLN5cGZcxoplLwYREKXHsuak2h/edit

Despliegue web inicial:

- https://script.google.com/macros/s/AKfycbyVNTQFjcytiBD-TtvkFmenqjmNqvV4aMVHSFYaF4GrztzxATuzKRRNvW4QMjZi15Q/exec

Despliegue con permisos mínimos:

- https://script.google.com/macros/s/AKfycbzP9DuZ3rIG6NBU49a7BR6xFtjHWTggIMKCHQDAFIvm-MjBFumFqa_0_UYvCMgCbdBP/exec

Despliegue sin autorización por usuario:

- https://script.google.com/macros/s/AKfycbyOz1p3Ifv3iK12IahQJ3vazLx2_PPAjk47ekFQtKnlfTa6LFdXwqQZWCLXJiJjcW8u/exec

## Validación rápida

- La pantalla inicial debe cargar sin datos de ejemplo.
- La opción de configuración debe permitir preparar catálogos vacíos.
- `setupDatabase()` debe crear solo encabezados, sin registros funcionales.
- Los PNG mayores a 1 MB deben ser rechazados.
- El PDF no debe incluir imágenes.
